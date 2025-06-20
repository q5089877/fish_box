// main_app.js
// import { Food, Fish } from './fish_new_stages.js'; // Removed import, classes will be global

document.addEventListener('DOMContentLoaded', () => {
    const quoteContainer = document.getElementById('quote-container');
    const quoteTextElement = document.getElementById('quote-text');
    const aquariumContainer = document.getElementById('aquarium-container');
    const refreshButton = document.getElementById('refresh-button'); // 獲取按鈕元素

    // 佛經語錄數據 (範例)
// 佛經語錄數據（100 條擴充版）
const buddhistQuotes = [
  { text: "萬法皆空，因果不空。" },
  { text: "一花一世界，一葉一如來。" },
  { text: "菩提本無樹，明鏡亦非台。本來無一物，何處惹塵埃。" },
  { text: "諸行無常，是生滅法；生滅滅已，寂滅為樂。" },
  { text: "色即是空，空即是色；受想行識，亦復如是。" },
  { text: "觀自在菩薩，行深般若波羅蜜多時，照見五蘊皆空。" },
  { text: "心無掛礙，無掛礙故，無有恐怖。" },
  { text: "一切有為法，如夢幻泡影，如露亦如電。" },
  { text: "法界無邊誓願度，眾生無邊誓願度。" },
  { text: "南無觀世音菩薩。" },
  { text: "南無普賢菩薩。" },
  { text: "南無文殊師利菩薩。" },
  { text: "若人欲識佛，應常懷恭敬心。" },
  { text: "諸佛慈悲，常護眾生。" },
  { text: "南無阿彌陀佛。" },
  { text: "無我相，無人相，無眾生相，無壽者相。" },
  { text: "無念為宗，無相為體。" },
  { text: "自性本淨，無須外求。" },
  { text: "心淨何須水洗，性空自可塵不起。" },
  { text: "持戒如持炬，炬滅塵不起。" },
  { text: "平等無二，阿耨多羅三藐三菩提。" },
  { text: "此岸即是彼岸，彼岸即是此岸。" },
  { text: "淨土法門，唯信唯持。" },
  { text: "慈悲喜捨，菩薩行之本。" },
  { text: "無緣大慈，同體大悲。" },
  { text: "慈心不殺，悲心不傷。" },
  { text: "輪迴無盡，覺悟為度。" },
  { text: "放下屠刀，立地成佛。" },
  { text: "做好事，說好話，存好心。" },
  { text: "以忍為寶，捨愛得自在。" },
  { text: "禪觀息心，覺照念兀。" },
  { text: "相由心生，境隨心轉。" },
  { text: "心如明鏡臺，時時勤拂拭。" },
  { text: "工夫自在，明心見性。" },
  { text: "直下成佛，一念普賢。" },
  { text: "八正道，導向苦盡涅槃。" },
  { text: "四聖諦：苦、集、滅、道。" },
  { text: "五蘊：色、受、想、行、識。" },
  { text: "三法印：諸行無常、諸法無我、涅槃寂靜。" },
  { text: "四無量心：慈、悲、喜、捨。" },
  { text: "諸惡莫作，眾善奉行，自淨其意。" },
  { text: "生死亦苦，亦是成佛之途。" },
  { text: "念佛一聲，罪滅河沙。" },
  { text: "戒定真般若，離苦得安樂。" },
  { text: "眾生平等，佛性常住。" },
  { text: "死生有命，富貴在天。" },
  { text: "善哉，善哉，宜善護念。" },
  { text: "佛法在世間，不離世間覺。" },
  { text: "居安思危，思則有備。" },
  { text: "無欲則剛，無求則安。" },
  { text: "一切福田，由施捨得。" },
  { text: "心若改，命運移。" },
  { text: "善隨善，惡隨惡。" },
  { text: "佛在彌陀，心向彌陀。" },
  { text: "行布施，獲自在。" },
  { text: "坐禪如山，心如工畫師。" },
  { text: "禪定入三昧，智慧現真如。" },
  { text: "行深般若，離一切相。" },
  { text: "眾生若見諸法空，則見如來。" },
  { text: "雲自散去，月自圓。" },
  { text: "虛空非空，空性是真。" },
  { text: "春華秋實，因緣和合。" },
  { text: "佛語已盡，唯忍是寶。" },
  { text: "身心調柔，方入禪定。" },
  { text: "甘露浴心，清涼寂靜。" },
  { text: "法喜充滿，普願成佛。" },
  { text: "慈悲無緣，救度一切。" },
  { text: "無礙無著，自在逍遙。" },
  { text: "一乘勝義，普願成佛。" },
  { text: "如夢似幻，不可執著。" },
  { text: "誦經一卷，勝供養千金。" },
  { text: "善知識，勝千佛。" },
  { text: "弘法利生，福慧雙修。" },
  { text: "佛心常住，法音不絕。" },
  { text: "慧命無量，大悲無邊。" },
  { text: "依止善知識，得聞正法。" },
  { text: "菩提心起，眾生皆度。" },
  { text: "隨順因緣，智慧通達。" },
  { text: "不執過去，不貪未來，不念現在。" },
  { text: "法爾如是，唯行布施。" },
  { text: "悲智雙運，普濟群生。" },
  { text: "無塵洗心，返本還源。" },
  { text: "心田耕種，皆由正念。" },
  { text: "了知生死，方得自在。" },
  { text: "淨土佛國，在心中現。" },
  { text: "明心見性，自性即佛。" },
  { text: "命若朝露，應常珍惜。" },
  { text: "智慧如海，法喜滿懷。" },
  { text: "行住坐臥，常懷慈悲。" },
  { text: "莫生貪愛，則心可淨。" },
  { text: "離垢清淨，如蓮出水。" },
  { text: "隨緣不變，靜觀自照。" },
  { text: "一切功德，皆歸普賢。" },
  { text: "阿難當知，諸法如是。" },
  { text: "舍利弗，應無所住而生其心。" },
  { text: "無上甚深微妙法，百千萬劫難遭遇。" },
  { text: "一切有為法，如露亦如電。" },
  { text: "普門若觀眾生業障，則現世間千百億仞形相。" },
  { text: "心無罣礙，則無有恐怖。" },
  { text: "如是我聞，唯佛與佛法最妙最勝。" }
];


    let dailyQuoteDisplayed = false;
    let fishes = [];
    let foods = []; // Array to store food particles
    // 魚的相關常數
    const INITIAL_FISH_SIZE = 35;
    const SEAWEED_SIZE_AFTER_TRANSFORM = 22;
    const SEAWEED_EMOJI_AFTER_TRANSFORM = '🌿'; // 轉換後的水草 Emoji
    let MAX_FISHES = 5; // 預設最大魚隻數量，使用者可以更改
    const MIN_FISHES_LIMIT = 1; // 最小魚隻數量限制
    const MAX_FISHES_LIMIT = 20; // 最大魚隻數量限制 (可選)

    // Available food emojis based on your request
    const availableFoodEmojis = [
        '🍚', '🌾', '🍞', // Original foods
        // Vegetables & Fruits
        '🥕', '🍅', '🥦', '🥬', '🍆',
        '🍎', '🍌', '🍇', '🍉', '🍓',
        // Meat, Eggs & Protein
        '🥚', '🍖', '🍗', '🥩', '🥓',
        '🌰', '🥜',
        // Sweets & Snacks
        '🍪', '🍩', '🧁', '🎂', '🍫',
        '🍭', '🍬'
    ];

    // 可用的魚 Emoji 列表
    const availableFishEmojis = ['🐟', '🐠', '🐡', '🐳', '🐋', '🐙', '🦑', '🦐', '🦀'];

    // 可用的魚行為類型
    const fishBehaviors = ['normal', 'active', 'shy'];

    // 新增：特定魚種與其預設行為的映射
    const fishEmojiBehaviorMap = {
        '🐟': 'normal', // 普通魚 - 正常
        '🐠': 'active', // 熱帶魚 - 活躍
        '🐡': 'shy',    // 河豚 - 害羞
        '🐳': 'active', // 鯨魚 - 活躍 (體型大，可以更活躍些)
        '🐋': 'normal', // 另一種鯨魚 - 正常
        '🐙': 'shy',    // 章魚 - 害羞 (通常比較隱蔽)
        '🦑': 'active', // 魷魚 - 活躍
        // '🦐', '🦀' 沒有指定，將會隨機或使用預設
    };

    // DOM elements for max fish control
    const decreaseFishButton = document.getElementById('decrease-fish');
    const increaseFishButton = document.getElementById('increase-fish');
    const maxFishDisplay = document.getElementById('max-fish-display');

    // 顯示每日語錄
    function displayDailyQuote() {
        // 每次都隨機選擇一句新的佛語
        const randomIndex = Math.floor(Math.random() * buddhistQuotes.length);
        const quote = buddhistQuotes[randomIndex];
        quoteTextElement.textContent = quote.text;

        // localStorage related comments removed as current logic always picks a random quote.

        quoteContainer.style.display = 'block';
        aquariumContainer.style.display = 'none'; // 初始隱藏魚缸
        updateMaxFishDisplay(); // 初始化時更新顯示
    }

    // 重新整理按鈕的事件監聽器
    refreshButton.addEventListener('click', () => {
        location.reload(); // 重新載入頁面
    });

    // 語錄點擊後切換到魚缸
    quoteContainer.addEventListener('click', () => {
        if (!dailyQuoteDisplayed) {
            quoteContainer.style.display = 'none';
            aquariumContainer.style.display = 'block';
            dailyQuoteDisplayed = true;
            if (fishes.length === 0) { // 確保只創建一次魚
                initAquarium();
            }
        }
    });

    // 餵食功能：點擊魚缸添加食物
    aquariumContainer.addEventListener('click', (event) => {
        if (aquariumContainer.style.display === 'block' && fishes.length > 0) { // 只有在魚缸可見且有魚時才添加食物
            const rect = aquariumContainer.getBoundingClientRect();
            const foodX = event.clientX - rect.left;
            const foodY = event.clientY - rect.top;

            if (foods.length < 20) { // 限制食物顆粒的最大數量
                // Select a random food emoji
                const randomFoodEmoji = availableFoodEmojis[Math.floor(Math.random() * availableFoodEmojis.length)];
                const foodItem = new Food(foodX, foodY, aquariumContainer, randomFoodEmoji);
                foods.push(foodItem);
            }
        }
    });

    // 添加單個水草裝飾 (用於魚轉換後)
    // x, y 是魚轉換前的中心點座標
    function addSingleSeaweed(fishCenterX, fishCenterY, size) {
        const decoElement = document.createElement('span');
        decoElement.className = 'emoji-decoration'; // 使用現有的裝飾 class
        decoElement.textContent = SEAWEED_EMOJI_AFTER_TRANSFORM;
        decoElement.style.position = 'absolute';
        decoElement.style.fontSize = `${size}px`;
        decoElement.style.userSelect = 'none'; // 防止選取
        decoElement.style.zIndex = '1'; // 確保在魚的下方 (如果魚的 z-index 更高)

        const decoWidth = size;  // 水草 Emoji 的近似寬度
        const decoHeight = size; // 水草 Emoji 的近似高度

        const aquariumWidth = aquariumContainer.clientWidth;
        const aquariumHeight = aquariumContainer.clientHeight;

        // 計算水草的左上角 (top-left) 座標，使其視覺中心對齊魚的中心點
        let newLeft = fishCenterX - decoWidth / 2;
        let newTop = fishCenterY - decoHeight / 2;

        // 確保水草完全在魚缸邊界內
        newLeft = Math.max(0, Math.min(newLeft, aquariumWidth - decoWidth));
        newTop = Math.max(0, Math.min(newTop, aquariumHeight - decoHeight));

        decoElement.style.left = `${newLeft}px`;
        decoElement.style.top = `${newTop}px`;
        // 注意：由於我們現在使用 top 定位，之前的 bottom 樣式應被移除或不設置

        aquariumContainer.appendChild(decoElement);
    }


    // (可選) 添加一些靜態裝飾 (使用 Emoji)
    function addDecorations() {
        const aquariumWidth = aquariumContainer.clientWidth;
        const aquariumHeight = aquariumContainer.clientHeight;
        const decorationEmoji = '🌿';
        const numDecorationsToAttempt = 15; // 嘗試放置的海草數量
        const placedDecorationBounds = []; // 存儲已放置海草的邊界信息
        const MAX_PLACEMENT_ATTEMPTS_PER_DECO = 20; // 每次放置嘗試的最大次數

        for (let i = 0; i < numDecorationsToAttempt; i++) {
            let currentDecoInfo;
            let isOverlapping;
            let placementAttempts = 0;

            do {
                isOverlapping = false;
                placementAttempts++;

                // 1. 決定海草大小 (較小尺寸)
                const visualFontSize = 20 + Math.random() * 8; // 海草字體大小 12px 到 20px

                // 2. 估算碰撞檢測的尺寸 (假設海草字符大致為正方形)
                const collisionWidth = visualFontSize;
                const collisionHeight = visualFontSize;

                // 3. 決定位置 (確保在魚缸底部且不超出邊界)
                const randomX = Math.random() * (aquariumWidth - collisionWidth);
                // 將海草的底部邊緣放置在距離魚缸底部 0 到 10px 的範圍內
                const randomBottom = Math.random() * 30; // 調整：讓海草更靠近底部

                // 計算用於碰撞檢測的 top 座標
                const top = aquariumHeight - randomBottom - collisionHeight;

                currentDecoInfo = {
                    left: randomX,
                    top: top, // 用於碰撞檢測
                    width: collisionWidth,
                    height: collisionHeight,
                    cssBottom: randomBottom, // 用於 CSS 定位
                    fontSize: visualFontSize
                };

                // 4. 檢查是否與已放置的海草重疊
                for (const placedRect of placedDecorationBounds) {
                    if (currentDecoInfo.left < placedRect.left + placedRect.width &&
                        currentDecoInfo.left + currentDecoInfo.width > placedRect.left &&
                        currentDecoInfo.top < placedRect.top + placedRect.height &&
                        currentDecoInfo.top + currentDecoInfo.height > placedRect.top) {
                        isOverlapping = true;
                        break;
                    }
                }
            } while (isOverlapping && placementAttempts < MAX_PLACEMENT_ATTEMPTS_PER_DECO);

            // 5. 如果不重疊 (或達到最大嘗試次數後決定放棄)，則添加海草
            if (!isOverlapping) {
                const decoElement = document.createElement('span');
                decoElement.className = 'emoji-decoration';
                decoElement.textContent = decorationEmoji;
                decoElement.style.position = 'absolute';
                decoElement.style.fontSize = `${currentDecoInfo.fontSize}px`;
                decoElement.style.left = `${currentDecoInfo.left}px`;
                decoElement.style.bottom = `${currentDecoInfo.cssBottom}px`;
                decoElement.style.userSelect = 'none'; // 防止選取

                aquariumContainer.appendChild(decoElement);
                placedDecorationBounds.push(currentDecoInfo); // 記錄已放置的海草邊界
            }
        }
    }

    // 生成一條新的魚
    function spawnSingleFish() {
        const aquariumWidth = aquariumContainer.clientWidth;
        const aquariumHeight = aquariumContainer.clientHeight;

        const fishId = `fish-spawned-${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const randomEmoji = availableFishEmojis[Math.floor(Math.random() * availableFishEmojis.length)];
        // 根據選擇的 Emoji 決定行為，如果未在映射中定義，則隨機選擇
        const assignedBehavior = fishEmojiBehaviorMap[randomEmoji] || fishBehaviors[Math.floor(Math.random() * fishBehaviors.length)];
        // 新魚使用初始大小
        const fishInstance = new Fish(fishId, aquariumWidth, aquariumHeight, randomEmoji, INITIAL_FISH_SIZE, aquariumContainer, assignedBehavior);

        const fishElement = document.createElement('span');
        fishElement.id = fishId;
        fishElement.className = 'fish';

        fishInstance.setElement(fishElement);
        aquariumContainer.appendChild(fishElement);
        fishes.push(fishInstance); // 添加到全局魚列表
    }

    // 更新顯示最大魚數量的 UI
    function updateMaxFishDisplay() {
        if (maxFishDisplay) {
            maxFishDisplay.textContent = MAX_FISHES;
        }
    }

    // 調整魚的數量以符合 MAX_FISHES 限制
    function adjustFishPopulation() {
        // 如果當前魚的數量超過了新的最大限制，則移除多餘的魚
        while (fishes.length > MAX_FISHES) {
            const fishToRemove = fishes.pop(); // 從陣列末尾移除魚
            if (fishToRemove && fishToRemove.element && fishToRemove.element.parentNode) {
                fishToRemove.element.parentNode.removeChild(fishToRemove.element);
                // 魚的氣泡會自行消失，不需要特別處理
            }
        }
        // 如果希望在增加 MAX_FISHES 時立即補充魚（即使沒有魚轉換），可以在這裡添加邏輯
        // 但目前的設計是等待魚轉換時自然補充到新的上限
    }

    // 事件監聽器：減少最大魚隻數量
    decreaseFishButton.addEventListener('click', () => {
        if (MAX_FISHES > MIN_FISHES_LIMIT) {
            MAX_FISHES--;
            updateMaxFishDisplay();
            adjustFishPopulation(); // 移除多餘的魚
        }
    });

    // 事件監聽器：增加最大魚隻數量
    increaseFishButton.addEventListener('click', () => {
        if (MAX_FISHES < MAX_FISHES_LIMIT) { // 可選的上限檢查
            MAX_FISHES++;
            updateMaxFishDisplay();
            // 當增加最大魚隻數量時，立即補充魚直到達到新的 MAX_FISHES
            while (fishes.length < MAX_FISHES) {
                spawnSingleFish();
            }
        }
    });

    function initAquarium() {
        const aquariumWidth = aquariumContainer.clientWidth;
        const aquariumHeight = aquariumContainer.clientHeight;

        // 在創建第一條魚之前添加所有裝飾物
        addDecorations();

        for (let i = 0; i < MAX_FISHES; i++) {
            const fishId = `fish-init-${i}-${Date.now()}`;
            // 為每條魚隨機選擇 Emoji 和固定大小
            const randomEmoji = availableFishEmojis[Math.floor(Math.random() * availableFishEmojis.length)];
            // 根據選擇的 Emoji 決定行為，如果未在映射中定義，則隨機選擇
            const assignedBehavior = fishEmojiBehaviorMap[randomEmoji] || fishBehaviors[Math.floor(Math.random() * fishBehaviors.length)];
            // 魚的初始大小固定為 INITIAL_FISH_SIZE
            const fishInstance = new Fish(fishId, aquariumWidth, aquariumHeight, randomEmoji, INITIAL_FISH_SIZE, aquariumContainer, assignedBehavior);
            const fishElement = document.createElement('span');
            fishElement.id = fishId;
            fishElement.className = 'fish';
            // fishInstance.setElement 會處理初始的 emoji 和樣式

            fishInstance.setElement(fishElement);
            aquariumContainer.appendChild(fishElement);
            fishes.push(fishInstance);
        }

        // 啟動遊戲循環
        gameLoop();
    }

    let lastTime = 0;
    function gameLoop(timestamp) {
        const deltaTime = (timestamp - lastTime) / 1000 || 0; // 處理第一幀
        lastTime = timestamp;

        let fishSpawnCount = 0; // 記錄本幀需要生成的魚的數量

        // 從後向前遍歷，以便安全地從陣列中移除元素
        for (let i = fishes.length - 1; i >= 0; i--) {
            const fish = fishes[i];
            fish.update(deltaTime, fishes, foods); // Pass all fishes and foods

            if (fish.isTransforming) {
                // 1. 在魚的位置附近（底部）添加一個新的水草
                addSingleSeaweed(fish.x, fish.y, SEAWEED_SIZE_AFTER_TRANSFORM);

                // 2. 從 DOM 中移除魚的元素
                if (fish.element && fish.element.parentNode) {
                    fish.element.parentNode.removeChild(fish.element);
                }

                // 3. 從 fishes 陣列中移除該魚的實例
                fishes.splice(i, 1);

                // 4. 標記需要生成一條新魚
                fishSpawnCount++;
            }
        }
        // 生成因轉換而需要補充的新魚
        for (let k = 0; k < fishSpawnCount; k++) {
            // 檢查是否低於（新的）最大魚隻限制
            if (fishes.length < MAX_FISHES) {
                spawnSingleFish();
            }
        }

        // Update food particles (for sinking)
        foods.forEach(food => {
            if (!food.isEaten) {
                food.update(deltaTime);
            }
        });

        // 清理被吃掉的食物
        for (let i = foods.length - 1; i >= 0; i--) {
            if (foods[i].isEaten) {
                foods[i].remove();
                foods.splice(i, 1);
            }
        }
        requestAnimationFrame(gameLoop);
    }

    // 程式入口
    displayDailyQuote();

});
