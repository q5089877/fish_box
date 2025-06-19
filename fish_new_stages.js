// Food class
class Food {
    constructor(x, y, aquariumContainer, foodEmoji) {
        this.x = x;
        this.y = y;
        this.emoji = foodEmoji;
        this.size = 20; // Food particle size in pixels
        this.element = document.createElement('div');
        this.element.className = 'food-particle';
        this.element.textContent = this.emoji; // Display the emoji
        this.element.style.position = 'absolute';
        this.element.style.fontSize = `${this.size}px`;
        // Center the emoji at (x,y)
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.transform = 'translate(-50%, -50%)';
        this.element.style.zIndex = '50'; // Ensure food is visible
        this.element.style.userSelect = 'none'; // Prevent text selection on food

        aquariumContainer.appendChild(this.element);
        this.isEaten = false;

        // For sinking/drifting behavior
        this.sinkSpeed = 10 + Math.random() * 20; // Pixels per second
        this.aquariumHeight = aquariumContainer.clientHeight;
    }

    update(deltaTime) {
        if (this.isEaten || !this.element) return;

        this.y += this.sinkSpeed * deltaTime;

        const bottomBoundary = this.aquariumHeight - (this.size / 2);
        if (this.y > bottomBoundary) {
            this.y = bottomBoundary;
        }
        this.element.style.top = `${this.y}px`;
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null; // Help with garbage collection
    }
}

class Fish {
    constructor(id, aquariumWidth, aquariumHeight, fishEmoji, fishSize) {
        this.id = id; // 魚的唯一標識
        this.aquariumWidth = aquariumWidth; // 魚缸寬度
        this.aquariumHeight = aquariumHeight; // 魚缸高度

        // 位置和方向
        this.x = Math.random() * aquariumWidth; // 初始隨機 x 座標
        this.y = Math.random() * aquariumHeight; // 初始隨機 y 座標
        this.angle = Math.random() * 2 * Math.PI; // 初始隨機角度 (弧度)

        // 目標
        this.targetX = Math.random() * aquariumWidth;
        this.targetY = Math.random() * aquariumHeight;

        // 移動屬性
        this.speed = 1 + Math.random() * 1; // 基礎速度 (pixels per 60 frames)
        this.turnSpeed = 0.05 + Math.random() * 0.05; // 轉向速度 (radians per 60 frames)
        this.isPaused = false;
        this.pauseEndTime = 0;

        // 成長相關屬性已移除

        // Emoji 相關
        this.emoji = fishEmoji; // 從建構函式參數獲取
        this.size = fishSize; // 魚的固定大小 (取代 baseFontSize 和 growth)

        // 尺寸相關 (基於實例的 size)
        this.frameWidth = this.size; // Emoji 的近似寬度
        this.frameHeight = this.size; // Emoji 的近似高度

        // DOM 元素 (在創建實例後，由外部賦值)
        this.element = null;

        // 餵食相關
        this.isSeekingFood = false;
        this.foodTarget = null;
    }

    /**
     * 設定魚的 DOM 元素，用於視覺更新
     * @param {HTMLElement} element
     */
    setElement(element) {
        this.element = element;
        if (this.element) {
            this.element.style.position = 'absolute'; // 確保可以定位
            this.element.textContent = this.emoji;
            this.element.style.fontSize = `${this.size}px`;
            this.updateElementStyle();
        }
    }

    /**
     * 更新魚的狀態 (每幀調用)
     * @param {number} deltaTime - 自上一幀以來的時間差 (秒)，如果使用 requestAnimationFrame
     * @param {Fish[]} allFishes - 魚缸中所有魚的列表，用於碰撞檢測
     * @param {Food[]} allFoods - 魚缸中所有食物的列表
     */
    update(deltaTime = 1 / 60, allFishes = [], allFoods = []) { // 假設默認 60 FPS
        if (this.isPaused) {
            if (Date.now() > this.pauseEndTime) {
                this.isPaused = false;
                // 如果暫停結束且沒有食物目標，則設定新隨機目標
                if (!this.isSeekingFood) {
                    this.setNewTarget();
                }
            }
            return; // 暫停時不進行移動
        }

        // 1. 隨機暫停 (僅在不尋找食物時)
        if (!this.isSeekingFood && Math.random() < 0.001) {
            this.isPaused = true;
            this.pauseEndTime = Date.now() + (1000 + Math.random() * 2000); // 暫停 1-3 秒
            return;
        }

        // 1.5. 尋找食物邏輯
        if (!this.isSeekingFood || !this.foodTarget || this.foodTarget.isEaten) {
            this.foodTarget = this.findClosestFood(allFoods);
            if (this.foodTarget) {
                this.isSeekingFood = true;
                this.targetX = this.foodTarget.x;
                this.targetY = this.foodTarget.y;
                this.isPaused = false; // 如果找到食物，則取消暫停
            } else {
                this.isSeekingFood = false;
                // 如果剛失去食物目標或沒有目標，設定一個新隨機目標
                if (this.targetX === (this.foodTarget ? this.foodTarget.x : null) || // 檢查是否目標還是舊食物
                    Math.sqrt(Math.pow(this.targetX - this.x, 2) + Math.pow(this.targetY - this.y, 2)) < 20) {
                    this.setNewTarget();
                }
            }
        } else if (this.isSeekingFood && this.foodTarget) {
            // 持續追蹤食物
            this.targetX = this.foodTarget.x;
            this.targetY = this.foodTarget.y;
        }

        // 2. 計算到目標點的距離和角度
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
        const targetAngle = Math.atan2(dy, dx);

        // 3. 轉向
        let angleDifference = targetAngle - this.angle;
        // 確保轉向最短路徑 (將角度差正規化到 -PI 到 PI 之間)
        while (angleDifference > Math.PI) angleDifference -= 2 * Math.PI;
        while (angleDifference < -Math.PI) angleDifference += 2 * Math.PI;

        const turnStep = this.turnSpeed * (deltaTime * 60); // 根據 deltaTime 調整轉速
        if (Math.abs(angleDifference) > 0.01) { // 只有在角度差較大時才轉向
            if (Math.abs(angleDifference) > turnStep) {
                this.angle += Math.sign(angleDifference) * turnStep;
            } else {
                this.angle = targetAngle;
            }
            // 再次正規化角度，保持在 0 到 2*PI
            this.angle = (this.angle + 2 * Math.PI) % (2 * Math.PI);
        }

        // 4. 移動
        const currentSpeed = this.speed * (deltaTime * 60); // 根據 deltaTime 調整速度
        this.x += Math.cos(this.angle) * currentSpeed;
        this.y += Math.sin(this.angle) * currentSpeed;

        // 5. 邊界檢測與處理 (簡單反彈或設定新目標)
        // this.handleBoundaryCollision(); // Old boundary handling
        this.checkOutOfBoundsAndReturn(); // Use the new boundary handling
        // 6. 到達目標點後設定新目標
        if (distanceToTarget < 20) { // 接近目標點
            if (this.isSeekingFood && this.foodTarget && !this.foodTarget.isEaten) {
                // 吃到食物
                const distanceToFoodCenter = Math.sqrt(Math.pow(this.foodTarget.x - this.x, 2) + Math.pow(this.foodTarget.y - this.y, 2));
                if (distanceToFoodCenter < (this.size / 3 + this.foodTarget.size / 2)) { // 調整碰撞檢測使其更精確
                    this.foodTarget.isEaten = true;
                    this.isSeekingFood = false;
                    this.foodTarget = null;
                    this.setNewTarget(); // 吃完後設定新目標
                    this.speed = 0.8 + Math.random() * 1.4; // 吃完後可能改變速度
                }
            } else if (!this.isSeekingFood) {
                // 到達隨機目標點
                this.setNewTarget();
                this.speed = 0.8 + Math.random() * 1.4;
            }
        }

        // 7. 與其他魚的碰撞檢測與躲避
        if (allFishes) {
            for (const otherFish of allFishes) {
                if (otherFish.id === this.id) continue; // 不與自己檢測
                if (!otherFish.element) continue; // 如果對方魚還未完全初始化

                const dxFish = otherFish.x - this.x;
                const dyFish = otherFish.y - this.y;
                const distanceFish = Math.sqrt(dxFish * dxFish + dyFish * dyFish);

                // 使用 frameWidth (基於 baseFontSize) 和 currentVisualScale 估算半徑
                const myRadius = this.frameWidth / 2; // 使用 fish.size
                const otherRadius = otherFish.frameWidth / 2; // 使用 otherFish.size

                if (distanceFish < myRadius + otherRadius) {
                    // 碰撞檢測到！設置新的目標以躲避
                    const repulsionAngle = Math.atan2(this.y - otherFish.y, this.x - otherFish.x); // 從 otherFish 指向 thisFish 的角度
                    const repulsionDistance = 30 + Math.random() * 40; // 躲避目標的距離

                    this.targetX = this.x + Math.cos(repulsionAngle) * repulsionDistance;
                    this.targetY = this.y + Math.sin(repulsionAngle) * repulsionDistance;

                    // 確保新目標在邊界內
                    const boundaryMargin = 20; // 邊界緩衝
                    this.targetX = Math.max(boundaryMargin, Math.min(this.aquariumWidth - boundaryMargin, this.targetX));
                    this.targetY = Math.max(boundaryMargin, Math.min(this.aquariumHeight - boundaryMargin, this.targetY));

                    // 可以選擇立即稍微改變角度或增加一點速度
                    // this.angle = repulsionAngle; // 可能太突兀
                    break; // 每幀只處理一次碰撞躲避
                }
            }
        }
        // 8. 更新 DOM 元素樣式 (移除了 updateAnimationFrame)
        if (this.element) {
            this.updateElementStyle();
        }
    }

    /**
     * 尋找最近的未被吃掉的食物
     * @param {Food[]} allFoods - 所有食物的列表
     * @returns {Food|null} 最近的食物對象，如果沒有則返回 null
     */
    findClosestFood(allFoods) {
        let closestFood = null;
        let minDistance = Infinity;
        const detectionRadius = this.size * 7; // 魚的偵測食物範圍，例如自身大小的5倍

        for (const food of allFoods) {
            if (food.isEaten) continue;

            const dx = food.x - this.x;
            const dy = food.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < minDistance && distance < detectionRadius) {
                minDistance = distance;
                closestFood = food;
            }
        }
        return closestFood;
    }

    /**
     * 檢查魚是否游出邊界太遠，如果是，則設定一個返回魚缸內的目標。
     * 魚的位置 (this.x, this.y) 是其中心點。
     * 這個方法應該替換掉舊的 handleBoundaryCollision 方法。
     */
    // 移除舊的 handleBoundaryCollision 方法定義 (如果存在且不使用)
    // 如果 handleBoundaryCollision 還有其他用途，則保留並在 update 中選擇呼叫哪個

    /**
     * 檢查魚是否游出邊界太遠，如果是，則設定一個返回魚缸內的目標。
     * 魚的位置 (this.x, this.y) 是其中心點。
     */
    checkOutOfBoundsAndReturn() {
        const offScreenBuffer = this.frameWidth * 1.5; // 允許魚游出自身寬度1.5倍的距離
        const returnTargetMargin = 50; // 返回目標點距離邊界的最小距離

        let needsNewTarget = false;

        // 檢查是否游出左邊界太遠
        if (this.x < -offScreenBuffer) {
            this.x = -offScreenBuffer; // 稍微拉回一點，避免無限遠離
            this.targetX = returnTargetMargin + Math.random() * (this.aquariumWidth - 2 * returnTargetMargin);
            this.targetY = returnTargetMargin + Math.random() * (this.aquariumHeight - 2 * returnTargetMargin);
            needsNewTarget = true;
        }
        // 檢查是否游出右邊界太遠
        else if (this.x > this.aquariumWidth + offScreenBuffer) {
            this.x = this.aquariumWidth + offScreenBuffer;
            this.targetX = returnTargetMargin + Math.random() * (this.aquariumWidth - 2 * returnTargetMargin);
            this.targetY = returnTargetMargin + Math.random() * (this.aquariumHeight - 2 * returnTargetMargin);
            needsNewTarget = true;
        }
        // 檢查是否游出上邊界太遠
        if (this.y < -offScreenBuffer) {
            this.y = -offScreenBuffer;
            this.targetY = returnTargetMargin + Math.random() * (this.aquariumHeight - 2 * returnTargetMargin);
            this.targetX = returnTargetMargin + Math.random() * (this.aquariumWidth - 2 * returnTargetMargin);
            needsNewTarget = true;
        }
        // 檢查是否游出下邊界太遠
        else if (this.y > this.aquariumHeight + offScreenBuffer) {
            this.y = this.aquariumHeight + offScreenBuffer;
            this.targetY = returnTargetMargin + Math.random() * (this.aquariumHeight - 2 * returnTargetMargin);
            this.targetX = returnTargetMargin + Math.random() * (this.aquariumWidth - 2 * returnTargetMargin);
            needsNewTarget = true;
        }

        if (needsNewTarget) {
            // 可以選擇稍微改變一下速度或轉向速度，讓回游更自然
            this.speed = 1 + Math.random() * 1; // 重設一個隨機速度
        }
    }

    /**
     * 設定一個新的隨機目標點
     */
    setNewTarget() {
        // 避免目標點太靠近當前位置或邊界
        const margin = 50;
        this.targetX = margin + Math.random() * (this.aquariumWidth - 2 * margin);
        this.targetY = margin + Math.random() * (this.aquariumHeight - 2 * margin);
    }
    /**
     * 更新魚的 DOM 元素的 CSS 樣式
     */
    updateElementStyle() {
        if (!this.element) return;

        // 判斷魚的運動方向是否朝左
        // this.angle = 0 是朝右, PI 是朝左
        const isMovingLeft = this.angle > Math.PI / 2 && this.angle < 3 * Math.PI / 2;

        let scaleXToApply;
        let effectiveRotation = this.angle;

        // 假設 Emoji (如 🐠) 默認朝左。如果移動向右，則翻轉。
        if (isMovingLeft) {
            // 移動向左，Emoji 朝左，不翻轉
            scaleXToApply = 1;
            effectiveRotation = this.angle - Math.PI; // Adjust rotation for left-facing emoji
        } else {
            // 移動向右，Emoji 朝左，需要翻轉
            scaleXToApply = -1; // Flip horizontally
            // effectiveRotation remains this.angle
        }

        // 使用 frameWidth/Height (基於 this.size) 進行居中
        // Emoji 的視覺中心可能需要微調，但這是一個好的開始
        const currentDisplayWidth = this.frameWidth;
        const currentDisplayHeight = this.frameHeight;

        const translateX = this.x - (currentDisplayWidth / 2);
        const translateY = this.y - (currentDisplayHeight / 2);

        this.element.style.fontSize = `${this.size}px`; // Ensure font size is based on this.size
        this.element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${effectiveRotation}rad) scaleX(${scaleXToApply}) scaleY(1)`;
    }
}
