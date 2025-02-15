const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 40; // Kare boyutunu 2 katına çıkardık
let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };
let food = randomPosition();
let foodEaten = 0; // Yılanın yediği yemek sayısı
let gameOver = false;

// Yılanın başı ve yemek için yerel resimler
const snakeImage = new Image();
const foodImage = new Image();

// Yerel resim dosyalarının yolu
snakeImage.src = 'images/snake_head.jpg'; // Yılanın başı
foodImage.src = 'images/food.jpg'; // Yiyecek

// Resimler yüklendikten sonra oyun başlar
snakeImage.onload = foodImage.onload = () => {
  gameLoop();
};

function randomPosition() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize))
  };
}

function update() {
  if (gameOver) return;

  let head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Duvara çarpma durumu ve yön değiştirme
  if (head.x < 0) {
    head.x = canvas.width / gridSize - 1; // Sol duvar
  } else if (head.x >= canvas.width / gridSize) {
    head.x = 0; // Sağ duvar
  }

  if (head.y < 0) {
    head.y = canvas.height / gridSize - 1; // Üst duvar
  } else if (head.y >= canvas.height / gridSize) {
    head.y = 0; // Alt duvar
  }

  snake.unshift(head);

  // Yılan yemek yediğinde
  if (head.x === food.x && head.y === food.y) {
    food = randomPosition();
    foodEaten++; // Yılanın yediği yemek sayısını artırıyoruz
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#222';
  for (let x = 0; x < canvas.width; x += gridSize) {
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.strokeRect(x, y, gridSize, gridSize);
    }
  }

  // Yılanı çizme (resimle) ve yeşil çeper ekleme
  snake.forEach((segment, index) => {
    ctx.drawImage(snakeImage, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize); // Yılan başı

    // Yılanın dış çeperini yeşil yapma
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'green';
    ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  });

  // Yemi çizme (resimle) ve kırmızı çeper ekleme
  ctx.drawImage(foodImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Yemeğin dış çeperini kırmızı yapma
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'red';
  ctx.strokeRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  // Skoru güncelleme
  document.getElementById('score').textContent = `Yemek Sayısı: ${foodEaten}`;
}

function gameLoop() {
  update();
  draw();
  if (!gameOver) {
    setTimeout(gameLoop, 250); // Hız yavaşlatıldı (250ms)
  }
}
