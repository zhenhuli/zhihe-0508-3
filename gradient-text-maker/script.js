const textInput = document.getElementById('textInput');
const gradientType = document.getElementById('gradientType');
const gradientDirection = document.getElementById('gradientDirection');
const radialShape = document.getElementById('radialShape');
const directionGroup = document.getElementById('directionGroup');
const radialShapeGroup = document.getElementById('radialShapeGroup');
const fontSize = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const fontFamily = document.getElementById('fontFamily');
const fontWeight = document.getElementById('fontWeight');
const previewText = document.getElementById('previewText');
const cssCode = document.getElementById('cssCode');
const svgCode = document.getElementById('svgCode');
const copyCssBtn = document.getElementById('copyCssBtn');
const copySvgBtn = document.getElementById('copySvgBtn');
const toast = document.getElementById('toast');
const addColorBtn = document.getElementById('addColorBtn');
const colorInputs = document.querySelector('.color-inputs');
const tabBtns = document.querySelectorAll('.tab-btn');
const codeContents = document.querySelectorAll('.code-content');

let colorCount = 2;

function getColors() {
    const colors = [];
    const colorElements = document.querySelectorAll('.color-item input[type="color"]');
    colorElements.forEach(el => {
        colors.push(el.value);
    });
    return colors;
}

function generateGradient() {
    const colors = getColors();
    if (gradientType.value === 'radial') {
        const shape = radialShape.value;
        return `radial-gradient(${shape}, ${colors.join(', ')})`;
    } else {
        const direction = gradientDirection.value;
        return `linear-gradient(${direction}, ${colors.join(', ')})`;
    }
}

function toggleGradientOptions() {
    if (gradientType.value === 'radial') {
        directionGroup.style.display = 'none';
        radialShapeGroup.style.display = 'block';
    } else {
        directionGroup.style.display = 'block';
        radialShapeGroup.style.display = 'none';
    }
}

function generateCSS() {
    const gradient = generateGradient();
    const css = `.gradient-text {
    font-size: ${fontSize.value}px;
    font-family: ${fontFamily.value};
    font-weight: ${fontWeight.value};
    background: ${gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}`;
    return css;
}

function getGradientDirection(direction) {
    const directions = {
        'to right': { x1: '0%', y1: '0%', x2: '100%', y2: '0%' },
        'to left': { x1: '100%', y1: '0%', x2: '0%', y2: '0%' },
        'to bottom': { x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
        'to top': { x1: '0%', y1: '100%', x2: '0%', y2: '0%' },
        'to right bottom': { x1: '0%', y1: '0%', x2: '100%', y2: '100%' },
        'to right top': { x1: '0%', y1: '100%', x2: '100%', y2: '0%' },
        'to left bottom': { x1: '100%', y1: '0%', x2: '0%', y2: '100%' },
        'to left top': { x1: '100%', y1: '100%', x2: '0%', y2: '0%' }
    };
    return directions[direction] || directions['to right'];
}

function generateSVG() {
    const colors = getColors();
    const text = textInput.value || '渐变文字';
    const size = fontSize.value;
    const font = fontFamily.value;
    const weight = fontWeight.value;
    
    const stops = colors.map((color, i) => {
        const offset = (i / (colors.length - 1)) * 100;
        return `    <stop offset="${offset}%" stop-color="${color}" />`;
    }).join('\n');
    
    let gradientElement;
    if (gradientType.value === 'radial') {
        gradientElement = `<radialGradient id="gradient" cx="50%" cy="50%" r="50%">
${stops}
    </radialGradient>`;
    } else {
        const dir = getGradientDirection(gradientDirection.value);
        gradientElement = `<linearGradient id="gradient" x1="${dir.x1}" y1="${dir.y1}" x2="${dir.x2}" y2="${dir.y2}">
${stops}
    </linearGradient>`;
    }
    
    const svg = `<svg width="100%" height="${size * 1.5}" viewBox="0 0 ${text.length * size * 0.6} ${size * 1.5}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${gradientElement}
  </defs>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" 
        font-family="${font}" 
        font-size="${size}" 
        font-weight="${weight}" 
        fill="url(#gradient)">
    ${text}
  </text>
</svg>`;
    return svg;
}

function highlightCSS(code) {
    return code
        .replace(/(\.[a-zA-Z-]+)/g, '<span class="code-keyword">$1</span>')
        .replace(/([a-zA-Z-]+)(?=:)/g, '<span class="code-property">$1</span>')
        .replace(/(:\s*)([^;{}]+)/g, '$1<span class="code-value">$2</span>');
}

function highlightSVG(code) {
    return code
        .replace(/(<\/?)([a-zA-Z]+)(\/?>)/g, '$1<span class="code-tag">$2</span>$3')
        .replace(/(\s)([a-zA-Z-]+)(=)/g, '$1<span class="code-attr">$2</span>$3')
        .replace(/(=")([^"]+)(")/g, '$1<span class="code-attr-value">$2</span>$3');
}

function switchTab(tab) {
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    codeContents.forEach(content => {
        content.classList.toggle('active', content.id === `${tab}Tab`);
    });
}

function updatePreview() {
    const gradient = generateGradient();
    
    previewText.textContent = textInput.value || '渐变文字';
    previewText.style.background = gradient;
    previewText.style.webkitBackgroundClip = 'text';
    previewText.style.backgroundClip = 'text';
    previewText.style.webkitTextFillColor = 'transparent';
    previewText.style.fontSize = `${fontSize.value}px`;
    previewText.style.fontFamily = fontFamily.value;
    previewText.style.fontWeight = fontWeight.value;
    
    cssCode.innerHTML = highlightCSS(generateCSS());
    svgCode.innerHTML = highlightSVG(generateSVG());
    fontSizeValue.textContent = `${fontSize.value}px`;
}

function getCodeText(element) {
    return element.textContent || element.innerText;
}

function showToast() {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

function addColorInput() {
    if (colorCount >= 6) {
        alert('最多支持 6 种颜色');
        return;
    }
    
    colorCount++;
    const colorItem = document.createElement('div');
    colorItem.className = 'color-item';
    
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    
    colorItem.innerHTML = `
        <input type="color" id="color${colorCount}" value="${randomColor}">
        <span>颜色 ${colorCount}</span>
        <button type="button" class="remove-color" style="background: #ff6b6b; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;">×</button>
    `;
    
    colorInputs.appendChild(colorItem);
    
    const colorInput = colorItem.querySelector('input[type="color"]');
    colorInput.addEventListener('input', updatePreview);
    
    const removeBtn = colorItem.querySelector('.remove-color');
    removeBtn.addEventListener('click', () => removeColorInput(colorItem));
}

function removeColorInput(item) {
    if (colorCount <= 2) {
        alert('至少需要 2 种颜色');
        return;
    }
    
    item.remove();
    colorCount--;
    
    const colorItems = document.querySelectorAll('.color-item');
    colorItems.forEach((item, index) => {
        const span = item.querySelector('span');
        span.textContent = `颜色 ${index + 1}`;
    });
    
    updatePreview();
}

textInput.addEventListener('input', updatePreview);
gradientType.addEventListener('change', () => {
    toggleGradientOptions();
    updatePreview();
});
gradientDirection.addEventListener('change', updatePreview);
radialShape.addEventListener('change', updatePreview);
fontSize.addEventListener('input', updatePreview);
fontFamily.addEventListener('change', updatePreview);
fontWeight.addEventListener('change', updatePreview);

document.getElementById('color1').addEventListener('input', updatePreview);
document.getElementById('color2').addEventListener('input', updatePreview);

addColorBtn.addEventListener('click', addColorInput);

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

async function copyCode(code) {
    try {
        await navigator.clipboard.writeText(code);
        showToast();
    } catch (err) {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast();
    }
}

copyCssBtn.addEventListener('click', () => copyCode(getCodeText(cssCode)));
copySvgBtn.addEventListener('click', () => copyCode(getCodeText(svgCode)));

updatePreview();