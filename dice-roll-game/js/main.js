import { DiceManager } from './dice.js';
import { HistoryManager } from './history.js';

class DiceGame {
    constructor() {
        this.diceManager = new DiceManager();
        this.historyManager = new HistoryManager();
        
        this.diceCountInput = document.getElementById('diceCount');
        this.skinSelect = document.getElementById('skinSelect');
        this.rollBtn = document.getElementById('rollBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.currentResult = document.getElementById('currentResult');
        
        this.currentSkin = 'classic';
        this.isRolling = false;
        
        this.init();
    }

    init() {
        this.loadSettings();
        this.diceManager.setDiceCount(this.getDiceCount(), this.currentSkin);
        this.bindEvents();
    }

    bindEvents() {
        this.diceCountInput.addEventListener('change', () => {
            if (!this.isRolling) {
                this.diceManager.setDiceCount(this.getDiceCount(), this.currentSkin);
                this.saveSettings();
            }
        });

        this.skinSelect.addEventListener('change', () => {
            this.currentSkin = this.skinSelect.value;
            this.diceManager.setSkinForAll(this.currentSkin);
            this.saveSettings();
        });

        this.rollBtn.addEventListener('click', () => this.rollDice());

        this.clearHistoryBtn.addEventListener('click', () => {
            this.historyManager.clear();
        });

        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isRolling) {
                e.preventDefault();
                this.rollDice();
            }
        });
    }

    async rollDice() {
        if (this.isRolling) return;
        
        this.isRolling = true;
        this.rollBtn.disabled = true;
        this.currentResult.textContent = '摇动中...';
        
        const values = await this.diceManager.rollAll();
        const total = values.reduce((a, b) => a + b, 0);
        
        this.currentResult.textContent = values.length > 1 
            ? `${values.join(' + ')} = ${total}` 
            : total;
        
        this.historyManager.addRecord(values);
        
        this.isRolling = false;
        this.rollBtn.disabled = false;
    }

    getDiceCount() {
        let count = parseInt(this.diceCountInput.value);
        if (isNaN(count) || count < 1) count = 1;
        if (count > 10) count = 10;
        this.diceCountInput.value = count;
        return count;
    }

    saveSettings() {
        localStorage.setItem('diceCount', this.getDiceCount());
        localStorage.setItem('diceSkin', this.currentSkin);
    }

    loadSettings() {
        const savedCount = localStorage.getItem('diceCount');
        const savedSkin = localStorage.getItem('diceSkin');
        
        if (savedCount) {
            this.diceCountInput.value = savedCount;
        }
        if (savedSkin) {
            this.currentSkin = savedSkin;
            this.skinSelect.value = savedSkin;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DiceGame();
});