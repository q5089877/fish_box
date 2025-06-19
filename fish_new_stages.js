class Fish {
    constructor(id, aquariumWidth, aquariumHeight, growthStagesConfig, fishEmoji, baseFishFontSize) {
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

        // 成長相關
        this.spawnDate = Date.now();
        this.currentGrowthPercentage = 0; // 0 to 1
        this.currentStageKey = 'small'; // 初始階段
        this.growthStages = growthStagesConfig; // { small: {...}, medium: {...}, large: {...} }

        // Emoji 相關
        this.emoji = fishEmoji; // 從建構函式參數獲取
        this.baseFontSize = baseFishFontSize; // 從建構函式參數獲取

        // 尺寸相關 (基於實例的 baseFontSize)
        this.frameWidth = this.baseFontSize; // Emoji 的近似寬度
        this.frameHeight = this.baseFontSize; // Emoji 的近似高度

        this.currentVisualScale = 1.0; // 用於在一個階段內進行微調縮放
        // DOM 元素 (在創建實例後，由外部賦值)
        this.element = null;

        // 初始化時根據初始階段設定動畫屬性
        this.setStage(this.currentStageKey);
    }

    /**
     * 設定魚的 DOM 元素，用於視覺更新
     * @param {HTMLElement} element
     */
    setElement(element) {
        this.element = element;
        if (this.element) {
            this.element.style.position = 'absolute'; // 確保可以定位
            this.applyCurrentStageToElement(); // 應用當前階段的樣式
            this.updateElementStyle();
        }
    }

    /**
     * 根據成長階段 key 設定魚的動畫相關屬性
     * @param {string} stageKey - 'small', 'medium', or 'large'
     */
    setStage(stageKey) {
        if (this.growthStages && this.growthStages[stageKey]) {
            const stageConfig = this.growthStages[stageKey];
            this.currentStageKey = stageKey;
            // this.emoji 和 this.baseFontSize 已在建構函式中設定，
            // 不再從 stageConfig 中讀取。

            // 基於實例的 baseFontSize (已設定) 設定近似的 frameWidth 和 frameHeight
            // 假設 Emoji 大致是方形的
            this.frameWidth = this.baseFontSize;
            this.frameHeight = this.baseFontSize;

            if (this.element) {
                this.applyCurrentStageToElement();
            }
        }
    }

    /**
     * 將當前成長階段的基礎樣式應用到 DOM 元素
     */
    applyCurrentStageToElement() {
        if (!this.element || !this.emoji) return; // 使用實例的 emoji
        this.element.textContent = this.emoji;
        // 初始字體大小使用實例的 baseFontSize，並由 currentVisualScale 調整
        this.element.style.fontSize = `${this.baseFontSize * this.currentVisualScale}px`;
    }


    /**
     * 更新魚的狀態 (每幀調用)
     * @param {number} deltaTime - 自上一幀以來的時間差 (秒)，如果使用 requestAnimationFrame
     * @param {Fish[]} allFishes - 魚缸中所有魚的列表，用於碰撞檢測
     */
    update(deltaTime = 1 / 60, allFishes = []) { // 假設默認 60 FPS
        if (this.isPaused) {
            if (Date.now() > this.pauseEndTime) {
                this.isPaused = false;
                this.setNewTarget();
            }
            return; // 暫停時不進行移動
        }

        // 1. 隨機暫停
        if (Math.random() < 0.001) { // 非常小的機率觸發暫停
            this.isPaused = true;
            this.pauseEndTime = Date.now() + (1000 + Math.random() * 2000); // 暫停 1-3 秒
            return;
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
            this.setNewTarget();
            this.speed = 0.8 + Math.random() * 1.4;
        }

        // 7. 與其他魚的碰撞檢測與躲避
        if (allFishes) {
            for (const otherFish of allFishes) {
                if (otherFish.id === this.id) continue; // 不與自己檢測

                const dxFish = otherFish.x - this.x;
                const dyFish = otherFish.y - this.y;
                const distanceFish = Math.sqrt(dxFish * dxFish + dyFish * dyFish);

                // 使用 frameWidth (基於 baseFontSize) 和 currentVisualScale 估算半徑
                const myRadius = (this.frameWidth * this.currentVisualScale) / 2;
                const otherRadius = (otherFish.frameWidth * otherFish.currentVisualScale) / 2;

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
        const offScreenBuffer = this.frameWidth * this.currentVisualScale * 1.5; // 允許魚游出自身寬度1.5倍的距離
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
        let rotationToApply;

        // 假設 Emoji (如 🐠) 默認朝左。如果移動向右，則翻轉。
        if (isMovingLeft) {
            // 移動向左，Emoji 朝左，不翻轉
            scaleXToApply = this.currentVisualScale;
            rotationToApply = this.angle - Math.PI;
        } else {
            // 移動向右，Emoji 朝左，需要翻轉
            scaleXToApply = -this.currentVisualScale;
            rotationToApply = this.angle;
        }

        // 使用 frameWidth/Height (基於 baseFontSize) 和 currentVisualScale 進行居中
        // Emoji 的視覺中心可能需要微調，但這是一個好的開始
        const currentDisplayWidth = this.frameWidth * this.currentVisualScale;
        const currentDisplayHeight = this.frameHeight * this.currentVisualScale;

        const translateX = this.x - (currentDisplayWidth / 2);
        const translateY = this.y - (currentDisplayHeight / 2);

        this.element.style.fontSize = `${this.baseFontSize * this.currentVisualScale}px`;

        this.element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${rotationToApply}rad) scaleX(${scaleXToApply}) scaleY(${this.currentVisualScale})`;
    }

    /**
     * @param {number} totalGrowthPeriodDays - 總成長所需天數 (例如 90)
     */
    updateGrowth(totalGrowthPeriodDays = 90) {
        const ageInMillis = Date.now() - this.spawnDate;
        const ageInDays = ageInMillis / (1000 * 60 * 60 * 24);
        this.currentGrowthPercentage = Math.min(1, ageInDays / totalGrowthPeriodDays);

        let newStageKey = 'small';
        let stageProgress = 0; // 當前階段內的成長進度 (0-1)

        if (this.currentGrowthPercentage < this.growthStages.small.threshold) { // 例如 0.33
            newStageKey = 'small';
            stageProgress = this.currentGrowthPercentage / this.growthStages.small.threshold;
        } else if (this.currentGrowthPercentage < this.growthStages.medium.threshold) { // 例如 0.66
            newStageKey = 'medium';
            stageProgress = (this.currentGrowthPercentage - this.growthStages.small.threshold) /
                            (this.growthStages.medium.threshold - this.growthStages.small.threshold);
        } else {
            newStageKey = 'large';
            stageProgress = (this.currentGrowthPercentage - this.growthStages.medium.threshold) /
                            (1 - this.growthStages.medium.threshold);
        }

        if (this.currentStageKey !== newStageKey) {
            this.setStage(newStageKey);
        }

        // 計算當前階段內的微調縮放 (例如，從該階段基礎大小的 0.7 倍長到 1.2 倍)
        // 假設每個 stageConfig 有 minScale 和 maxScale
        const stageConf = this.growthStages[this.currentStageKey];
        const minScaleInStage = stageConf.minScaleInStage || 0.7;
        const maxScaleInStage = stageConf.maxScaleInStage || 1.2;
        this.currentVisualScale = minScaleInStage + stageProgress * (maxScaleInStage - minScaleInStage);
        this.currentVisualScale = Math.max(minScaleInStage, Math.min(maxScaleInStage, this.currentVisualScale));


        if (this.element) {
            this.updateElementStyle(); // 確保縮放被應用
        }
    }
}
