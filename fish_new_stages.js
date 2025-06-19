class Fish {
    constructor(id, aquariumWidth, aquariumHeight, growthStagesConfig) {
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

        // 動畫相關 (將從 growthStages 中獲取)
        this.spriteSheetSrc = '';
        this.currentFrame = 0; // 雪碧圖當前幀
        this.frameCount = 4; // 雪碧圖總幀數 (會從配置讀取)
        this.frameHeight = 30; // 雪碧圖單幀高度 (從 setStage 移到此處以確保初始化)
        this.frameWidth = 50; // 雪碧圖單幀寬度
        this.animationSpeed = 0.2; // 雪碧圖動畫速度 (會從配置讀取)
        this.animationCounter = 0; // 用於控制動畫幀更新的計數器
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
            this.spriteSheetSrc = stageConfig.src;
            this.frameCount = stageConfig.frames;
            this.frameWidth = stageConfig.frameWidth;
            this.frameHeight = stageConfig.frameHeight;
            this.animationSpeed = stageConfig.animationSpeed || 0.2;
            this.currentFrame = 0; // 切換階段時重置動畫幀
            this.animationCounter = 0; // 切換階段時重置計數器

            if (this.element) {
                this.applyCurrentStageToElement();
            }
        }
    }

    /**
     * 將當前成長階段的基礎樣式應用到 DOM 元素
     */
    applyCurrentStageToElement() {
        if (!this.element || !this.spriteSheetSrc) return;
        // 假設統一使用 DIV 元素來顯示雪碧圖
        if (this.element.tagName === 'DIV') {
            this.element.style.backgroundImage = `url('${this.spriteSheetSrc}')`;
            this.element.style.width = `${this.frameWidth}px`;
            this.element.style.height = `${this.frameHeight}px`;
        } else if (this.element.tagName === 'IMG') { // 如果仍然需要兼容 IMG (例如用於 GIF)
            this.element.src = this.spriteSheetSrc; // 但雪碧圖動畫無法這樣工作
            this.element.style.width = `${this.frameWidth}px`; // For GIFs, frameWidth is the image width
            this.element.style.height = `${this.frameHeight}px`; // For GIFs, frameHeight is the image height
        }
    }


    /**
     * 更新魚的狀態 (每幀調用)
     * @param {number} deltaTime - 自上一幀以來的時間差 (秒)，如果使用 requestAnimationFrame
     */
    update(deltaTime = 1 / 60) { // 假設默認 60 FPS
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
        this.handleBoundaryCollision();

        // 6. 到達目標點後設定新目標
        if (distanceToTarget < 20) { // 接近目標點
            this.setNewTarget();
            this.speed = 0.8 + Math.random() * 1.4;
        }

        // 7. 更新雪碧圖動畫幀
        this.updateAnimationFrame(deltaTime);

        // 8. 更新 DOM 元素樣式
        if (this.element) {
            this.updateElementStyle();
        }
    }

    /**
     * 處理魚碰到魚缸邊界的邏輯
     */
    handleBoundaryCollision() {
        const margin = 10; // 邊界緩衝
        // 使用當前階段的 frameWidth/Height 和 currentVisualScale 來計算實際碰撞邊界
        const currentDisplayWidth = this.frameWidth * this.currentVisualScale;
        const currentDisplayHeight = this.frameHeight * this.currentVisualScale;


        if (this.x < margin) {
            this.x = margin;
            this.targetX = this.aquariumWidth - margin - Math.random() * (this.aquariumWidth / 3); // 游向另一邊
            this.targetY = Math.random() * this.aquariumHeight;
        } else if (this.x > this.aquariumWidth - margin - currentDisplayWidth) {
            this.x = this.aquariumWidth - margin - currentDisplayWidth;
            this.targetX = margin + Math.random() * (this.aquariumWidth / 3);
            this.targetY = Math.random() * this.aquariumHeight;
        }

        if (this.y < margin) {
            this.y = margin;
            this.targetY = this.aquariumHeight - margin - Math.random() * (this.aquariumHeight / 3);
            this.targetX = Math.random() * this.aquariumWidth;
        } else if (this.y > this.aquariumHeight - margin - currentDisplayHeight) {
            this.y = this.aquariumHeight - margin - currentDisplayHeight;
            this.targetY = margin + Math.random() * (this.aquariumHeight / 3);
            this.targetX = Math.random() * this.aquariumWidth;
        }

        // 註解掉的 if (collided) 區塊以及其對應的結束大括號已被移除，以修正語法錯誤。
        // 先前此處多餘的 '}' 導致了 "Unexpected token '{' " 錯誤。
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
     * 更新雪碧圖動畫幀
     */
    updateAnimationFrame(deltaTime) {
        this.animationCounter += deltaTime * 60 * this.animationSpeed; // 乘以60是為了將deltaTime的秒單位轉為幀單位思考
        if (this.animationCounter >= 1) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.animationCounter = 0;
        }
    }

    /**
     * 更新魚的 DOM 元素的 CSS 樣式
     */
    updateElementStyle() {
        if (!this.element) return;
        // 根據角度決定是否翻轉圖片 (假設原始圖片朝右)
        // PI/2 (90度) 到 3*PI/2 (270度) 之間是朝左
        const isFacingLeft = this.angle > Math.PI / 2 && this.angle < 3 * Math.PI / 2;
        // 結合階段內縮放 currentVisualScale
        const scaleX = isFacingLeft ? -this.currentVisualScale : this.currentVisualScale;
        const effectiveAngle = isFacingLeft ? this.angle - Math.PI : this.angle; // 翻轉後角度也要調整

        // 定位點調整為圖片中心
        const translateX = this.x - (this.frameWidth * this.currentVisualScale / 2);
        const translateY = this.y - (this.frameHeight * this.currentVisualScale / 2);

        this.element.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${effectiveAngle}rad) scaleX(${scaleX}) scaleY(${this.currentVisualScale})`;
        // 如果是 DIV 雪碧圖，才需要設定 backgroundPosition
        if (this.element.tagName === 'DIV') { // 確保只對 DIV 元素設定背景位置
            this.element.style.backgroundPosition = `-${this.currentFrame * this.frameWidth}px 0px`;
        }
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
