// main_app.js

document.addEventListener('DOMContentLoaded', () => {
    const quoteContainer = document.getElementById('quote-container');
    const quoteTextElement = document.getElementById('quote-text');
    const aquariumContainer = document.getElementById('aquarium-container');

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
    const MAX_FISHES = Math.floor(Math.random() * (8 - 4 + 1)) + 5; // 4 到 8 隻魚

    // Available food emojis based on your request
    const availableFoodEmojis = ['🍚', '🌾', '🌽', '🍞'];

    // 可用的魚 Emoji 列表
    const availableFishEmojis = ['🐟', '🐠', '🐡', '🦈', '🐳', '🐋', '🐙', '🦑', '🦐', '🦀'];
    // fishGrowthStages constant removed as growth functionality is removed.

    // 顯示每日語錄
    function displayDailyQuote() {
        // 每次都隨機選擇一句新的佛語
        const randomIndex = Math.floor(Math.random() * buddhistQuotes.length);
        const quote = buddhistQuotes[randomIndex];
        quoteTextElement.textContent = quote.text;

        // 由於現在每次都載入新的，不再需要將語錄存儲到 localStorage 以便當日重用
        // localStorage.removeItem('dailyQuoteText'); // 如果確定不再需要，可以考慮移除
        // localStorage.removeItem('lastQuoteDate');  // 如果確定不再需要，可以考慮移除

        quoteContainer.style.display = 'block';
        aquariumContainer.style.display = 'none'; // 初始隱藏魚缸
    }

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

    // (可選) 添加一些靜態裝飾 (使用 Emoji)
    function addDecorations() {
        const aquariumWidth = aquariumContainer.clientWidth;
        const aquariumHeight = aquariumContainer.clientHeight;
        const decorations = ['🌿']; // 只使用海草
        const numDecorations = 15;   // 改為 30 個海草

        for (let i = 0; i < numDecorations; i++) {
            const decoElement = document.createElement('span');
            decoElement.className = 'emoji-decoration';
            const chosenEmoji = decorations[Math.floor(Math.random() * decorations.length)];
            decoElement.textContent = chosenEmoji;

            // 基本樣式
            decoElement.style.position = 'absolute';
            let baseSize = 20 + Math.random() * 25; // Emoji 基礎大小 20px 到 45px

            if (chosenEmoji === '🌿') { // 讓海草高一些
                baseSize *= 1.5;
            }
            decoElement.style.fontSize = `${baseSize}px`;

            // 定位在魚缸底部區域
            const randomX = Math.random() * (aquariumWidth - baseSize); // 減去大小以避免超出邊界
            const maxBottomOffset = aquariumHeight * 0.9; // 放置在底部 25% 的區域
            const randomBottom = Math.random() * maxBottomOffset;

            decoElement.style.left = `${randomX}px`;
            decoElement.style.bottom = `${randomBottom}px`;

            aquariumContainer.appendChild(decoElement);
        }
    }

    function initAquarium() {
        const aquariumWidth = aquariumContainer.clientWidth;
        const aquariumHeight = aquariumContainer.clientHeight;

        for (let i = 0; i < MAX_FISHES; i++) {
            const fishId = `fish-${i}-${Date.now()}`;
            // 在創建魚之前添加裝飾，這樣魚通常會渲染在裝飾之上
            if (i === 0) addDecorations(); // 在創建第一條魚之前添加所有裝飾物

            // 為每條魚隨機選擇 Emoji 和固定大小
            const randomEmoji = availableFishEmojis[Math.floor(Math.random() * availableFishEmojis.length)];
            const randomSize = 35 + Math.floor(Math.random() * (70 - 35 + 1)); // 魚的大小範圍 35px 到 70px
            const fishInstance = new Fish(fishId, aquariumWidth, aquariumHeight, randomEmoji, randomSize);

            const fishElement = document.createElement('span'); // 改成創建 span 元素來顯示 Emoji
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

        fishes.forEach(fish => {
            // fish.updateGrowth(90); // Growth functionality removed
            fish.update(deltaTime, fishes, foods); // Pass all fishes and foods
        });

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
