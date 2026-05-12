import './style.css';
import { Game, DIFFICULTY_CONFIG } from './Game.js';
import { Renderer } from './Renderer.js';
import { Storage } from './Storage.js';

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 600;

class App {
  constructor() {
    this.currentDifficulty = 'normal';
    this.canvas = this.createCanvas();
    this.difficultyButtons = this.createDifficultyButtons();
    this.game = new Game(CANVAS_WIDTH, CANVAS_HEIGHT, this.currentDifficulty);
    this.renderer = new Renderer(this.canvas);
    this.storage = new Storage();
    this.animationId = null;
    
    this.init();
  }

  createCanvas() {
    const app = document.getElementById('app');
    
    const title = document.createElement('h1');
    title.textContent = '🐦 像素小鸟';
    app.appendChild(title);
    
    const canvas = document.createElement('canvas');
    canvas.id = 'gameCanvas';
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    app.appendChild(canvas);
    
    const instructions = document.createElement('div');
    instructions.className = 'instructions';
    instructions.innerHTML = `
      <p>🎮 点击屏幕或按空格键让小鸟飞翔</p>
      <p> pipes 管道，不要撞到！</p>
      <p>🏆 最高分按难度保存在本地</p>
    `;
    app.appendChild(instructions);
    
    return canvas;
  }

  createDifficultyButtons() {
    const app = document.getElementById('app');
    const container = document.createElement('div');
    container.className = 'difficulty-container';
    
    const buttons = {};
    
    Object.entries(DIFFICULTY_CONFIG).forEach(([key, config]) => {
      const button = document.createElement('button');
      button.className = 'difficulty-btn';
      button.dataset.difficulty = key;
      button.textContent = config.name;
      
      if (key === this.currentDifficulty) {
        button.classList.add('active');
      }
      
      button.addEventListener('click', () => this.changeDifficulty(key));
      container.appendChild(button);
      buttons[key] = button;
    });
    
    app.insertBefore(container, this.canvas.nextSibling);
    return buttons;
  }

  changeDifficulty(difficulty) {
    if (this.game.gameState === 'playing') return;
    
    this.currentDifficulty = difficulty;
    this.game.setDifficulty(difficulty);
    this.game.highScore = this.storage.getHighScore(difficulty);
    this.game.init();
    
    Object.entries(this.difficultyButtons).forEach(([key, btn]) => {
      btn.classList.toggle('active', key === difficulty);
    });
  }

  init() {
    const highScore = this.storage.getHighScore(this.currentDifficulty);
    this.game.highScore = highScore;
    this.game.init();
    this.setupEventListeners();
    this.gameLoop();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
        this.handleInput();
      }
    });

    this.canvas.addEventListener('click', () => {
      this.handleInput();
    });

    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.handleInput();
    });
  }

  handleInput() {
    this.game.start();
  }

  gameLoop() {
    this.game.update();
    
    if (this.game.gameState === 'gameOver') {
      this.storage.updateHighScoreIfNeeded(this.currentDifficulty, this.game.score);
      this.game.highScore = this.storage.getHighScore(this.currentDifficulty);
    }
    
    const state = this.game.getState();
    state.highScore = this.storage.getHighScore(this.currentDifficulty);
    this.renderer.render(state);
    
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new App();
});
