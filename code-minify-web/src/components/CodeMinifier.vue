<script setup>
import { ref, computed, watch } from 'vue'
import { format } from 'prettier/standalone'
import pluginBabel from 'prettier/plugins/babel'
import pluginEstree from 'prettier/plugins/estree'
import pluginHtml from 'prettier/plugins/html'
import pluginPostcss from 'prettier/plugins/postcss'
import { minify as terserMinify } from 'terser'

const codeType = ref('js')
const inputCode = ref('')
const outputCode = ref('')
const errorMessage = ref('')
const keepComments = ref(false)
const operation = ref('format')

const exampleCode = {
  js: `function hello(name) {
    // This is a comment
    console.log("Hello, " + name);
    if (name) {
      return true;
    }
    return false;
  }`,
  css: `.container {
    width: 100%;
    padding: 20px;
    background-color: #f0f0f0;
}
.container .title {
    font-size: 24px;
    color: #333;
}`,
  html: `<!DOCTYPE html>
<html>
<head>
    <title>Example</title>
</head>
<body>
    <div class="container">
        <h1>Hello World</h1>
        <p>This is a paragraph</p>
    </div>
</body>
</html>`
}

const loadExample = () => {
  inputCode.value = exampleCode[codeType.value]
  errorMessage.value = ''
}

const processCode = async () => {
  if (!inputCode.value.trim()) {
    outputCode.value = ''
    errorMessage.value = ''
    return
  }

  try {
    errorMessage.value = ''
    let result = ''

    if (operation.value === 'format') {
      result = await formatCode(inputCode.value, codeType.value)
    } else {
      result = await minifyCode(inputCode.value, codeType.value)
    }

    outputCode.value = result
  } catch (error) {
    errorMessage.value = error.message || '处理失败，请检查语法'
    outputCode.value = ''
  }
}

const removeComments = (code, type) => {
  if (!keepComments.value) {
    if (type === 'js') {
      return code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
    } else if (type === 'html') {
      return code.replace(/<!--[\s\S]*?-->/g, '')
    } else if (type === 'css') {
      return code.replace(/\/\*[\s\S]*?\*\//g, '')
    }
  }
  return code
}

const formatCode = async (code, type) => {
  const parser = type === 'js' ? 'babel' : type === 'html' ? 'html' : 'css'
  let plugins = []
  
  if (type === 'js') {
    plugins = [pluginBabel, pluginEstree]
  } else if (type === 'html') {
    plugins = [pluginHtml, pluginEstree]
  } else {
    plugins = [pluginPostcss]
  }
  
  let formatted = await format(code, {
    parser,
    plugins,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    useTabs: false
  })
  
  return removeComments(formatted, type)
}

const minifyHtml = (code) => {
  let result = code
  if (!keepComments.value) {
    result = result.replace(/<!--[\s\S]*?-->/g, '')
  }
  result = result.replace(/\s+/g, ' ')
  result = result.replace(/>\s+</g, '><')
  return result.trim()
}

const minifyCss = (code) => {
  let result = code
  if (!keepComments.value) {
    result = result.replace(/\/\*[\s\S]*?\*\//g, '')
  }
  result = result.replace(/\s+/g, ' ')
  result = result.replace(/\s*([{}:;,])\s*/g, '$1')
  result = result.replace(/;}/g, '}')
  return result.trim()
}

const minifyCode = async (code, type) => {
  if (type === 'js') {
    const result = await terserMinify(code, {
      format: {
        comments: keepComments.value ? 'some' : false
      },
      compress: {
        drop_console: !keepComments.value
      },
      mangle: true
    })
    return result.code
  } else if (type === 'html') {
    return minifyHtml(code)
  } else if (type === 'css') {
    return minifyCss(code)
  }
  return code
}

const copyOutput = async () => {
  if (outputCode.value) {
    await navigator.clipboard.writeText(outputCode.value)
  }
}

const clearAll = () => {
  inputCode.value = ''
  outputCode.value = ''
  errorMessage.value = ''
}

watch(codeType, () => {
  inputCode.value = ''
  outputCode.value = ''
  errorMessage.value = ''
})

watch([inputCode, keepComments, operation], processCode, { immediate: false })

const inputSize = computed(() => {
  return new Blob([inputCode.value]).size
})

const outputSize = computed(() => {
  return new Blob([outputCode.value]).size
})

const savedSize = computed(() => {
  if (inputSize.value === 0) return 0
  return ((inputSize.value - outputSize.value) / inputSize.value * 100).toFixed(1)
})
</script>

<template>
  <div class="minifier-container">
    <header class="header">
      <h1>代码压缩美化工具</h1>
      <p>支持 JS、CSS、HTML 格式化与混淆压缩</p>
    </header>

    <div class="controls">
      <div class="control-group">
        <label>代码类型</label>
        <div class="btn-group">
          <button 
            :class="{ active: codeType === 'js' }" 
            @click="codeType = 'js'"
          >
            JavaScript
          </button>
          <button 
            :class="{ active: codeType === 'css' }" 
            @click="codeType = 'css'"
          >
            CSS
          </button>
          <button 
            :class="{ active: codeType === 'html' }" 
            @click="codeType = 'html'"
          >
            HTML
          </button>
        </div>
      </div>

      <div class="control-group">
        <label>操作类型</label>
        <div class="btn-group">
          <button 
            :class="{ active: operation === 'format' }" 
            @click="operation = 'format'"
          >
            格式化
          </button>
          <button 
            :class="{ active: operation === 'minify' }" 
            @click="operation = 'minify'"
          >
            压缩
          </button>
        </div>
      </div>

      <div class="control-group">
        <label class="checkbox-label">
          <input type="checkbox" v-model="keepComments" />
          保留注释
        </label>
      </div>

      <div class="action-buttons">
        <button class="btn-secondary" @click="loadExample">加载示例</button>
        <button class="btn-secondary" @click="clearAll">清空</button>
        <button class="btn-primary" @click="copyOutput" :disabled="!outputCode">复制结果</button>
      </div>
    </div>

    <div class="code-area">
      <div class="code-panel">
        <div class="panel-header">
          <span>输入</span>
          <span class="size">{{ inputSize }} bytes</span>
        </div>
        <textarea 
          v-model="inputCode" 
          :placeholder="'输入 ' + codeType.toUpperCase() + ' 代码...'"
          spellcheck="false"
        ></textarea>
      </div>

      <div class="code-panel">
        <div class="panel-header">
          <span>输出</span>
          <span class="size">
            {{ outputSize }} bytes
            <span v-if="operation === 'minify' && savedSize > 0" class="saved">
              (节省 {{ savedSize }}%)
            </span>
          </span>
        </div>
        <textarea 
          v-model="outputCode" 
          readonly
          placeholder="处理后的代码将显示在这里..."
          spellcheck="false"
        ></textarea>
      </div>
    </div>

    <div v-if="errorMessage" class="error-message">
      <strong>错误：</strong>{{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.minifier-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 32px;
  color: var(--text-h);
  margin-bottom: 10px;
}

.header p {
  color: var(--text);
  font-size: 16px;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px;
  padding: 20px;
  background: var(--code-bg);
  border-radius: 12px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-h);
}

.btn-group {
  display: flex;
  gap: 0;
}

.btn-group button {
  padding: 10px 16px;
  border: 2px solid var(--border);
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.btn-group button:first-child {
  border-radius: 8px 0 0 8px;
}

.btn-group button:last-child {
  border-radius: 0 8px 8px 0;
}

.btn-group button:not(:last-child) {
  border-right: none;
}

.btn-group button:hover {
  background: var(--accent-bg);
}

.btn-group button.active {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--accent);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--border);
  color: var(--text-h);
}

.btn-secondary:hover {
  background: var(--accent-bg);
}

.code-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.code-panel {
  display: flex;
  flex-direction: column;
  background: var(--code-bg);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--border);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  font-weight: 500;
  color: var(--text-h);
}

.size {
  font-size: 13px;
  color: var(--text);
  font-family: var(--mono);
}

.saved {
  color: #10b981;
  margin-left: 8px;
}

textarea {
  width: 100%;
  min-height: 400px;
  padding: 16px;
  border: none;
  background: transparent;
  font-family: var(--mono);
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-h);
  resize: vertical;
  outline: none;
}

textarea::placeholder {
  color: var(--text);
  opacity: 0.6;
}

textarea[readonly] {
  background: rgba(0, 0, 0, 0.02);
}

.error-message {
  margin-top: 20px;
  padding: 16px;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
}

@media (prefers-color-scheme: dark) {
  textarea[readonly] {
    background: rgba(255, 255, 255, 0.02);
  }
  
  .error-message {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.3);
    color: #fca5a5;
  }
}

@media (max-width: 768px) {
  .code-area {
    grid-template-columns: 1fr;
  }
  
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-buttons {
    justify-content: center;
  }
}
</style>
