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

class Bubble {
    constructor(x, y, aquariumContainer) {
        this.x = x; // Initial x position (center of bubble)
        this.y = y; // Initial y position (center of bubble)
        // TEMPORARY: Make bubbles bigger and more visible for debugging
        this.size = 10 + Math.random() * 5; // Bubble size: 10px to 15px diameter
        this.element = document.createElement('div');
        this.element.className = 'bubble'; // For potential CSS styling
        this.element.style.position = 'absolute';
        this.element.style.width = `${this.size}px`;
        this.element.style.height = `${this.size}px`;
        // TEMPORARY: Bright red color for debugging
        this.element.style.backgroundColor = 'red';
        // this.element.style.backgroundColor = 'rgba(200, 225, 255, 0.5)'; // Original: Light blue, semi-transparent
        this.element.style.borderRadius = '50%';
        this.element.style.zIndex = '5'; // Below fish (10), above transformed seaweed (1)
        this.element.style.userSelect = 'none';
        // Set initial position based on center
        this.element.style.left = `${this.x - this.size / 2}px`;
        this.element.style.top = `${this.y - this.size / 2}px`;
        aquariumContainer.appendChild(this.element);
        // console.log('Bubble created and appended:', this.element, 'at x:', this.x, 'y:', this.y); // Optional: for console debugging

        this.riseSpeed = (15 + Math.random() * 25); // Pixels per second
        this.swayFrequency = (0.3 + Math.random() * 0.4); // Sway cycles per second (e.g., 0.3 to 0.7 Hz)
        this.swayAmplitude = Math.random() * 2 + 1;  // Sway distance in pixels
        this.initialX = x; // Store initial X for sway calculation relative to it
        this.lifeSpan = 2.5 + Math.random() * 3; // Bubble lifetime in seconds (2.5 to 5.5s)
        this.age = 0;
    }

    update(deltaTime) {
        this.age += deltaTime;
        if (this.age > this.lifeSpan || this.y + this.size < 0) { // If lifetime exceeded or off-screen (top)
            this.remove();
            return false; // Indicate it should be removed from manager array
        }

        this.y -= this.riseSpeed * deltaTime;
        // Sway calculation: sin wave based on age and frequency, around initialX
        const currentSway = Math.sin(this.age * this.swayFrequency * 2 * Math.PI) * this.swayAmplitude;
        this.element.style.left = `${this.initialX - this.size / 2 + currentSway}px`;
        this.element.style.top = `${this.y - this.size / 2}px`;

        // Fade out bubble towards the end of its life
        const opacity = Math.max(0, 1 - (this.age / (this.lifeSpan * 0.9))); // Start fading a bit before end
        this.element.style.opacity = opacity.toString();
        return true; // Still active
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null; // Help with garbage collection
    }
}

class Fish {
    constructor(id, aquariumWidth, aquariumHeight, fishEmoji, fishSize, aquariumContainer, behaviorType = 'normal') {
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

        // 行為相關屬性 (將在下方根據 behaviorType 初始化)
        this.behaviorType = behaviorType;

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

        this.isTransforming = false; // 新增：標記魚是否準備轉換
        this.MAX_SIZE = 100;         // 新增：魚的最大尺寸

        // Bubble related
        this.aquariumContainer = aquariumContainer; // Store the container for bubbles
        this.bubbles = []; // Array to hold this fish's bubbles
        this.bubbleSpawnTimer = Math.random() * 2; // Initial random delay for first bubble
        this.bubbleSpawnInterval = 2.5 + Math.random() * 3; // Spawn bubble every 2.5-5.5 seconds

        // 初始化行為參數
        this.isPaused = false;
        this.pauseEndTime = 0;
        this._initializeBehaviorParameters();
    }

    _initializeBehaviorParameters() {
        // 預設 (normal)
        this.baseSpeedMin = 20; // 速度單位改為 像素/秒
        this.baseSpeedMax = 50;
        this.turnSpeedMin = 1.5; // 轉向速度單位改為 弧度/秒
        this.turnSpeedMax = 3.0;
        this.pauseChance = 0.0002; // 每幀暫停的機率 (約每 8 秒一次，如果 60fps)
        this.minPauseDuration = 800; // ms
        this.maxPauseDuration = 1500; // ms
        this.foodDetectionMultiplier = 6; // 偵測食物範圍 = 魚大小 * 此倍數

        if (this.behaviorType === 'active') {
            this.baseSpeedMin = 45;
            this.baseSpeedMax = 90;
            this.turnSpeedMin = 2.5;
            this.turnSpeedMax = 4.5;
            this.pauseChance = 0.0008; // 非常不常暫停 (約每 20 秒一次)
            this.minPauseDuration = 300;
            this.maxPauseDuration = 1000;
            this.foodDetectionMultiplier = 8;
        } else if (this.behaviorType === 'shy') {
            this.baseSpeedMin = 20;
            this.baseSpeedMax = 40;
            this.turnSpeedMin = 1.5;
            this.turnSpeedMax = 2.5;
            this.pauseChance = 0.001; // 調整：降低暫停頻率 (約每 5-6 秒一次 @60fps)
            this.minPauseDuration = 1200;
            this.maxPauseDuration = 2500;
            this.foodDetectionMultiplier = 6;
            // 害羞的魚在設定新目標時，更傾向於魚缸的下半部分
        }

        // 根據範圍設定初始隨機速度和轉向速度
        this.speed = this.baseSpeedMin + Math.random() * (this.baseSpeedMax - this.baseSpeedMin);
        this.turnSpeed = this.turnSpeedMin + Math.random() * (this.turnSpeedMax - this.turnSpeedMin);
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
            this.element.style.zIndex = '10'; // 將魚的 z-index 設定為 10
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
        if (this.isTransforming) return; // 如果正在轉換，則不執行任何操作

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
        if (!this.isSeekingFood && Math.random() < this.pauseChance) {
            this.isPaused = true;
            this.pauseEndTime = Date.now() + (this.minPauseDuration + Math.random() * (this.maxPauseDuration - this.minPauseDuration));
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

        const turnStep = this.turnSpeed * deltaTime; // 轉速單位已是 弧度/秒
        if (Math.abs(angleDifference) > 0.01) { // 只有在角度差較大時才轉向
            if (Math.abs(angleDifference) > turnStep) {
                this.angle += Math.sign(angleDifference) * turnStep;
            } else {
                this.angle = targetAngle;
            }
            // 再次正規化角度，保持在 0 到 2*PI (或 -PI 到 PI，取決於偏好)
            this.angle = (this.angle + 2 * Math.PI) % (2 * Math.PI);
        }

        // 4. 移動
        const currentSpeed = this.speed * deltaTime; // 速度單位已是 像素/秒
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

                    // 魚成長邏輯
                    if (this.size < this.MAX_SIZE) {
                        this.size += 4;
                        this.frameWidth = this.size; // 更新碰撞檢測的尺寸
                        this.frameHeight = this.size;
                        // 立刻更新樣式以顯示成長後的大小
                        if (this.element) this.updateElementStyle();
                    }

                    if (this.size >= this.MAX_SIZE) {
                        this.isTransforming = true; // 達到最大尺寸，標記轉換
                    } else {
                        this.setNewTarget(); // 吃完後設定新隨機目標
                    }
                    // 吃完後重新隨機化速度 (所有類型都適用，活躍的魚變化可能更明顯)
                    this.speed = this.baseSpeedMin + Math.random() * (this.baseSpeedMax - this.baseSpeedMin);
                }
            } else if (!this.isSeekingFood) {
                // 到達隨機目標點
                this.setNewTarget();
                // 到達目標後重新隨機化速度 (所有類型都適用)
                this.speed = this.baseSpeedMin + Math.random() * (this.baseSpeedMax - this.baseSpeedMin);
                // 活躍的魚在到達目標後，可以有一定機率再次改變轉向速度，增加不可預測性
                if (this.behaviorType === 'active' && Math.random() < 0.3) {
                    this.turnSpeed = this.turnSpeedMin + Math.random() * (this.turnSpeedMax - this.turnSpeedMin);
                }
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
            // 立即推開彼此
            const overlap = myRadius + otherRadius - distanceFish + 1; // +1避免浮點誤差
            const repulsionAngle = Math.atan2(this.y - otherFish.y, this.x - otherFish.x);

            // 自己往外推
            this.x += Math.cos(repulsionAngle) * (overlap / 2);
            this.y += Math.sin(repulsionAngle) * (overlap / 2);
            // 若你想兩邊都推（可選）：解開註解
            // otherFish.x -= Math.cos(repulsionAngle) * (overlap / 2);
            // otherFish.y -= Math.sin(repulsionAngle) * (overlap / 2);

            // 設定新的目標點
            let repulsionDistance = 30 + Math.random() * 40;
            if (this.behaviorType === 'shy') {
                repulsionDistance = 60 + Math.random() * 50;
            }
            this.targetX = this.x + Math.cos(repulsionAngle) * repulsionDistance;
            this.targetY = this.y + Math.sin(repulsionAngle) * repulsionDistance;

            // 提高速度，讓分開更快
            this.speed = this.baseSpeedMax;

            // 邊界處理
            const boundaryMargin = 20;
            this.targetX = Math.max(boundaryMargin, Math.min(this.aquariumWidth - boundaryMargin, this.targetX));
            this.targetY = Math.max(boundaryMargin, Math.min(this.aquariumHeight - boundaryMargin, this.targetY));

            // 害羞的魚在躲避後有更高機率暫停
            if (this.behaviorType === 'shy' && Math.random() < 0.5) {
                this.isPaused = true;
                this.pauseEndTime = Date.now() + (this.minPauseDuration + Math.random() * (this.maxPauseDuration - this.minPauseDuration));
            }
            break; // 每幀只處理一次碰撞躲避
        }
    }
}

        
        // 8. 更新 DOM 元素樣式 (移除了 updateAnimationFrame)
        if (this.element && !this.isTransforming) { // 只有在不轉換時才更新樣式
            this.updateElementStyle();
        }

        // Bubble spawning logic
        if (!this.isTransforming && this.aquariumContainer) {
            this.bubbleSpawnTimer += deltaTime;
            // Bubbles spawn a bit less frequently if fish is paused
            const currentEffectiveInterval = this.isPaused ? this.bubbleSpawnInterval * 2.0 : this.bubbleSpawnInterval;

            if (this.bubbleSpawnTimer > currentEffectiveInterval && this.bubbles.length < 5) { // Limit concurrent bubbles per fish
                this.spawnBubble();
                this.bubbleSpawnTimer = 0; // Reset timer
                this.bubbleSpawnInterval = 2.5 + Math.random() * 3; // Randomize next interval
            }
        }
        // Update and clean up bubbles for this fish
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            if (!this.bubbles[i].update(deltaTime)) { // update returns false if bubble is to be removed
                this.bubbles.splice(i, 1);
            }
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
        const detectionRadius = this.size * this.foodDetectionMultiplier;

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
            // 根據行為類型重設一個隨機速度
            this.speed = this.baseSpeedMin + Math.random() * (this.baseSpeedMax - this.baseSpeedMin);
        }
    }

    /**
     * 設定一個新的隨機目標點
     */
    setNewTarget() {
        // 避免目標點太靠近當前位置或邊界
        const margin = 50;
        if (this.behaviorType === 'shy') {
            // 害羞的魚更喜歡魚缸的下半部，且更靠近邊緣
            this.targetX = Math.random() < 0.5 ? margin + Math.random() * (this.aquariumWidth * 0.3) : this.aquariumWidth - margin - Math.random() * (this.aquariumWidth * 0.3);
            this.targetY = (this.aquariumHeight / 2) + Math.random() * (this.aquariumHeight / 2 - margin);
        } else {
            this.targetX = margin + Math.random() * (this.aquariumWidth - 2 * margin);
            this.targetY = margin + Math.random() * (this.aquariumHeight - 2 * margin);
        }

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

    spawnBubble() {
        if (!this.aquariumContainer || !this.element) return; // Safety check

        // Approximate mouth position: slightly in front of the center, along the fish's angle.
        // Offset is relative to the fish's current size.
        const mouthOffsetRatio = 0.45; // How far from center towards the "front" (0.0 to 0.5)
        const offsetX = Math.cos(this.angle) * (this.size * mouthOffsetRatio);
        const offsetY = Math.sin(this.angle) * (this.size * mouthOffsetRatio);

        // Bubbles should ideally originate slightly above the fish's vertical center if it's horizontal,
        // or more directly in front if it's angled. This simple offset works as a general approximation.
        const bubbleX = this.x + offsetX;
        const bubbleY = this.y + offsetY - (this.size * 0.1); // Spawn slightly above the midline

        this.bubbles.push(new Bubble(bubbleX, bubbleY, this.aquariumContainer));
    }
}

// export { Food, Fish, Bubble }; // Removed export for global script usage
