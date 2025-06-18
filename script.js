const aquarium = document.getElementById('aquarium');
const fishes = document.querySelectorAll('.fish');

// 讓魚隨機移動的函數
function moveFish(fish) {
    const aquariumRect = aquarium.getBoundingClientRect();
    const fishRect = fish.getBoundingClientRect();

    let newX = Math.random() * (aquariumRect.width - fishRect.width);
    let newY = Math.random() * (aquariumRect.height - fishRect.height);

    // 隨機決定水平方向，讓魚頭朝向移動方向
    const currentX = parseFloat(fish.style.left) || 0;
    if (newX < currentX) {
        fish.style.transform = 'scaleX(-1)'; // 翻轉魚的方向
    } else {
        fish.style.transform = 'scaleX(1)';
    }

    fish.style.transition = 'left 5s linear, top 5s linear'; // 平滑過渡
    fish.style.left = `${newX}px`;
    fish.style.top = `${newY}px`;
}

// 每隔一段時間讓所有魚隨機移動
fishes.forEach(fish => {
    setInterval(() => moveFish(fish), 5000 + Math.random() * 3000); // 5-8秒移動一次
    moveFish(fish); // 立即移動一次
});

// 點擊水族箱生成魚食
aquarium.addEventListener('click', (event) => {
    const food = document.createElement('div');
    food.classList.add('food');
    food.style.left = `${event.clientX - aquarium.getBoundingClientRect().left - 4}px`; // 減去一半食物寬度
    food.style.top = `${event.clientY - aquarium.getBoundingClientRect().top - 4}px`; // 減去一半食物高度
    aquarium.appendChild(food);

    // 魚食在動畫結束後移除
    food.addEventListener('animationend', () => {
        food.remove();
    });

    // 讓魚稍微改變方向以模擬追逐食物 (簡化版)
    fishes.forEach(fish => {
        const fishRect = fish.getBoundingClientRect();
        const foodX = event.clientX - aquarium.getBoundingClientRect().left;
        const foodY = event.clientY - aquarium.getBoundingClientRect().top;

        // 計算魚到食物的距離和角度 (簡化為直接跳到食物附近)
        const fishCurrentX = parseFloat(fish.style.left);
        const fishCurrentY = parseFloat(fish.style.top);

        // 讓魚朝向食物的方向稍微移動
        let targetX = foodX - fishRect.width / 2;
        let targetY = foodY - fishRect.height / 2;

        // 確保目標位置在水族箱內
        targetX = Math.max(0, Math.min(targetX, aquarium.clientWidth - fishRect.width));
        targetY = Math.max(0, Math.min(targetY, aquarium.clientHeight - fishRect.height));

        fish.style.transition = 'left 1s ease-out, top 1s ease-out'; // 快速游向食物
        fish.style.left = `${targetX}px`;
        fish.style.top = `${targetY}px`;

        // 根據移動方向翻轉魚
        if (targetX < fishCurrentX) {
            fish.style.transform = 'scaleX(-1)';
        } else {
            fish.style.transform = 'scaleX(1)';
        }

        // 一段時間後恢復正常隨機移動
        setTimeout(() => {
            fish.style.transition = 'left 5s linear, top 5s linear'; // 恢復正常過渡
            moveFish(fish);
        }, 1200); // 讓魚追逐食物1.2秒
    });
});