export class Storage {
  constructor() {
    this.baseKey = 'flappy_bird_high_score';
  }

  getKey(difficulty) {
    return `${this.baseKey}_${difficulty}`;
  }

  getHighScore(difficulty) {
    try {
      const stored = localStorage.getItem(this.getKey(difficulty));
      return stored ? parseInt(stored, 10) : 0;
    } catch (e) {
      console.warn('Failed to get high score from localStorage:', e);
      return 0;
    }
  }

  setHighScore(difficulty, score) {
    try {
      localStorage.setItem(this.getKey(difficulty), score.toString());
      return true;
    } catch (e) {
      console.warn('Failed to save high score to localStorage:', e);
      return false;
    }
  }

  updateHighScoreIfNeeded(difficulty, score) {
    const currentHighScore = this.getHighScore(difficulty);
    if (score > currentHighScore) {
      this.setHighScore(difficulty, score);
      return true;
    }
    return false;
  }

  clearHighScore(difficulty) {
    try {
      localStorage.removeItem(this.getKey(difficulty));
      return true;
    } catch (e) {
      console.warn('Failed to clear high score from localStorage:', e);
      return false;
    }
  }

  getAllHighScores() {
    return {
      easy: this.getHighScore('easy'),
      normal: this.getHighScore('normal'),
      hard: this.getHighScore('hard')
    };
  }
}
