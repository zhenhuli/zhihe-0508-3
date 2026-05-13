const cssCode = {
    '悬停缩放': `.btn-scale {
    background: linear-gradient(45deg, #667eea, #764ba2);
    color: white;
}

.btn-scale:hover {
    transform: scale(1.1);
}`,

    '背景渐变': `.btn-gradient {
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

    '边框动画': `.btn-border {
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

    '阴影浮动': `.btn-shadow {
    background: #764ba2;
    color: white;
    box-shadow: 0 5px 15px rgba(118, 75, 162, 0.4);
}

.btn-shadow:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(118, 75, 162, 0.5);
}`,

    '脉冲效果': `.btn-pulse {
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

    '滑动填充': `.btn-slide {
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

    '旋转圆环': `.spinner {
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

    '弹跳圆点': `.bounce {
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

    '跳动条纹': `.bars {
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

    '脉冲圆环': `.pulse-ring {
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

    '旋转方块': `.cube {
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

    '渐变转圈': `.gradient-spin {
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

    '卡片翻转': `.flip-card {
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

    '图片缩放': `.zoom-box {
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

    '滑动显示': `.slide-box {
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

    '颜色过渡': `.color-transition {
    width: 120px;
    height: 120px;
    border-radius: 10px;
    background: #667eea;
    transition: background 1s ease;
}

.color-transition:hover {
    background: #f5576c;
}`,

    '3D 旋转': `.rotate-3d-box {
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

    '弹性效果': `.bouncy-btn {
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

    '浮动动画': `.float-box {
    font-size: 3rem;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
}`,

    '抖动效果': `.shake-box {
    font-size: 3rem;
    animation: shake 2s ease-in-out infinite;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
}`,

    '打字效果': `.typing {
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

    '彩虹文字': `.rainbow-text {
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

    '心跳动画': `.heartbeat {
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

    '波纹扩散': `.ripple-container {
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
    '悬停缩放': `<button class="btn btn-scale">Hover Me</button>`,
    '背景渐变': `<button class="btn btn-gradient">Hover Me</button>`,
    '边框动画': `<button class="btn btn-border">Hover Me</button>`,
    '阴影浮动': `<button class="btn btn-shadow">Hover Me</button>`,
    '脉冲效果': `<button class="btn btn-pulse">Click Me</button>`,
    '滑动填充': `<button class="btn btn-slide">Hover Me</button>`,
    '旋转圆环': `<div class="loader spinner"></div>`,
    '弹跳圆点': `<div class="loader bounce">
    <span></span>
    <span></span>
    <span></span>
</div>`,
    '跳动条纹': `<div class="loader bars">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
</div>`,
    '脉冲圆环': `<div class="loader pulse-ring"></div>`,
    '旋转方块': `<div class="loader cube"></div>`,
    '渐变转圈': `<div class="loader gradient-spin"></div>`,
    '卡片翻转': `<div class="flip-card">
    <div class="flip-card-inner">
        <div class="flip-card-front">正面</div>
        <div class="flip-card-back">背面</div>
    </div>
</div>`,
    '图片缩放': `<div class="zoom-box">
    <div class="zoom-content">Hover Me</div>
</div>`,
    '滑动显示': `<div class="slide-box">
    <div class="slide-overlay">
        <span>Hello!</span>
    </div>
</div>`,
    '颜色过渡': `<div class="color-transition"></div>`,
    '3D 旋转': `<div class="rotate-3d-box">Hover</div>`,
    '弹性效果': `<button class="bouncy-btn">Click</button>`,
    '浮动动画': `<div class="float-box">🎈</div>`,
    '抖动效果': `<div class="shake-box">📱</div>`,
    '打字效果': `<div class="typing">Hello World!</div>`,
    '彩虹文字': `<div class="rainbow-text">COLORFUL</div>`,
    '心跳动画': `<div class="heartbeat">❤️</div>`,
    '波纹扩散': `<div class="ripple-container">
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

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');

            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    codeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            codeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentCodeType = this.getAttribute('data-code-type');
            updateCodeDisplay();
        });
    });

    function updateCodeDisplay() {
        if (!currentTitle) return;
        
        const code = currentCodeType === 'css' 
            ? cssCode[currentTitle] 
            : htmlCode[currentTitle];
            
        codeDisplay.textContent = code || '未找到代码...';
    }

    demoCards.forEach(card => {
        card.addEventListener('click', function() {
            demoCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');

            currentTitle = this.querySelector('h3').textContent;
            codeTitle.textContent = currentTitle;
            updateCodeDisplay();
        });
    });

    copyBtn.addEventListener('click', function() {
        const code = codeDisplay.textContent;
        
        navigator.clipboard.writeText(code).then(() => {
            copyBtn.classList.add('copied');
            copyBtn.textContent = '已复制!';
            
            setTimeout(() => {
                copyBtn.classList.remove('copied');
                copyBtn.textContent = '复制代码';
            }, 2000);
        }).catch(err => {
            console.error('复制失败:', err);
        });
    });
});
