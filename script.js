document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const bird = document.querySelector('.bird');
    const gameContainer = document.querySelector('.game-container');
    const ground = document.querySelector('.ground');
    const sky = document.querySelector('.sky');
    
    // UI elements
    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('high-score');
    const finalScoreDisplay = document.getElementById('final-score');
    const gameOverScreen = document.querySelector('.game-over');
    const scoreContainer = document.querySelector('.score-container');
    const restartButton = document.getElementById('restart-button');
    const playAgainButton = document.getElementById('play-again-button');
    const startButton = document.getElementById('start-button');
    const instructions = document.querySelector('.instructions');
    
    // Create difficulty level indicator
    const difficultyIndicator = document.createElement('div');
    difficultyIndicator.classList.add('difficulty-indicator');
    difficultyIndicator.innerHTML = '<span class="difficulty-label">Difficulty: </span><span id="difficulty-level">1</span>';
    scoreContainer.appendChild(difficultyIndicator);
    
    // Game variables
    let birdLeft = Math.min(80, window.innerWidth * 0.1);
    let birdBottom = Math.min(350, window.innerHeight * 0.4);
    let gravity = 2.5;
    let isGameOver = false;
    let gap = Math.min(250, window.innerHeight * 0.25);
    let score = 0;
    let highScore = localStorage.getItem('flappyHighScore') || 0;
    let gameStarted = false;
    let gameTimerId;
    let generatePipeTimerId;
    let checkScoreTimerId;
    
    // Difficulty variables
    let pipeSpeed = 3;
    let pipeGenerationInterval = 1500;
    let difficultyLevel = 1;
    
    // Update high score display
    highScoreDisplay.textContent = highScore;
    
    // Initial bird position
    bird.style.bottom = birdBottom + 'px';
    bird.style.left = birdLeft + 'px';
    
    // Start game function
    function startGame() {
        instructions.style.display = 'none';
        scoreContainer.style.display = 'block';
        restartButton.style.display = 'block';
        gameStarted = true;
        score = 0;
        scoreDisplay.textContent = score;
        birdBottom = Math.min(350, window.innerHeight * 0.4);
        isGameOver = false;
        gameOverScreen.style.display = 'none';
        
        // Reset difficulty variables
        pipeSpeed = 3;
        pipeGenerationInterval = 1500;
        gap = 250;
        difficultyLevel = 1;
        
        // Reset difficulty level display
        document.getElementById('difficulty-level').textContent = difficultyLevel;
        
        // Remove any existing pipes
        document.querySelectorAll('.pipe').forEach(pipe => pipe.remove());
        
        // Start game mechanics
        gameTimerId = setInterval(updateGame, 20);
        generatePipeTimerId = setInterval(generatePipe, pipeGenerationInterval);
        checkScoreTimerId = setInterval(checkScore, 100);
    }
    
    // Update game state
    function updateGame() {
        birdBottom -= gravity;
        bird.style.bottom = birdBottom + 'px';
        bird.classList.add('fall');
        
        // Check for collisions
        checkCollision();
        
        // Check if bird is out of bounds
        if (birdBottom <= 0) {
            gameOver();
        }
    }
    
    // Make bird jump
    function jump() {
        if (isGameOver) return;
        if (!gameStarted) return;
        
        birdBottom += Math.min(65, window.innerHeight * 0.08);
        bird.style.bottom = birdBottom + 'px';
        bird.classList.remove('fall');
        bird.classList.add('fly');
        
        // Remove fly class after animation
        setTimeout(() => {
            bird.classList.remove('fly');
        }, 300);
        
        // Prevent bird from flying too high
        if (birdBottom > sky.clientHeight - bird.clientHeight) {
            birdBottom = sky.clientHeight - bird.clientHeight;
            bird.style.bottom = birdBottom + 'px';
        }
    }
    
    // Generate pipes
    function generatePipe() {
        if (isGameOver) return;
        
        // Pipe height variables
        const skyHeight = sky.clientHeight;
        // Use current gap value which changes with difficulty
        const pipeHeight = Math.floor(Math.random() * (skyHeight - gap - 100)) + 50;
        
        // Create top pipe
        const topPipe = document.createElement('div');
        topPipe.classList.add('pipe', 'pipe-top');
        topPipe.style.height = pipeHeight + 'px';
        topPipe.style.left = gameContainer.clientWidth + 'px';
        
        // Create pipe cap for top pipe
        const topPipeCap = document.createElement('div');
        topPipeCap.classList.add('pipe-cap');
        topPipe.appendChild(topPipeCap);
        
        // Create bottom pipe
        const bottomPipe = document.createElement('div');
        bottomPipe.classList.add('pipe', 'pipe-bottom');
        bottomPipe.style.height = skyHeight - pipeHeight - gap + 'px';
        bottomPipe.style.left = gameContainer.clientWidth + 'px';
        
        // Create pipe cap for bottom pipe
        const bottomPipeCap = document.createElement('div');
        bottomPipeCap.classList.add('pipe-cap');
        bottomPipe.appendChild(bottomPipeCap);
        
        // Add data attribute to track if score counted
        topPipe.dataset.scored = 'false';
        
        // Add pipes to game container
        gameContainer.appendChild(topPipe);
        gameContainer.appendChild(bottomPipe);
        
        // Move pipes
        let pipeLeft = gameContainer.clientWidth;
        function movePipe() {
            if (isGameOver) return;
            
            pipeLeft -= pipeSpeed;
            topPipe.style.left = pipeLeft + 'px';
            bottomPipe.style.left = pipeLeft + 'px';
            
            // Remove pipes when off screen
            if (pipeLeft < -100) {
                clearInterval(pipeTimerId);
                gameContainer.removeChild(topPipe);
                gameContainer.removeChild(bottomPipe);
            }
        }
        
        let pipeTimerId = setInterval(movePipe, 20);
    }
    
    // Check for collisions
    function checkCollision() {
        const pipes = document.querySelectorAll('.pipe');
        const birdRect = bird.getBoundingClientRect();
        
        // Create a smaller hitbox for more accurate collision detection
        const hitboxPadding = 5;
        const hitbox = {
            left: birdRect.left + hitboxPadding,
            right: birdRect.right - hitboxPadding,
            top: birdRect.top + hitboxPadding,
            bottom: birdRect.bottom - hitboxPadding
        };
        
        // Check collision with each pipe
        pipes.forEach(pipe => {
            const pipeRect = pipe.getBoundingClientRect();
            
            // Check for collision with adjusted hitbox
            if (
                hitbox.left < pipeRect.right &&
                hitbox.right > pipeRect.left &&
                hitbox.top < pipeRect.bottom &&
                hitbox.bottom > pipeRect.top
            ) {
                gameOver();
            }
        });
    }
    
    // Check if bird passed a pipe to increment score
    function checkScore() {
        if (isGameOver) return;
        
        const topPipes = document.querySelectorAll('.pipe-top');
        const birdRect = bird.getBoundingClientRect();
        
        topPipes.forEach(pipe => {
            const pipeRect = pipe.getBoundingClientRect();
            
            // If bird passed the pipe and score not counted yet
            if (birdRect.left > pipeRect.right && pipe.dataset.scored === 'false') {
                pipe.dataset.scored = 'true';
                score++;
                scoreDisplay.textContent = score;
                
                // Increase difficulty based on score
                updateDifficulty();
                
                // Play score sound (if you want to add sound)
                // const scoreSound = new Audio('score.mp3');
                // scoreSound.play();
            }
        });
    }
    
    // Update difficulty based on score
    function updateDifficulty() {
        // Calculate new difficulty level based on score
        const newLevel = Math.floor(score / 5) + 1;
        
        // Only update if difficulty level has increased
        if (newLevel > difficultyLevel) {
            difficultyLevel = newLevel;
            
            // Increase pipe speed (max 8)
            pipeSpeed = Math.min(3 + (difficultyLevel * 0.5), 8);
            
            // Decrease gap between pipes (min 150px or 15% of screen height)
            const minGap = Math.max(150, window.innerHeight * 0.15);
            gap = Math.max(Math.min(250, window.innerHeight * 0.25) - (difficultyLevel * 10), minGap);
            
            // Decrease pipe generation interval (min 800ms)
            const newInterval = Math.max(1500 - (difficultyLevel * 70), 800);
            
            // Only update interval if it changed significantly
            if (Math.abs(newInterval - pipeGenerationInterval) > 50) {
                pipeGenerationInterval = newInterval;
                
                // Reset the pipe generation timer with new interval
                clearInterval(generatePipeTimerId);
                generatePipeTimerId = setInterval(generatePipe, pipeGenerationInterval);
            }
            
            // Update difficulty level display
            document.getElementById('difficulty-level').textContent = difficultyLevel;
            
            console.log(`Difficulty increased to level ${difficultyLevel}: Speed ${pipeSpeed}, Gap ${gap}, Interval ${pipeGenerationInterval}`);
        }
    }
    
    // Game over function
    function gameOver() {
        clearInterval(gameTimerId);
        clearInterval(generatePipeTimerId);
        clearInterval(checkScoreTimerId);
        isGameOver = true;
        
        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('flappyHighScore', highScore);
            highScoreDisplay.textContent = highScore;
        }
        
        // Show game over screen
        finalScoreDisplay.textContent = score;
        
        // Add difficulty level reached to game over screen
        if (!document.getElementById('final-difficulty')) {
            const finalDifficultyContainer = document.createElement('div');
            finalDifficultyContainer.classList.add('final-difficulty-container');
            finalDifficultyContainer.innerHTML = '<div class="score-title">DIFFICULTY REACHED</div><div id="final-difficulty">' + difficultyLevel + '</div>';
            
            // Insert after final score container
            const finalScoreContainer = document.querySelector('.final-score-container');
            finalScoreContainer.parentNode.insertBefore(finalDifficultyContainer, finalScoreContainer.nextSibling);
        } else {
            document.getElementById('final-difficulty').textContent = difficultyLevel;
        }
        
        
    // Event listeners
    document.addEventListener('click', jump);
    document.addEventListener('keydown', event => {
        if (event.code === 'Space') {
            jump();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Update game variables based on new window size
        if (!gameStarted) {
            birdLeft = Math.min(80, window.innerWidth * 0.1);
            birdBottom = Math.min(350, window.innerHeight * 0.4);
            bird.style.left = birdLeft + 'px';
            bird.style.bottom = birdBottom + 'px';
            gap = Math.min(250, window.innerHeight * 0.25);
        }
    });
    
    restartButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);
    startButton.addEventListener('click', startGame);
});
