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
    const MAX_FISHES = Math.floor(Math.random() * (8 - 4 + 1)) + 4; // 4 到 8 隻魚

    // 魚的成長階段配置
    const fishGrowthStages = {
        small: {
            src: 'images/fish_sprite_small.png', // 改成 GIF
            // frames: 4, // GIF 不需要
            frameWidth: 100, // 小魚單幀寬
            frameHeight: 80, // 小魚單幀高
            // animationSpeed: 0.25, // GIF 不需要
            threshold: 0.33,
            minScaleInStage: 0.7,
            maxScaleInStage: 1.0
        },
        medium: {
            src: 'images/fish_sprite_medium.png', // 改成 GIF (假設您也有中魚的 GIF)
            // frames: 4,
            frameWidth: 50,
            frameHeight: 30,
            // animationSpeed: 0.2,
            threshold: 0.66,
            minScaleInStage: 0.8,
            maxScaleInStage: 1.1
        },
        large: {
            src: 'images/fish_sprite_large.png', // 改成 GIF (假設您也有大魚的 GIF)
            // frames: 4,
            frameWidth: 80,
            frameHeight: 50,
            // animationSpeed: 0.15,
            threshold: 1.0,
            minScaleInStage: 0.9,
            maxScaleInStage: 1.0
        }
    };

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


    function initAquarium() {
        const aquariumWidth = aquariumContainer.clientWidth;
        const aquariumHeight = aquariumContainer.clientHeight;

        for (let i = 0; i < MAX_FISHES; i++) {
            const fishId = `fish-${i}-${Date.now()}`;
            const fishInstance = new Fish(fishId, aquariumWidth, aquariumHeight, fishGrowthStages);

            const fishElement = document.createElement('img'); // 改成創建 img 元素
            fishElement.id = fishId;
            fishElement.className = 'fish';
            // fishInstance.setElement 會處理初始的 src, width, height

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
            fish.updateGrowth(90); // 假設90天長大
            fish.update(deltaTime);
        });

        requestAnimationFrame(gameLoop);
    }

    // 程式入口
    displayDailyQuote();

    // (可選) 添加一些靜態裝飾
    function addDecorations() {
        const seaweed = document.createElement('div');
        seaweed.className = 'seaweed';
        aquariumContainer.appendChild(seaweed);

        const rock = document.createElement('div');
        rock.className = 'rock';
        aquariumContainer.appendChild(rock);
    }
    // addDecorations(); // 如果您有圖片，可以取消註解這行
});
