import * as THREE from 'three';
import { GameScene } from './Scene.js';
import { Paddle, Ball, Brick } from './GameObject.js';

export class Game {
  constructor() {
    this.gameScene = new GameScene();
    this.paddle = new Paddle();
    this.ball = new Ball();
    this.bricks = [];
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.gameState = 'playing';
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.init();
  }

  init() {
    this.gameScene.scene.add(this.paddle.mesh);
    this.gameScene.scene.add(this.ball.mesh);
    
    this.createBricks();
    this.setupControls();
    this.createUI();
  }

  createBricks() {
    this.bricks.forEach(brick => {
      this.gameScene.scene.remove(brick.mesh);
    });
    this.bricks = [];

    const colors = [0xff6b6b, 0xffca3a, 0x4ecdc4, 0x45b7d1, 0x96ceb4];
    const rows = 3 + this.level;
    const cols = 6;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - cols / 2 + 0.5) * 2.2;
        const z = -10 + row * 1.5;
        const color = colors[row % colors.length];
        const brick = new Brick(x, z, color);
        this.bricks.push(brick);
        this.gameScene.scene.add(brick.mesh);
      }
    }
  }

  setupControls() {
    window.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.gameScene.camera);
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const intersectPoint = new THREE.Vector3();
      this.raycaster.ray.intersectPlane(plane, intersectPoint);
      
      if (intersectPoint) {
        this.paddle.moveTo(intersectPoint.x);
      }
    });

    window.addEventListener('click', () => {
      if (this.gameState === 'gameover') {
        this.restart();
      } else if (this.gameState === 'levelComplete') {
        this.nextLevel();
      }
    });
  }

  createUI() {
    const ui = document.createElement('div');
    ui.style.position = 'absolute';
    ui.style.top = '20px';
    ui.style.left = '20px';
    ui.style.color = 'white';
    ui.style.fontFamily = 'Arial, sans-serif';
    ui.style.fontSize = '20px';
    ui.style.zIndex = '100';
    ui.id = 'gameUI';
    document.body.appendChild(ui);
    this.updateUI();
  }

  updateUI() {
    const ui = document.getElementById('gameUI');
    if (ui) {
      let message = '';
      if (this.gameState === 'gameover') {
        message = '<br>点击重新开始';
      } else if (this.gameState === 'levelComplete') {
        message = '<br>点击进入下一关';
      }
      ui.innerHTML = `分数: ${this.score} | 关卡: ${this.level} | 生命: ${this.lives}${message}`;
    }
  }

  checkCollisions() {
    const ballBox = this.ball.getBoundingBox();

    if (this.ball.mesh.position.x < -7.5 || this.ball.mesh.position.x > 7.5) {
      this.ball.velocity.x *= -1;
      this.ball.mesh.position.x = Math.max(-7.5, Math.min(7.5, this.ball.mesh.position.x));
    }

    if (this.ball.mesh.position.z < -14.5) {
      this.ball.velocity.z *= -1;
      this.ball.mesh.position.z = -14.5;
    }

    if (this.ball.mesh.position.z > 14.5) {
      this.lives--;
      this.updateUI();
      if (this.lives <= 0) {
        this.gameState = 'gameover';
      } else {
        this.ball.reset();
      }
      return;
    }

    const paddleBox = this.paddle.getBoundingBox();
    if (ballBox.intersectsBox(paddleBox)) {
      const overlapX = Math.min(ballBox.max.x - paddleBox.min.x, paddleBox.max.x - ballBox.min.x);
      const overlapZ = Math.min(ballBox.max.z - paddleBox.min.z, paddleBox.max.z - ballBox.min.z);
      
      if (overlapZ < overlapX && this.ball.velocity.z > 0) {
        this.ball.velocity.z *= -1;
        const hitPoint = this.ball.mesh.position.x - this.paddle.mesh.position.x;
        this.ball.velocity.x = hitPoint * 0.1;
        this.ball.mesh.position.z = this.paddle.mesh.position.z - 1;
      } else if (overlapX < overlapZ) {
        this.ball.velocity.x *= -1;
      }
    }

    for (let i = this.bricks.length - 1; i >= 0; i--) {
      const brick = this.bricks[i];
      const brickBox = brick.getBoundingBox();
      
      if (ballBox.intersectsBox(brickBox)) {
        const overlapX = Math.min(ballBox.max.x - brickBox.min.x, brickBox.max.x - ballBox.min.x);
        const overlapZ = Math.min(ballBox.max.z - brickBox.min.z, brickBox.max.z - ballBox.min.z);
        
        if (overlapX < overlapZ) {
          this.ball.velocity.x *= -1;
        } else {
          this.ball.velocity.z *= -1;
        }
        
        this.gameScene.scene.remove(brick.mesh);
        this.bricks.splice(i, 1);
        this.score += brick.points;
        this.updateUI();
        
        if (this.bricks.length === 0) {
          this.gameState = 'levelComplete';
        }
        break;
      }
    }
  }

  update() {
    if (this.gameState !== 'playing') return;

    this.ball.update();
    this.checkCollisions();
  }

  render() {
    this.gameScene.render();
  }

  restart() {
    this.score = 0;
    this.level = 1;
    this.lives = 3;
    this.gameState = 'playing';
    this.ball.reset();
    this.createBricks();
    this.updateUI();
  }

  nextLevel() {
    this.level++;
    this.gameState = 'playing';
    this.ball.reset();
    this.createBricks();
    this.updateUI();
  }

  getDomElement() {
    return this.gameScene.getDomElement();
  }
}
