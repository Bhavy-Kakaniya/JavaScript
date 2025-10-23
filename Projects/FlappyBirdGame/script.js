// get information of container
const pillarContainer = document.querySelector('.pillarContainer');
let containerWidth = pillarContainer.offsetWidth;
let containerHeight = pillarContainer.offsetHeight;

// set attributes of pillar and game
const pillarWidth = 60;
const gap = 150;
const moveStep = 20;

let gameRunning = false;
let gameOverFlag = false;
let gameInterval;

// life and score
let maxLives = 3;
let lives = 3;
const livesDiv = document.createElement('div');
livesDiv.className = 'lives';
pillarContainer.appendChild(livesDiv);

function updateLivesDisplay() {
    livesDiv.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const life = document.createElement('div');
        life.className = 'life';
        livesDiv.appendChild(life);
    }
}
updateLivesDisplay();

// score board
let score = 0;
const scoreBoard = document.createElement('div');
scoreBoard.className = 'scoreBoard';
pillarContainer.appendChild(scoreBoard);

// store high score
let highScores = JSON.parse(localStorage.getItem('scores') || '[]');
let currentHigh = highScores.length > 0 ? Math.max(...highScores) : 0;
scoreBoard.textContent = 'Score: 0 | High: ' + currentHigh;

// Bird
const bird = document.createElement('div');
bird.className = 'bird';
pillarContainer.appendChild(bird);

// Bird image
const birdImg = document.createElement('img');
birdImg.src = './images/bird.png';
birdImg.style.width = '100%';
birdImg.style.height = '100%';
birdImg.style.objectFit = 'contain';
bird.appendChild(birdImg);

// Initial position of bird
let birdY = containerHeight / 2 - 20;
let birdX = 100;
bird.style.top = birdY + 'px';
bird.style.left = birdX + 'px';

// Event Listener for moving bird and pausing game
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') birdY -= moveStep;
    else if (e.key === 'ArrowDown') birdY += moveStep;
    else if (e.key === 'ArrowLeft') birdX -= moveStep;
    else if (e.key === 'ArrowRight') birdX += moveStep;
    else if (e.code === 'Space') toggleGame();

    if (birdY < 0) birdY = 0;
    if (birdY > containerHeight - bird.offsetHeight)
        birdY = containerHeight - bird.offsetHeight;
    if (birdX < 0) birdX = 0;
    if (birdX > containerWidth - bird.offsetWidth)
        birdX = containerWidth - bird.offsetWidth;

    bird.style.top = birdY + 'px';
    bird.style.left = birdX + 'px';
});

// Pillars
const pillars = [];
const pillarCount = 4;


for (let i = 0; i < pillarCount; i++) {
    // Generate random height for pillars
    const randomHeight = Math.floor(Math.random() * (containerHeight - gap - 100)) + 50;

    // lower pillar
    const lower = document.createElement('div');
    lower.className = 'downPillar';
    lower.style.height = randomHeight + 'px';
    lower.style.left = 400 * i + 'px';
    lower.style.bottom = '0px';

    const lowerImg = document.createElement('img');
    lowerImg.src = './images/PillarDown.png';
    lowerImg.style.width = '100%';
    lowerImg.style.height = '100%';
    lower.appendChild(lowerImg);

    // upper pillar
    const upper = document.createElement('div');
    upper.className = 'upperPillar';
    upper.style.height = containerHeight - randomHeight - gap + 'px';
    upper.style.left = 400 * i + 'px';
    upper.style.top = '0px';

    const upperImg = document.createElement('img');
    upperImg.src = './images/PillarUp.png';
    upperImg.style.width = '100%';
    upperImg.style.height = '100%';
    upper.appendChild(upperImg);

    // append both pillars to pillar container
    pillarContainer.appendChild(lower);
    pillarContainer.appendChild(upper);

    // push both pillar as object in pillars array
    pillars.push({
        upper, lower, passed: false, x: 400 * i
    });
}

// Game Loop
function gameLoop() {
    pillars.forEach(pillar => {
        pillar.x -= 5;
        pillar.upper.style.left = pillar.x + 'px';
        pillar.lower.style.left = pillar.x + 'px';

        // check if bird strikes pillar
        if (birdX + bird.offsetWidth > pillar.x && birdX < pillar.x + pillarWidth && (birdY < parseInt(pillar.upper.style.height) || birdY + bird.offsetHeight > containerHeight - parseInt(pillar.lower.style.height))) {

            // check for game over
            if (!gameOverFlag) {
                lives--;
                if (lives <= 0) {
                    gameOverFlag = true;

                    // Save high score if it is higher than previous highest score and display score
                    if (score > currentHigh) {
                        highScores.push(score);
                        localStorage.setItem('scores', JSON.stringify(highScores));
                        alert('New High Score: ' + score);
                    } else
                        alert('Game OverFinal Score: ' + score + '\nHighest Score: ' + currentHigh);

                    location.reload();
                }
                // put bird at starting location if game is not completed
                else {
                    birdY = containerHeight / 2 - 20;
                    birdX = 100;
                    bird.style.top = birdY + 'px';
                    bird.style.left = birdX + 'px';
                    updateLivesDisplay();
                }
            }
        }

        // increase score if pillar passed successfully
        if (!pillar.passed && pillar.x + pillarWidth < birdX) {
            pillar.passed = true;
            score += 10;
            scoreBoard.textContent = 'Score: ' + score + ' | High: ' + currentHigh;

            // increase life by 1 if it is less than 3 and score is increased by 50 
            if (score % 50 === 0 && lives < maxLives) {
                lives++;
                updateLivesDisplay();
            }
        }

        // Generate new pillar if pillar at first is out of screen
        if (pillar.x < -pillarWidth) {
            const randomHeight = Math.floor(Math.random() * (containerHeight - gap - 100)) + 50;
            pillar.lower.style.height = randomHeight + 'px';
            pillar.upper.style.height = containerHeight - randomHeight - gap + 'px';
            pillar.x = containerWidth;
            pillar.upper.style.left = pillar.x + 'px';
            pillar.lower.style.left = pillar.x + 'px';
            pillar.passed = false;
        }
    });
}

// pause and continue game
function toggleGame() {
    if (gameRunning) {
        clearInterval(gameInterval);
        gameRunning = false;
    } else {
        gameInterval = setInterval(gameLoop, 50);
        gameRunning = true;
        gameOverFlag = false;
    }
}

window.addEventListener('resize', () => {
    containerWidth = pillarContainer.offsetWidth;
    containerHeight = pillarContainer.offsetHeight;
});
