export class HistoryManager {
    constructor() {
        this.history = [];
        this.historyList = document.getElementById('historyList');
        this.loadFromStorage();
    }

    addRecord(values) {
        const record = {
            values: values,
            total: values.reduce((a, b) => a + b, 0),
            time: new Date().toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        };
        
        this.history.unshift(record);
        if (this.history.length > 50) {
            this.history.pop();
        }
        
        this.saveToStorage();
        this.render();
    }

    clear() {
        this.history = [];
        this.saveToStorage();
        this.render();
    }

    render() {
        this.historyList.innerHTML = '';
        
        this.history.forEach(record => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="time">${record.time}</span>
                <span class="values">${record.values.join(' + ')} = ${record.total}</span>
            `;
            this.historyList.appendChild(li);
        });
    }

    saveToStorage() {
        localStorage.setItem('diceHistory', JSON.stringify(this.history));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('diceHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.render();
        }
    }
}