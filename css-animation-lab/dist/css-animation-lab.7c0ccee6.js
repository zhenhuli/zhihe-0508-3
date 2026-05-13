const cssCode = {
    "\u60AC\u505C\u7F29\u653E": `.btn-scale {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
}

.btn-scale:hover {
    transform: scale(1.1);
}`,
    "\u80CC\u666F\u6E10\u53D8": `.btn-gradient {
    position: relative;
    overflow: hidden;
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    z-index: 1;
}

.btn-gradient::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #f093fb, #f5576c);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: -1;
}

.btn-gradient:hover::before {
    opacity: 1;
}`,
    "\u8FB9\u6846\u52A8\u753B": `.btn-border {
    background: white;
    color: #667eea;
    position: relative;
    z-index: 1;
}

.btn-border::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 2px solid transparent;
    border-radius: 8px;
    background: linear-gradient(45deg, #667eea, #f093fb) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
}

.btn-border::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 6px;
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
}

.btn-border:hover {
    color: white;
}

.btn-border:hover::after {
    opacity: 1;
}`,
    "\u9634\u5F71\u6D6E\u52A8": `.btn-shadow {
    background: #764ba2;
    color: white;
    box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4);
}

.btn-shadow:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(118, 75, 162, 0.5);
}`,
    "\u8109\u51B2\u6548\u679C": `.btn-pulse {
    background: linear-gradient(45deg, #f5576c, #f093fb);
    color: white;
    position: relative;
    z-index: 1;
}

.btn-pulse::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease;
    z-index: -1;
}

.btn-pulse:hover::before {
    width: 300px;
    height: 300px;
    opacity: 0;
}

.btn-pulse:active {
    animation: pulse-click 0.4s ease;
}

@keyframes pulse-click {
    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 87, 108, 0.7); }
    50% { transform: scale(0.95); box-shadow: 0 0 0 10px rgba(245, 87, 108, 0); }
    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 87, 108, 0); }
}`,
    "\u6ED1\u52A8\u586B\u5145": `.btn-slide {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
    position: relative;
    overflow: hidden;
    z-index: 1;
}

.btn-slide::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background: #667eea;
    transition: height 0.3s ease;
    z-index: -1;
}

.btn-slide:hover {
    color: white;
}

.btn-slide:hover::before {
    height: 100%;
}`,
    "\u65CB\u8F6C\u5706\u73AF": `.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #e0e0e0;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`,
    "\u5F39\u8DF3\u5706\u70B9": `.bounce {
    display: flex;
    gap: 8px;
    justify-content: center;
}

.bounce span {
    width: 12px;
    height: 12px;
    background: #667eea;
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite both;
}

.bounce span:nth-child(1) { animation-delay: -0.32s; }
.bounce span:nth-child(2) { animation-delay: -0.16s; }
.bounce span:nth-child(3) { animation-delay: 0s; }

@keyframes bounce {
    0%, 80%, 100% { transform: scale(0); }
    40% { transform: scale(1); }
}`,
    "\u8DF3\u52A8\u6761\u7EB9": `.bars {
    display: flex;
    gap: 4px;
    align-items: flex-end;
    height: 50px;
    justify-content: center;
}

.bars span {
    width: 8px;
    height: 100%;
    background: linear-gradient(to top, #667eea, #764ba2);
    border-radius: 4px;
    animation: bars 1.2s ease-in-out infinite;
}

.bars span:nth-child(1) { animation-delay: 0s; }
.bars span:nth-child(2) { animation-delay: 0.1s; }
.bars span:nth-child(3) { animation-delay: 0.2s; }
.bars span:nth-child(4) { animation-delay: 0.3s; }
.bars span:nth-child(5) { animation-delay: 0.4s; }

@keyframes bars {
    0%, 40%, 100% { height: 20%; }
    20% { height: 100%; }
}`,
    "\u8109\u51B2\u5706\u73AF": `.pulse-ring {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #667eea;
    animation: pulse-ring 1.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
}

@keyframes pulse-ring {
    0% { transform: scale(0.5); opacity: 1; }
    100% { transform: scale(1.5); opacity: 0; }
}`,
    "\u65CB\u8F6C\u65B9\u5757": `.cube {
    width: 40px;
    height: 40px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    animation: cube 1.2s ease-in-out infinite;
    border-radius: 4px;
}

@keyframes cube {
    25% { transform: rotate(90deg) scale(0.8); }
    50% { transform: rotate(180deg) scale(1); }
    75% { transform: rotate(270deg) scale(0.8); }
    100% { transform: rotate(360deg) scale(1); }
}`,
    "\u6E10\u53D8\u8F6C\u5708": `.gradient-spin {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, #667eea, #764ba2, #f093fb, #f5576c, #667eea);
    animation: gradient-spin 1.5s linear infinite;
}

@keyframes gradient-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}`,
    "\u5361\u7247\u7FFB\u8F6C": `.flip-card {
    width: 120px;
    height: 120px;
    perspective: 1000px;
}

.flip-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s;
    transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-weight: 600;
    color: white;
}

.flip-card-front {
    background: linear-gradient(45deg, #667eea, #764ba2);
}

.flip-card-back {
    background: linear-gradient(45deg, #f093fb, #f5576c);
    transform: rotateY(180deg);
}`,
    "\u56FE\u7247\u7F29\u653E": `.zoom-box {
    width: 120px;
    height: 120px;
    overflow: hidden;
    border-radius: 10px;
}

.zoom-content {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    transition: transform 0.5s ease;
}

.zoom-box:hover .zoom-content {
    transform: scale(1.3);
}`,
    "\u6ED1\u52A8\u663E\u793A": `.slide-box {
    width: 120px;
    height: 120px;
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    background: linear-gradient(45deg, #667eea, #764ba2);
}

.slide-overlay {
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(240, 147, 251, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    transition: left 0.4s ease;
}

.slide-box:hover .slide-overlay {
    left: 0;
}`,
    "\u989C\u8272\u8FC7\u6E21": `.color-transition {
    width: 120px;
    height: 120px;
    border-radius: 10px;
    background: #667eea;
    transition: background 1s ease;
}

.color-transition:hover {
    background: #f5576c;
}`,
    "3D \u65CB\u8F6C": `.rotate-3d-box {
    width: 100px;
    height: 100px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    transition: transform 0.6s ease;
    transform-style: preserve-3d;
}

.rotate-3d-box:hover {
    transform: rotateY(180deg) rotateX(180deg);
}`,
    "\u5F39\u6027\u6548\u679C": `.bouncy-btn {
    padding: 15px 30px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.bouncy-btn:hover {
    transform: scale(1.1);
}

.bouncy-btn:active {
    transform: scale(0.95);
}`,
    "\u6D6E\u52A8\u52A8\u753B": `.float-box {
    font-size: 3rem;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}`,
    "\u6296\u52A8\u6548\u679C": `.shake-box {
    font-size: 3rem;
    animation: shake 2s ease-in-out infinite;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}`,
    "\u6253\u5B57\u6548\u679C": `.typing {
    font-family: 'Courier New', monospace;
    font-size: 1.2rem;
    font-weight: 600;
    color: #667eea;
    overflow: hidden;
    border-right: 3px solid #667eea;
    white-space: nowrap;
    animation: typing 3.5s steps(12) infinite, blink 0.75s step-end infinite;
    width: 12ch;
}

@keyframes typing {
    0%, 100% { width: 0; }
    50%, 90% { width: 12ch; }
}

@keyframes blink {
    from, to { border-color: transparent; }
    50% { border-color: #667eea; }
}`,
    "\u5F69\u8679\u6587\u5B57": `.rainbow-text {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c, #667eea);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: rainbow 3s linear infinite;
}

@keyframes rainbow {
    0% { background-position: 0% center; }
    100% { background-position: 200% center; }
}`,
    "\u5FC3\u8DF3\u52A8\u753B": `.heartbeat {
    font-size: 3rem;
    animation: heartbeat 1.5s ease-in-out infinite;
}

@keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    14% { transform: scale(1.3); }
    28% { transform: scale(1); }
    42% { transform: scale(1.3); }
    70% { transform: scale(1); }
}`,
    "\u6CE2\u7EB9\u6269\u6563": `.ripple-container {
    width: 100px;
    height: 100px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.ripple {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #667eea;
    animation: ripple 2s ease-out infinite;
}

@keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(4); opacity: 0; }
}`
};
const htmlCode = {
    "\u60AC\u505C\u7F29\u653E": `<button class="btn btn-scale">Hover Me</button>`,
    "\u80CC\u666F\u6E10\u53D8": `<button class="btn btn-gradient">Hover Me</button>`,
    "\u8FB9\u6846\u52A8\u753B": `<button class="btn btn-border">Hover Me</button>`,
    "\u9634\u5F71\u6D6E\u52A8": `<button class="btn btn-shadow">Hover Me</button>`,
    "\u8109\u51B2\u6548\u679C": `<button class="btn btn-pulse">Click Me</button>`,
    "\u6ED1\u52A8\u586B\u5145": `<button class="btn btn-slide">Hover Me</button>`,
    "\u65CB\u8F6C\u5706\u73AF": `<div class="loader spinner"></div>`,
    "\u5F39\u8DF3\u5706\u70B9": `<div class="loader bounce">
    <span></span>
    <span></span>
    <span></span>
</div>`,
    "\u8DF3\u52A8\u6761\u7EB9": `<div class="loader bars">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</div>`,
    "\u8109\u51B2\u5706\u73AF": `<div class="loader pulse-ring"></div>`,
    "\u65CB\u8F6C\u65B9\u5757": `<div class="loader cube"></div>`,
    "\u6E10\u53D8\u8F6C\u5708": `<div class="loader gradient-spin"></div>`,
    "\u5361\u7247\u7FFB\u8F6C": `<div class="flip-card">
    <div class="flip-card-inner">
        <div class="flip-card-front">\u{6B63}\u{9762}</div>
        <div class="flip-card-back">\u{80CC}\u{9762}</div>
    </div>
</div>`,
    "\u56FE\u7247\u7F29\u653E": `<div class="zoom-box">
    <div class="zoom-content">Hover Me</div>
</div>`,
    "\u6ED1\u52A8\u663E\u793A": `<div class="slide-box">
    <div class="slide-overlay">
        <span>Hello!</span>
    </div>
</div>`,
    "\u989C\u8272\u8FC7\u6E21": `<div class="color-transition"></div>`,
    "3D \u65CB\u8F6C": `<div class="rotate-3d-box">Hover</div>`,
    "\u5F39\u6027\u6548\u679C": `<button class="bouncy-btn">Click</button>`,
    "\u6D6E\u52A8\u52A8\u753B": `<div class="float-box">\u{1F388}</div>`,
    "\u6296\u52A8\u6548\u679C": `<div class="shake-box">\u{1F4F1}</div>`,
    "\u6253\u5B57\u6548\u679C": `<div class="typing">Hello World!</div>`,
    "\u5F69\u8679\u6587\u5B57": `<div class="rainbow-text">COLORFUL</div>`,
    "\u5FC3\u8DF3\u52A8\u753B": `<div class="heartbeat">\u{2764}\u{FE0F}</div>`,
    "\u6CE2\u7EB9\u6269\u6563": `<div class="ripple-container">
    <div class="ripple"></div>
</div>`
};
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const demoCards = document.querySelectorAll('.demo-card');
    const codeDisplay = document.getElementById('code-display');
    const codeTitle = document.getElementById('code-title');
    const copyBtn = document.getElementById('copy-btn');
    const codeTabs = document.querySelectorAll('.code-tab');
    let currentTitle = '';
    let currentCodeType = 'css';
    tabButtons.forEach((button)=>{
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            tabButtons.forEach((btn)=>btn.classList.remove('active'));
            tabContents.forEach((content)=>content.classList.remove('active'));
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    codeTabs.forEach((tab)=>{
        tab.addEventListener('click', function() {
            codeTabs.forEach((t)=>t.classList.remove('active'));
            this.classList.add('active');
            currentCodeType = this.getAttribute('data-code-type');
            updateCodeDisplay();
        });
    });
    function updateCodeDisplay() {
        if (!currentTitle) return;
        const code = currentCodeType === 'css' ? cssCode[currentTitle] : htmlCode[currentTitle];
        codeDisplay.textContent = code || "\u672A\u627E\u5230\u4EE3\u7801...";
    }
    demoCards.forEach((card)=>{
        card.addEventListener('click', function() {
            demoCards.forEach((c)=>c.classList.remove('selected'));
            this.classList.add('selected');
            currentTitle = this.querySelector('h3').textContent;
            codeTitle.textContent = currentTitle;
            updateCodeDisplay();
        });
    });
    copyBtn.addEventListener('click', function() {
        const code = codeDisplay.textContent;
        navigator.clipboard.writeText(code).then(()=>{
            copyBtn.classList.add('copied');
            copyBtn.textContent = "\u5DF2\u590D\u5236!";
            setTimeout(()=>{
                copyBtn.classList.remove('copied');
                copyBtn.textContent = "\u590D\u5236\u4EE3\u7801";
            }, 2000);
        }).catch((err)=>{
            console.error("\u590D\u5236\u5931\u8D25:", err);
        });
    });
});

//# sourceMappingURL=css-animation-lab.7c0ccee6.js.map
