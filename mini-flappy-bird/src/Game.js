export const DIFFICULTY_CONFIG = {
  easy: {
    name: '简单',
    gravity: 0.2,
    jumpForce: -5,
    pipeSpeed: 2,
    pipeGap: 220,
    pipeSpacing: 300
  },
  normal: {
    name: '普通',
    gravity: 0.25,
    jumpForce: -6,
    pipeSpeed: 3,
    pipeGap: 180,
    pipeSpacing: 250
  },
  hard: {
    name: '困难',
    gravity: 0.35,
    jumpForce: -7,
    pipeSpeed: 4.5,
    pipeGap: 150,
    pipeSpacing: 200
  }
};

export class Bird {
  constructor(x, y, size, gravity, jumpForce) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.velocity = 0;
    this.gravity = gravity;
    this.jumpForce = jumpForce;
    this.rotation = 0;
  }

  jump() {
    this.velocity = this.jumpForce;
  }

  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;
    this.rotation = Math.min(Math.max(this.velocity * 3, -30), 90);
  }

  getBounds() {
    return {
      x: this.x - this.size / 2 + 4,
      y: this.y - this.size / 2 + 4,
      width: this.size - 8,
      height: this.size - 8
    };
  }
}

export class Pipe {
  constructor(x, gapY, gapHeight, width, canvasHeight, speed) {
    this.x = x;
    this.gapY = gapY;
    this.gapHeight = gapHeight;
    this.width = width;
    this.canvasHeight = canvasHeight;
    this.scored = false;
    this.speed = speed;
  }

  update() {
    this.x -= this.speed;
  }

  getTopBounds() {
    return {
      x: this.x,
      y: 0,
      width: this.width,
      height: this.gapY - this.gapHeight / 2
    };
  }

  getBottomBounds() {
    return {
      x: this.x,
      y: this.gapY + this.gapHeight / 2,
      width: this.width,
      height: this.canvasHeight - (this.gapY + this.gapHeight / 2)
    };
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }
}

export class Game {
  constructor(canvasWidth, canvasHeight, difficulty = 'normal') {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.difficulty = difficulty;
    this.difficultyConfig = DIFFICULTY_CONFIG[difficulty];
    this.bird = null;
    this.pipes = [];
    this.score = 0;
    this.highScore = 0;
    this.gameState = 'idle';
    this.pipeWidth = 60;
    this.lastPipeX = 0;
  }

  setDifficulty(difficulty) {
    this.difficulty = difficulty;
    this.difficultyConfig = DIFFICULTY_CONFIG[difficulty];
  }

  init() {
    const config = this.difficultyConfig;
    this.bird = new Bird(
      this.canvasWidth / 3,
      this.canvasHeight / 2,
      40,
      config.gravity,
      config.jumpForce
    );
    this.pipes = [];
    this.score = 0;
    this.gameState = 'idle';
    this.lastPipeX = this.canvasWidth;
  }

  start() {
    if (this.gameState === 'idle' || this.gameState === 'gameOver') {
      this.init();
      this.gameState = 'playing';
      this.bird.jump();
    } else if (this.gameState === 'playing') {
      this.bird.jump();
    }
  }

  spawnPipe() {
    const config = this.difficultyConfig;
    const minGapY = config.pipeGap / 2 + 50;
    const maxGapY = this.canvasHeight - config.pipeGap / 2 - 50;
    const gapY = Math.random() * (maxGapY - minGapY) + minGapY;
    
    const pipe = new Pipe(
      this.lastPipeX + config.pipeSpacing,
      gapY,
      config.pipeGap,
      this.pipeWidth,
      this.canvasHeight,
      config.pipeSpeed
    );
    
    this.pipes.push(pipe);
    this.lastPipeX = pipe.x;
  }

  checkCollision(birdBounds, pipeBounds) {
    return (
      birdBounds.x < pipeBounds.x + pipeBounds.width &&
      birdBounds.x + birdBounds.width > pipeBounds.x &&
      birdBounds.y < pipeBounds.y + pipeBounds.height &&
      birdBounds.y + birdBounds.height > pipeBounds.y
    );
  }

  update() {
    if (this.gameState !== 'playing') return;

    this.bird.update();

    if (this.bird.y - this.bird.size / 2 < 0 || 
        this.bird.y + this.bird.size / 2 > this.canvasHeight) {
      this.gameOver();
      return;
    }

    if (this.pipes.length === 0 || 
        this.pipes[this.pipes.length - 1].x < this.canvasWidth - this.difficultyConfig.pipeSpacing) {
      this.spawnPipe();
    }

    const birdBounds = this.bird.getBounds();
    
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const pipe = this.pipes[i];
      pipe.update();

      if (this.checkCollision(birdBounds, pipe.getTopBounds()) ||
          this.checkCollision(birdBounds, pipe.getBottomBounds())) {
        this.gameOver();
        return;
      }

      if (!pipe.scored && pipe.x + pipe.width < this.bird.x) {
        pipe.scored = true;
        this.score++;
      }

      if (pipe.isOffScreen()) {
        this.pipes.splice(i, 1);
      }
    }
  }

  gameOver() {
    this.gameState = 'gameOver';
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
  }

  getState() {
    return {
      bird: this.bird,
      pipes: this.pipes,
      score: this.score,
      highScore: this.highScore,
      gameState: this.gameState,
      difficulty: this.difficulty,
      difficultyName: this.difficultyConfig.name
    };
  }
}
