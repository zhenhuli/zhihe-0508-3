const state = {
  textContent: 'Shadow Text',
  fontSize: 48,
  textColor: '#333333',
  shadowX: 5,
  shadowY: 5,
  shadowBlur: 10,
  shadowColor: '#000000',
  shadowOpacity: 50,
  fontWeight: 'normal',
  fontStyle: 'normal',
  letterSpacing: 0,
  background: 'white',
  customBgColor: '#ffffff'
};

const presets = {
  classic: {
    shadowX: 2,
    shadowY: 2,
    shadowBlur: 4,
    shadowColor: '#000000',
    shadowOpacity: 30
  },
  neon: {
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 20,
    shadowColor: '#00ffff',
    shadowOpacity: 100
  },
  soft: {
    shadowX: 3,
    shadowY: 3,
    shadowBlur: 15,
    shadowColor: '#666666',
    shadowOpacity: 40
  },
  hard: {
    shadowX: 4,
    shadowY: 4,
    shadowBlur: 0,
    shadowColor: '#333333',
    shadowOpacity: 80
  },
  glow: {
    shadowX: 0,
    shadowY: 0,
    shadowBlur: 25,
    shadowColor: '#ff6b6b',
    shadowOpacity: 100
  },
  '3d': {
    shadowX: 1,
    shadowY: 3,
    shadowBlur: 0,
    shadowColor: '#999999',
    shadowOpacity: 100
  }
};

const elements = {
  textContent: document.getElementById('textContent'),
  fontSize: document.getElementById('fontSize'),
  textColor: document.getElementById('textColor'),
  shadowX: document.getElementById('shadowX'),
  shadowY: document.getElementById('shadowY'),
  shadowBlur: document.getElementById('shadowBlur'),
  shadowColor: document.getElementById('shadowColor'),
  shadowOpacity: document.getElementById('shadowOpacity'),
  fontWeight: document.getElementById('fontWeight'),
  fontStyle: document.getElementById('fontStyle'),
  letterSpacing: document.getElementById('letterSpacing'),
  fontSizeValue: document.getElementById('fontSizeValue'),
  shadowXValue: document.getElementById('shadowXValue'),
  shadowYValue: document.getElementById('shadowYValue'),
  shadowBlurValue: document.getElementById('shadowBlurValue'),
  shadowOpacityValue: document.getElementById('shadowOpacityValue'),
  letterSpacingValue: document.getElementById('letterSpacingValue'),
  previewText: document.getElementById('previewText'),
  cssCode: document.getElementById('cssCode'),
  copyBtn: document.getElementById('copyBtn'),
  previewArea: document.querySelector('.preview-area'),
  presetButtons: document.querySelectorAll('.preset-btn'),
  bgButtons: document.querySelectorAll('.bg-btn'),
  customBgRow: document.getElementById('customBgRow'),
  customBgColor: document.getElementById('customBgColor')
};

function hexToRgba(hex, opacity) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = opacity / 100;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function updatePreview() {
  const {
    textContent,
    fontSize,
    textColor,
    shadowX,
    shadowY,
    shadowBlur,
    shadowColor,
    shadowOpacity,
    fontWeight,
    fontStyle,
    letterSpacing
  } = state;

  const shadowColorRgba = hexToRgba(shadowColor, shadowOpacity);

  elements.previewText.textContent = textContent;
  elements.previewText.style.fontSize = `${fontSize}px`;
  elements.previewText.style.color = textColor;
  elements.previewText.style.textShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColorRgba}`;
  elements.previewText.style.fontWeight = fontWeight;
  elements.previewText.style.fontStyle = fontStyle;
  elements.previewText.style.letterSpacing = `${letterSpacing}px`;

  updateCssCode();
}

function updateCssCode() {
  const {
    fontSize,
    textColor,
    shadowX,
    shadowY,
    shadowBlur,
    shadowColor,
    shadowOpacity,
    fontWeight,
    fontStyle,
    letterSpacing
  } = state;

  const shadowColorRgba = hexToRgba(shadowColor, shadowOpacity);

  const css = `.text-shadow {
  font-size: ${fontSize}px;
  color: ${textColor};
  text-shadow: ${shadowX}px ${shadowY}px ${shadowBlur}px ${shadowColorRgba};
  font-weight: ${fontWeight};
  font-style: ${fontStyle};
  letter-spacing: ${letterSpacing}px;
}`;

  elements.cssCode.textContent = css;
}

function updateValueDisplays() {
  elements.fontSizeValue.textContent = `${state.fontSize}px`;
  elements.shadowXValue.textContent = `${state.shadowX}px`;
  elements.shadowYValue.textContent = `${state.shadowY}px`;
  elements.shadowBlurValue.textContent = `${state.shadowBlur}px`;
  elements.shadowOpacityValue.textContent = `${state.shadowOpacity}%`;
  elements.letterSpacingValue.textContent = `${state.letterSpacing}px`;
}

function applyPreset(presetName) {
  const preset = presets[presetName];
  if (preset) {
    Object.assign(state, preset);
    
    elements.shadowX.value = preset.shadowX;
    elements.shadowY.value = preset.shadowY;
    elements.shadowBlur.value = preset.shadowBlur;
    elements.shadowColor.value = preset.shadowColor;
    elements.shadowOpacity.value = preset.shadowOpacity;
    
    updateValueDisplays();
    updatePreview();
  }
}

function changeBackground(bg) {
  state.background = bg;
  
  if (bg === 'custom') {
    elements.customBgRow.style.display = 'flex';
    elements.previewArea.className = 'preview-area bg-custom';
    elements.previewArea.style.background = state.customBgColor;
  } else {
    elements.customBgRow.style.display = 'none';
    elements.previewArea.className = 'preview-area bg-' + bg;
    elements.previewArea.style.background = '';
  }
  
  elements.bgButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.bg === bg) {
      btn.classList.add('active');
    }
  });
}

function updateCustomBgColor(color) {
  state.customBgColor = color;
  elements.previewArea.style.background = color;
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(elements.cssCode.textContent);
    elements.copyBtn.classList.add('copied');
    elements.copyBtn.textContent = '✓ 已复制';
    setTimeout(() => {
      elements.copyBtn.classList.remove('copied');
      elements.copyBtn.textContent = '📋 复制代码';
    }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
  }
}

function setupEventListeners() {
  elements.textContent.addEventListener('input', (e) => {
    state.textContent = e.target.value;
    updatePreview();
  });

  elements.fontSize.addEventListener('input', (e) => {
    state.fontSize = parseInt(e.target.value);
    updateValueDisplays();
    updatePreview();
  });

  elements.textColor.addEventListener('input', (e) => {
    state.textColor = e.target.value;
    updatePreview();
  });

  elements.shadowX.addEventListener('input', (e) => {
    state.shadowX = parseInt(e.target.value);
    updateValueDisplays();
    updatePreview();
  });

  elements.shadowY.addEventListener('input', (e) => {
    state.shadowY = parseInt(e.target.value);
    updateValueDisplays();
    updatePreview();
  });

  elements.shadowBlur.addEventListener('input', (e) => {
    state.shadowBlur = parseInt(e.target.value);
    updateValueDisplays();
    updatePreview();
  });

  elements.shadowColor.addEventListener('input', (e) => {
    state.shadowColor = e.target.value;
    updatePreview();
  });

  elements.shadowOpacity.addEventListener('input', (e) => {
    state.shadowOpacity = parseInt(e.target.value);
    updateValueDisplays();
    updatePreview();
  });

  elements.fontWeight.addEventListener('change', (e) => {
    state.fontWeight = e.target.value;
    updatePreview();
  });

  elements.fontStyle.addEventListener('change', (e) => {
    state.fontStyle = e.target.value;
    updatePreview();
  });

  elements.letterSpacing.addEventListener('input', (e) => {
    state.letterSpacing = parseInt(e.target.value);
    updateValueDisplays();
    updatePreview();
  });

  elements.presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyPreset(btn.dataset.preset);
    });
  });

  elements.bgButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      changeBackground(btn.dataset.bg);
    });
  });

  elements.customBgColor.addEventListener('input', (e) => {
    updateCustomBgColor(e.target.value);
  });

  elements.copyBtn.addEventListener('click', copyToClipboard);
}

function init() {
  setupEventListeners();
  updateValueDisplays();
  updatePreview();
}

document.addEventListener('DOMContentLoaded', init);
