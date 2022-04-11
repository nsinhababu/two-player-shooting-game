let canvas;
let ctx;
let winnerDisplayContainer = document.querySelector(
  '.winner-display-container'
);
let player1HealthDisplay = document.querySelector('.player1-health');
let player2HealthDisplay = document.querySelector('.player2-health');

let player1ScoreDisplay = document.querySelector('.player1-score');
let player2ScoreDisplay = document.querySelector('.player2-score');

let winnerDisplay;
window.onload = function () {
  canvas = document.querySelector('#canvas');
  ctx = canvas.getContext('2d');
  let playerSize = 60;
  let bulletSpeed = 4;
  // Movement Speed
  let playerSpeed = 5;

  //Player positions
  let P1posX = (canvas.width - playerSize) / 2;
  let P2posX = (canvas.width - playerSize) / 2;
  let p2PosY = 0;
  let p1PosY = canvas.height - playerSize;

  // const ACTION_KEYS = {
  //    RIGHT_ARROW: false,
  //    LEFT_ARROW: false,
  //    A: false,
  //    D: false,
  //    SPACE: false
  // }

  // const PLAYER_1 = {
  //   imageUrl: '',
  //   health: 100,
  //   bullet: {
  //     width: 4,
  //     height: 8,
  //   },
  //   position: {
  //    x: () => (canvas.width - playerSize) / 2,
  //    y: () => canvas.height - playerSize
  //   },
  //   bulletPosition: {
  //    x: () => P1posX + playerSize / 2 - bulletWidth / 2,
  //    y: () => p1PosY - bulletHeight,
  //   },
  //   bulletPower: Math.ceil(Math.random() * 5)
  // };

  let shootingInterval;

  // Player health
  let p1Health = 10;
  let p2Health = 10;
  // Player scores
  let p1Score = 0;
  let p2Score = 0;

  let matchWinner;
  let tournamentWinner;

  // Bullet position
  let bulletWidth = 4;
  let bulletHeight = 8;
  let p1BulletX = P1posX + playerSize / 2 - bulletWidth / 2;
  let p2BulletX = P2posX + playerSize / 2 - bulletWidth / 2;
  let p1BulletY = p1PosY - bulletHeight;
  let p2BulletY = p2PosY + playerSize;

  let bulletPower;

  let player1 = new Image();
  player1.src = './img/player1.png';

  let player2 = new Image();
  player2.src = './img/player2.png';

  // Creates fillRect
  const makeRect = (x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  };

  // Draws Image
  const drawImg = (src, x, y, w, h) => {
    ctx.drawImage(src, x, y, w, h);
  };

  // Key actions
  let key_RightArrow = false;
  let key_LeftArrow = false;
  let key_A = false;
  let key_D = false;
  let shoot = false;
  let shootByP1 = false;
  let shootByP2 = false;

  // Toggle class of an element
  function toggleClass(oldClass, newClass) {
    winnerDisplayContainer.classList.add(newClass);
    winnerDisplayContainer.classList.remove(oldClass);
  }
  // Controls player movements
  const playerMove = () => {
    if (key_RightArrow && P1posX < 745) {
      P1posX += playerSpeed;
      // p1BulletX += playerSpeed;
    }
    if (key_LeftArrow && P1posX >= 0) {
      P1posX -= playerSpeed;
      // p1BulletX -= playerSpeed;
    }
    if (key_A && P2posX >= 0) {
      P2posX -= playerSpeed;
    }
    if (key_D && P2posX < 745) {
      P2posX += playerSpeed;
    }
  };

  // Controls bullet movements

  function resetBulletOrigin() {
    p1BulletY = p1PosY - bulletHeight;
    p1BulletX = P1posX + playerSize / 2 - bulletWidth / 2;
    p2BulletY = p2PosY + playerSize;
    p2BulletX = P2posX + playerSize / 2 - bulletWidth / 2;

    // makeRect(p1BulletX, p1BulletY, 4, 8, 'skyblue');

    clearInterval(shootingInterval);
    shootingInterval = null;
  }

  const bulletMovementY = () => {
    if (shootByP1 === true) {
      makeRect(p1BulletX, p1BulletY, 4, 8, 'skyblue');
      p1BulletY -= bulletSpeed;
    }
    if (shootByP2 === true) {
      makeRect(p2BulletX, p2BulletY, 4, 8, 'red');
      p2BulletY += bulletSpeed;
    }
    if (p1BulletY === 0 || p2BulletY === canvas.height) {
      p1BulletY === 0 ? (shootByP1 = false) : (shootByP2 = false);
      resetBulletOrigin();
    }
    // if (p1BulletY > 0) {
    //   p1BulletY -= bulletSpeed;
    //   // console.log(p1BulletY);
    // }
    // if (p2BulletY < canvas.height) {
    //   p2BulletY += bulletSpeed;
    // }
    // if (p1BulletY === 0 && p2BulletY === canvas.height) {
    //   shoot = false;
    //   resetBulletOrigin();
    // }

    // Hitting target
    const isP1Collision =
      p1BulletX >= P2posX &&
      p1BulletX <= P2posX + playerSize &&
      p1BulletY === playerSize;

    if (isP1Collision) {
      p2Health -= bulletPower;
    }

    const isP2Collision =
      p2BulletX >= P1posX &&
      p2BulletX <= P1posX + playerSize &&
      p2BulletY === canvas.height - playerSize;

    if (isP2Collision) {
      p1Health -= bulletPower;
    }
  };

  const continuosShooting = () => {
    if (!shootingInterval) {
      shootingInterval = setInterval(bulletMovementY, 1 / 100);
    }
  };

  // Key Event handling
  function keyPressed(e) {
    if (e.code === 'ArrowRight') {
      key_RightArrow = true;
    }
    if (e.code === 'ArrowLeft') {
      key_LeftArrow = true;
    }
    if (e.code === 'KeyA') {
      key_A = true;
    }
    if (e.code === 'KeyD') {
      key_D = true;
    }

    if (e.code === 'ArrowDown') {
      shootByP1 = true;
      bulletPower = Math.ceil(Math.random() * 5);
      p1BulletX = P1posX + playerSize / 2 - bulletWidth / 2;
      continuosShooting();
    }
    if (e.code === 'KeyS') {
      shootByP2 = true;
      bulletPower = Math.ceil(Math.random() * 5);

      p2BulletX = P2posX + playerSize / 2 - bulletWidth / 2;
      continuosShooting();
    }
    // if (e.code === 'Space') {
    //   shoot = true;
    //   bulletPower = Math.ceil(Math.random() * 5);
    //   p1BulletX = P1posX + playerSize / 2 - bulletWidth / 2;
    //   p2BulletX = P2posX + playerSize / 2 - bulletWidth / 2;
    //   continuosShooting();
    // }
  }

  function keyReleased(e) {
    if (e.code === 'ArrowRight') {
      key_RightArrow = false;
    }
    if (e.code === 'ArrowLeft') {
      key_LeftArrow = false;
    }
    if (e.code === 'KeyA') {
      key_A = false;
    }
    if (e.code === 'KeyD') {
      key_D = false;
    }
    // if (e.code === 'ArrowDown') {
    //   shootByP1 = false;
    // }
    // if (e.code === 'KeyD') {
    //   shootByP2 = false;
    // }
  }

  // Key press events
  document.addEventListener('keydown', keyPressed);
  document.addEventListener('keyup', keyReleased);

  // Match winner handler function

  let isWon = false;
  function matchWinnerHandler() {
    if (p1Health <= 0) {
      isWon = true;
    }
    if (p2Health <= 0) {
      isWon = true;
    }
  }

  const showScore = (player, color) => {
    shootByP1 = false;
    shootByP2 = false;
    makeRect(0, 0, canvas.width, canvas.height, 'lightgray');

    ctx.font = '100px roboto';
    ctx.fillStyle = color;
    ctx.fillText(`${player} won`, 200, 300);

    setTimeout(() => {
      isWon = false;
    }, 2000);
  };

  // Match end handler
  function matchEnd() {
    if (p1Health <= 0 && p2Health <= 0) {
      matchWinner = 'No one';
      showScore(matchWinner, 'salmon');
    }
    if (p1Health <= 0) {
      p1Health = 10;
      p2Health = 10;
      matchWinner = 'player2';
      p2Score += 1;
    }
    if (p2Health <= 0) {
      p2Health = 10;
      p1Health = 10;
      matchWinner = 'player1';
      p1Score += 1;
    }

    if (isWon) {
      if (matchWinner === 'player1' || matchWinner === 'player2') {
        showScore(matchWinner, 'deepskyblue');
        return;
      }
    }
    matchWinner = null;
    console.log(p1Score, p2Score);
  }

  // Tournament end handler
  function tournamentEnd() {
    if (p1Score >= 3 || p2Score >= 3) {
      tournamentWinner = p1Score >= 3 ? ' Player 1' : 'Player 2';
      toggleClass('hide-Element', 'show-element');
      winnerDisplay = document.querySelector('.winner-display');

      winnerDisplay.innerText = `Tournament Winner: ${tournamentWinner}`;
    }
  }

  // Main looping function

  function gameLoop() {
    playerMove();
    matchWinnerHandler();

    player1HealthDisplay.style.width = `${2 * p1Health}px`;
    player2HealthDisplay.style.width = `${2 * p2Health}px`;

    player1ScoreDisplay.innerText = `Match won: ${p1Score}`;
    player2ScoreDisplay.innerText = `Match won: ${p2Score}`;
    // Canvas
    makeRect(0, 0, canvas.width, canvas.height, 'black');
    // Players

    drawImg(player1, P1posX, p1PosY, playerSize, playerSize);

    drawImg(player2, P2posX, p2PosY, playerSize, playerSize);

    // Bullets
    // makeRect(p1BulletX, p1BulletY, 4, 8, 'skyblue');
    // makeRect(p2BulletX, p2BulletY, 4, 8, 'red');
    matchEnd();
    tournamentEnd();
  }
  // Loop
  setInterval(gameLoop, 1000 / 50);
};
