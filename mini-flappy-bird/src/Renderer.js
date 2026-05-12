export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.colors = {
      sky: '#70c5ce',
      ground: '#ded895',
      groundDark: '#c4a059',
      bird: '#f7dc6f',
      birdDark: '#f39c12',
      birdBeak: '#e74c3c',
      birdEye: '#2c3e50',
      pipe: '#2ecc71',
      pipeDark: '#27ae60',
      pipeBorder: '#1e8449',
      text: '#ffffff',
      textStroke: '#000000'
    };
  }

  clear() {
    this.ctx.fillStyle = this.colors.sky;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawGround() {
    const groundHeight = 80;
    const y = this.canvas.height - groundHeight;
    
    this.ctx.fillStyle = this.colors.ground;
    this.ctx.fillRect(0, y, this.canvas.width, groundHeight);
    
    this.ctx.fillStyle = this.colors.groundDark;
    this.ctx.fillRect(0, y, this.canvas.width, 15);
    
    this.ctx.fillStyle = this.colors.ground;
    for (let x = 0; x < this.canvas.width; x += 40) {
      this.ctx.fillRect(x, y + 15, 20, 5);
    }
  }

  drawBird(bird) {
    const { x, y, size, rotation } = bird;
    
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.rotate(rotation * Math.PI / 180);
    
    this.ctx.fillStyle = this.colors.bird;
    this.ctx.fillRect(-size / 2, -size / 2, size, size);
    
    this.ctx.fillStyle = this.colors.birdDark;
    this.ctx.fillRect(-size / 2, 0, size, size / 2);
    
    this.ctx.fillStyle = this.colors.birdBeak;
    this.ctx.fillRect(size / 2, -5, 12, 10);
    
    this.ctx.fillStyle = this.colors.birdEye;
    this.ctx.fillRect(size / 4, -size / 4, 8, 8);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(size / 4 + 2, -size / 4 + 2, 3, 3);
    
    this.ctx.fillStyle = this.colors.birdDark;
    this.ctx.fillRect(-size / 2 + 5, 0, size - 10, 5);
    
    this.ctx.restore();
  }

  drawPipe(pipe) {
    const topBounds = pipe.getTopBounds();
    const bottomBounds = pipe.getBottomBounds();
    
    this.drawPipeSection(topBounds.x, topBounds.y, topBounds.width, topBounds.height, true);
    
    this.drawPipeSection(bottomBounds.x, bottomBounds.y, bottomBounds.width, bottomBounds.height, false);
  }

  drawPipeSection(x, y, width, height, isTop) {
    const capHeight = 30;
    const capWidth = width + 10;
    const capX = x - 5;
    
    this.ctx.fillStyle = this.colors.pipe;
    this.ctx.fillRect(x, y, width, height);
    
    this.ctx.fillStyle = this.colors.pipeDark;
    this.ctx.fillRect(x, y, 10, height);
    this.ctx.fillRect(x + width - 10, y, 10, height);
    
    let capY;
    if (isTop) {
      capY = y + height - capHeight;
    } else {
      capY = y;
    }
    
    this.ctx.fillStyle = this.colors.pipe;
    this.ctx.fillRect(capX, capY, capWidth, capHeight);
    
    this.ctx.fillStyle = this.colors.pipeDark;
    this.ctx.fillRect(capX, capY, 10, capHeight);
    this.ctx.fillRect(capX + capWidth - 10, capY, 10, capHeight);
    
    this.ctx.strokeStyle = this.colors.pipeBorder;
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(capX, capY, capWidth, capHeight);
  }

  drawScore(score) {
    this.ctx.fillStyle = this.colors.text;
    this.ctx.strokeStyle = this.colors.textStroke;
    this.ctx.font = 'bold 56px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'top';
    this.ctx.lineWidth = 4;
    this.ctx.strokeText(score.toString(), this.canvas.width / 2, 50);
    this.ctx.fillText(score.toString(), this.canvas.width / 2, 50);
  }

  drawStartScreen() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = this.colors.text;
    this.ctx.strokeStyle = this.colors.textStroke;
    this.ctx.font = 'bold 48px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.lineWidth = 3;
    this.ctx.strokeText('像素小鸟', this.canvas.width / 2, this.canvas.height / 2 - 80);
    this.ctx.fillText('像素小鸟', this.canvas.width / 2, this.canvas.height / 2 - 80);
    
    this.ctx.font = 'bold 24px monospace';
    this.ctx.strokeText('点击或按空格开始', this.canvas.width / 2, this.canvas.height / 2);
    this.ctx.fillText('点击或按空格开始', this.canvas.width / 2, this.canvas.height / 2);
  }

  drawGameOverScreen(score, highScore) {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.ctx.fillStyle = this.colors.text;
    this.ctx.strokeStyle = this.colors.textStroke;
    this.ctx.font = 'bold 48px monospace';
    this.ctx.textAlign = 'center';
    this.ctx.lineWidth = 3;
    this.ctx.strokeText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 100);
    this.ctx.fillText('游戏结束', this.canvas.width / 2, this.canvas.height / 2 - 100);
    
    this.ctx.font = 'bold 32px monospace';
    this.ctx.strokeText(`得分: ${score}`, this.canvas.width / 2, this.canvas.height / 2 - 30);
    this.ctx.fillText(`得分: ${score}`, this.canvas.width / 2, this.canvas.height / 2 - 30);
    
    this.ctx.strokeText(`最高分: ${highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
    this.ctx.fillText(`最高分: ${highScore}`, this.canvas.width / 2, this.canvas.height / 2 + 10);
    
    this.ctx.font = 'bold 24px monospace';
    this.ctx.strokeText('点击或按空格重新开始', this.canvas.width / 2, this.canvas.height / 2 + 70);
    this.ctx.fillText('点击或按空格重新开始', this.canvas.width / 2, this.canvas.height / 2 + 70);
  }

  drawHighScore(highScore) {
    this.ctx.fillStyle = this.colors.text;
    this.ctx.strokeStyle = this.colors.textStroke;
    this.ctx.font = 'bold 20px monospace';
    this.ctx.textAlign = 'right';
    this.ctx.textBaseline = 'top';
    this.ctx.lineWidth = 2;
    this.ctx.strokeText(`最高: ${highScore}`, this.canvas.width - 20, 20);
    this.ctx.fillText(`最高: ${highScore}`, this.canvas.width - 20, 20);
  }

  drawDifficulty(difficultyName) {
    this.ctx.fillStyle = this.colors.text;
    this.ctx.strokeStyle = this.colors.textStroke;
    this.ctx.font = 'bold 16px monospace';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'top';
    this.ctx.lineWidth = 2;
    this.ctx.strokeText(`难度: ${difficultyName}`, 20, 20);
    this.ctx.fillText(`难度: ${difficultyName}`, 20, 20);
  }

  render(gameState) {
    const { bird, pipes, score, highScore, gameState: state, difficultyName } = gameState;
    
    this.clear();
    
    pipes.forEach(pipe => this.drawPipe(pipe));
    
    this.drawGround();
    
    if (bird) {
      this.drawBird(bird);
    }
    
    this.drawScore(score);
    this.drawHighScore(highScore);
    this.drawDifficulty(difficultyName);
    
    if (state === 'idle') {
      this.drawStartScreen();
    } else if (state === 'gameOver') {
      this.drawGameOverScreen(score, highScore);
    }
  }
}
