export class Dice {
    constructor(skin = 'classic') {
        this.value = 1;
        this.skin = skin;
        this.element = this.createDiceElement();
    }

    createDiceElement() {
        const dice = document.createElement('div');
        dice.className = `dice ${this.skin}`;
        
        for (let i = 1; i <= 6; i++) {
            const face = document.createElement('div');
            face.className = `face face-${i}`;
            
            for (let j = 0; j < i; j++) {
                const dot = document.createElement('div');
                dot.className = 'dot';
                face.appendChild(dot);
            }
            
            dice.appendChild(face);
        }
        
        return dice;
    }

    roll() {
        return new Promise((resolve) => {
            this.element.classList.add('rolling');
            
            setTimeout(() => {
                this.value = Math.floor(Math.random() * 6) + 1;
                this.element.classList.remove('rolling');
                this.setRotation(this.value);
                resolve(this.value);
            }, 600);
        });
    }

    setRotation(value) {
        const rotations = {
            1: 'rotateX(0deg) rotateY(0deg)',
            2: 'rotateX(0deg) rotateY(-90deg)',
            3: 'rotateX(-90deg) rotateY(0deg)',
            4: 'rotateX(90deg) rotateY(0deg)',
            5: 'rotateX(0deg) rotateY(90deg)',
            6: 'rotateX(0deg) rotateY(180deg)'
        };
        this.element.style.transform = rotations[value];
    }

    setSkin(skin) {
        this.skin = skin;
        this.element.className = `dice ${skin}`;
    }

    getElement() {
        return this.element;
    }

    getValue() {
        return this.value;
    }
}

export class DiceManager {
    constructor() {
        this.dices = [];
        this.container = document.getElementById('diceContainer');
    }

    setDiceCount(count, skin) {
        this.container.innerHTML = '';
        this.dices = [];
        
        for (let i = 0; i < count; i++) {
            const dice = new Dice(skin);
            this.dices.push(dice);
            this.container.appendChild(dice.getElement());
        }
    }

    async rollAll() {
        const promises = this.dices.map(dice => dice.roll());
        return Promise.all(promises);
    }

    setSkinForAll(skin) {
        this.dices.forEach(dice => dice.setSkin(skin));
    }

    getValues() {
        return this.dices.map(dice => dice.getValue());
    }
}