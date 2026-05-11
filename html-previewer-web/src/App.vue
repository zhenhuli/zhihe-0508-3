<template>
  <div class="app-container">
    <header class="header">
      <div class="header-title">
        <h1>HTML 在线预览工具</h1>
      </div>
      <div class="header-actions">
        <select v-model="selectedExample" @change="loadExample" class="example-select">
          <option value="">选择示例代码</option>
          <option v-for="(example, key) in examples" :key="key" :value="key">
            {{ example.name }}
          </option>
        </select>
        <button @click="formatCode" class="action-btn format-btn">格式化代码</button>
        <button @click="clearCode" class="action-btn clear-btn">一键清空</button>
      </div>
    </header>

    <main class="main-content">
      <div class="editor-panel">
        <div class="editor-header">
          <span class="editor-label">HTML</span>
        </div>
        <div class="editor-wrapper">
          <textarea
            v-model="htmlCode"
            @input="updatePreview"
            class="code-editor"
            spellcheck="false"
            placeholder="在此输入 HTML 代码..."
          ></textarea>
        </div>
        
        <div class="editor-header">
          <span class="editor-label">CSS</span>
        </div>
        <div class="editor-wrapper">
          <textarea
            v-model="cssCode"
            @input="updatePreview"
            class="code-editor css-editor"
            spellcheck="false"
            placeholder="在此输入 CSS 代码..."
          ></textarea>
        </div>

        <div class="editor-header">
          <span class="editor-label">JavaScript</span>
        </div>
        <div class="editor-wrapper">
          <textarea
            v-model="jsCode"
            @input="updatePreview"
            class="code-editor js-editor"
            spellcheck="false"
            placeholder="在此输入 JavaScript 代码..."
          ></textarea>
        </div>
      </div>

      <div class="preview-panel">
        <div class="editor-header">
          <span class="editor-label">预览效果</span>
        </div>
        <div class="preview-wrapper">
          <iframe
            ref="previewFrame"
            class="preview-iframe"
            sandbox="allow-scripts allow-same-origin"
          ></iframe>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Prettier from 'prettier/standalone'
import * as htmlParser from 'prettier/plugins/html'
import * as cssParser from 'prettier/plugins/postcss'
import * as babelParser from 'prettier/plugins/babel'

const htmlCode = ref('')
const cssCode = ref('')
const jsCode = ref('')
const selectedExample = ref('')
const previewFrame = ref(null)

const examples = {
  basic: {
    name: '基础网页',
    html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>基础网页</title>\n</head>\n<body>\n  <div class="container">\n    <h1>欢迎使用 HTML 预览工具</h1>\n    <p>这是一个简单的示例网页。</p>\n    <button class="btn">点击我</button>\n    <p id="counter">点击次数: 0</p>\n  </div>\n</body>\n</html>',
    css: 'body {\n  font-family: Arial, sans-serif;\n  background-color: #f0f0f0;\n  margin: 0;\n  padding: 20px;\n}\n\n.container {\n  max-width: 800px;\n  margin: 0 auto;\n  background-color: white;\n  padding: 30px;\n  border-radius: 8px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n}\n\nh1 {\n  color: #333;\n  margin-bottom: 20px;\n}\n\np {\n  color: #666;\n  line-height: 1.6;\n}\n\n.btn {\n  background-color: #4CAF50;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 4px;\n  cursor: pointer;\n  font-size: 16px;\n}\n\n.btn:hover {\n  background-color: #45a049;\n}',
    js: 'let count = 0;\n\ndocument.querySelector(\'.btn\').addEventListener(\'click\', function() {\n  count++;\n  document.getElementById(\'counter\').textContent = \'点击次数: \' + count;\n  console.log(\'按钮被点击了! 计数:\', count);\n});'
  },
  card: {
    name: '卡片布局',
    html: '<div class="cards-container">\n  <div class="card">\n    <div class="card-header">产品卡片</div>\n    <div class="card-body">\n      <h3>产品名称</h3>\n      <p>这是一款优秀的产品描述。</p>\n      <div class="price">¥99.00</div>\n      <button>立即购买</button>\n    </div>\n  </div>\n  \n  <div class="card featured">\n    <div class="card-badge">推荐</div>\n    <div class="card-header">精选产品</div>\n    <div class="card-body">\n      <h3>高级产品</h3>\n      <p>更多功能，更好体验。</p>\n      <div class="price">¥199.00</div>\n      <button>立即购买</button>\n    </div>\n  </div>\n  \n  <div class="card">\n    <div class="card-header">基础产品</div>\n    <div class="card-body">\n      <h3>入门产品</h3>\n      <p>适合初学者使用。</p>\n      <div class="price">¥49.00</div>\n      <button>立即购买</button>\n    </div>\n  </div>\n  <div id="toast" class="toast"></div>\n</div>',
    css: '.cards-container {\n  display: flex;\n  gap: 20px;\n  padding: 40px;\n  justify-content: center;\n  flex-wrap: wrap;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  min-height: 100vh;\n  font-family: \'Segoe UI\', sans-serif;\n}\n\n.card {\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);\n  overflow: hidden;\n  width: 280px;\n  transition: transform 0.3s ease;\n  position: relative;\n}\n\n.card:hover {\n  transform: translateY(-10px);\n}\n\n.card-badge {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  background: #ff6b6b;\n  color: white;\n  padding: 4px 12px;\n  border-radius: 20px;\n  font-size: 12px;\n  font-weight: bold;\n}\n\n.card-header {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  padding: 20px;\n  text-align: center;\n  font-size: 18px;\n  font-weight: 600;\n}\n\n.card.featured .card-header {\n  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);\n}\n\n.card-body {\n  padding: 25px;\n}\n\n.card-body h3 {\n  margin: 0 0 10px 0;\n  color: #333;\n}\n\n.card-body p {\n  color: #666;\n  margin: 0 0 15px 0;\n  line-height: 1.5;\n}\n\n.price {\n  font-size: 28px;\n  font-weight: bold;\n  color: #667eea;\n  margin-bottom: 20px;\n}\n\nbutton {\n  width: 100%;\n  padding: 12px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  border: none;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 16px;\n  font-weight: 600;\n  transition: opacity 0.3s;\n}\n\nbutton:hover {\n  opacity: 0.9;\n}\n\n.toast {\n  position: fixed;\n  bottom: 20px;\n  left: 50%;\n  transform: translateX(-50%) translateY(100px);\n  background: #333;\n  color: white;\n  padding: 12px 30px;\n  border-radius: 8px;\n  font-size: 14px;\n  opacity: 0;\n  transition: all 0.3s ease;\n  z-index: 1000;\n}\n\n.toast.show {\n  transform: translateX(-50%) translateY(0);\n  opacity: 1;\n}',
    js: 'const buttons = document.querySelectorAll(\'button\');\nconst toast = document.getElementById(\'toast\');\n\nfunction showToast(message) {\n  toast.textContent = message;\n  toast.classList.add(\'show\');\n  setTimeout(function() {\n    toast.classList.remove(\'show\');\n  }, 2000);\n}\n\nbuttons.forEach(function(btn, index) {\n  btn.addEventListener(\'click\', function() {\n    const productName = document.querySelectorAll(\'.card-body h3\')[index].textContent;\n    showToast(\'已添加 \' + productName + \' 到购物车!\');\n  });\n});'
  },
  nav: {
    name: '导航栏示例',
    html: '<nav class="navbar">\n  <div class="nav-container">\n    <div class="logo">BrandName</div>\n    <ul class="nav-menu">\n      <li><a href="#" class="active" data-section="home">首页</a></li>\n      <li><a href="#" data-section="products">产品</a></li>\n      <li><a href="#" data-section="services">服务</a></li>\n      <li><a href="#" data-section="about">关于我们</a></li>\n      <li><a href="#" data-section="contact">联系我们</a></li>\n    </ul>\n    <button class="nav-btn">登录</button>\n  </div>\n</nav>\n\n<section class="hero">\n  <div class="hero-content">\n    <h1>欢迎来到 BrandName</h1>\n    <p>我们提供最优质的服务和产品</p>\n    <button class="hero-btn">开始探索</button>\n  </div>\n</section>\n\n<section class="features">\n  <div class="feature">\n    <h3>快速响应</h3>\n    <p>提供7x24小时快速响应服务</p>\n  </div>\n  <div class="feature">\n    <h3>专业团队</h3>\n    <p>拥有多年行业经验的专家团队</p>\n  </div>\n  <div class="feature">\n    <h3>优质服务</h3>\n    <p>客户满意度高达98%</p>\n  </div>\n</section>',
    css: '* {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nbody {\n  font-family: \'Arial\', sans-serif;\n}\n\n.navbar {\n  background: #1a1a2e;\n  padding: 0 20px;\n  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n  position: sticky;\n  top: 0;\n  z-index: 100;\n}\n\n.nav-container {\n  max-width: 1200px;\n  margin: 0 auto;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 70px;\n}\n\n.logo {\n  color: #fff;\n  font-size: 24px;\n  font-weight: bold;\n  letter-spacing: 1px;\n}\n\n.nav-menu {\n  display: flex;\n  list-style: none;\n  gap: 30px;\n}\n\n.nav-menu a {\n  color: #ccc;\n  text-decoration: none;\n  font-size: 16px;\n  transition: color 0.3s;\n  padding: 8px 0;\n  border-bottom: 2px solid transparent;\n}\n\n.nav-menu a:hover,\n.nav-menu a.active {\n  color: #4CAF50;\n  border-bottom-color: #4CAF50;\n}\n\n.nav-btn {\n  background: #4CAF50;\n  color: white;\n  border: none;\n  padding: 10px 25px;\n  border-radius: 25px;\n  cursor: pointer;\n  font-size: 16px;\n  transition: background 0.3s;\n}\n\n.nav-btn:hover {\n  background: #45a049;\n}\n\n.hero {\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  padding: 100px 20px;\n  text-align: center;\n}\n\n.hero-content h1 {\n  color: white;\n  font-size: 48px;\n  margin-bottom: 20px;\n}\n\n.hero-content p {\n  color: rgba(255, 255, 255, 0.9);\n  font-size: 20px;\n  margin-bottom: 30px;\n}\n\n.hero-btn {\n  background: white;\n  color: #667eea;\n  border: none;\n  padding: 15px 40px;\n  border-radius: 30px;\n  cursor: pointer;\n  font-size: 18px;\n  font-weight: bold;\n  transition: transform 0.3s;\n}\n\n.hero-btn:hover {\n  transform: scale(1.05);\n}\n\n.features {\n  display: flex;\n  justify-content: center;\n  gap: 40px;\n  padding: 60px 20px;\n  background: #f5f5f5;\n}\n\n.feature {\n  text-align: center;\n  max-width: 300px;\n  padding: 30px;\n  background: white;\n  border-radius: 12px;\n  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);\n  transition: transform 0.3s;\n}\n\n.feature:hover {\n  transform: translateY(-5px);\n}\n\n.feature h3 {\n  color: #333;\n  margin-bottom: 10px;\n}\n\n.feature p {\n  color: #666;\n  line-height: 1.6;\n}',
    js: 'const navLinks = document.querySelectorAll(\'.nav-menu a\');\nconst heroBtn = document.querySelector(\'.hero-btn\');\n\nnavLinks.forEach(function(link) {\n  link.addEventListener(\'click\', function(e) {\n    e.preventDefault();\n    \n    navLinks.forEach(function(l) {\n      l.classList.remove(\'active\');\n    });\n    this.classList.add(\'active\');\n    \n    const section = this.getAttribute(\'data-section\');\n    console.log(\'导航到:\', section);\n    \n    alert(\'已切换到: \' + this.textContent);\n  });\n});\n\ndocument.querySelector(\'.nav-btn\').addEventListener(\'click\', function() {\n  alert(\'登录功能 - 演示模式\');\n});\n\nheroBtn.addEventListener(\'click\', function() {\n  const featuresSection = document.querySelector(\'.features\');\n  featuresSection.scrollIntoView({ behavior: \'smooth\' });\n});'
  },
  todo: {
    name: 'Todo 列表',
    html: '<div class="todo-app">\n  <h1>📝 Todo 列表</h1>\n  <div class="input-group">\n    <input type="text" id="todoInput" placeholder="添加新任务...">\n    <button id="addBtn">添加</button>\n  </div>\n  <ul id="todoList" class="todo-list"></ul>\n  <div class="stats">\n    <span id="taskCount">已完成: 0 / 0</span>\n    <button id="clearBtn" class="clear-all">清除已完成</button>\n  </div>\n</div>',
    css: 'body {\n  font-family: \'Segoe UI\', Arial, sans-serif;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  min-height: 100vh;\n  display: flex;\n  justify-content: center;\n  align-items: flex-start;\n  padding: 40px 20px;\n}\n\n.todo-app {\n  background: white;\n  border-radius: 16px;\n  padding: 30px;\n  width: 100%;\n  max-width: 500px;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);\n}\n\n.todo-app h1 {\n  text-align: center;\n  color: #333;\n  margin-bottom: 25px;\n}\n\n.input-group {\n  display: flex;\n  gap: 10px;\n  margin-bottom: 25px;\n}\n\n.input-group input {\n  flex: 1;\n  padding: 12px 16px;\n  border: 2px solid #e0e0e0;\n  border-radius: 8px;\n  font-size: 16px;\n  outline: none;\n  transition: border-color 0.3s;\n}\n\n.input-group input:focus {\n  border-color: #667eea;\n}\n\n.input-group button {\n  padding: 12px 24px;\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  border: none;\n  border-radius: 8px;\n  cursor: pointer;\n  font-size: 16px;\n  transition: transform 0.2s;\n}\n\n.input-group button:hover {\n  transform: scale(1.02);\n}\n\n.todo-list {\n  list-style: none;\n  padding: 0;\n  margin: 0 0 20px 0;\n}\n\n.todo-list li {\n  display: flex;\n  align-items: center;\n  padding: 15px;\n  background: #f8f9fa;\n  border-radius: 8px;\n  margin-bottom: 10px;\n  transition: background 0.3s;\n}\n\n.todo-list li:hover {\n  background: #f0f0f0;\n}\n\n.todo-list li.completed .text {\n  text-decoration: line-through;\n  color: #999;\n}\n\n.todo-list input[type="checkbox"] {\n  width: 20px;\n  height: 20px;\n  margin-right: 15px;\n  cursor: pointer;\n}\n\n.todo-list .text {\n  flex: 1;\n  font-size: 16px;\n}\n\n.todo-list .delete-btn {\n  background: #ff4757;\n  color: white;\n  border: none;\n  padding: 8px 12px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 14px;\n}\n\n.todo-list .delete-btn:hover {\n  background: #ff3838;\n}\n\n.stats {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding-top: 15px;\n  border-top: 1px solid #e0e0e0;\n}\n\n.stats span {\n  color: #666;\n  font-size: 14px;\n}\n\n.clear-all {\n  background: #e74c3c;\n  color: white;\n  border: none;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n  font-size: 14px;\n}\n\n.clear-all:hover {\n  background: #c0392b;\n}',
    js: 'const todoInput = document.getElementById(\'todoInput\');\nconst addBtn = document.getElementById(\'addBtn\');\nconst todoList = document.getElementById(\'todoList\');\nconst taskCount = document.getElementById(\'taskCount\');\nconst clearBtn = document.getElementById(\'clearBtn\');\n\nlet todos = [];\n\nfunction addTodo(text) {\n  if (text.trim()) {\n    todos.push({ id: Date.now(), text: text.trim(), completed: false });\n    renderTodos();\n    todoInput.value = \'\';\n  }\n}\n\nfunction toggleTodo(id) {\n  const todo = todos.find(function(t) {\n    return t.id === id;\n  });\n  if (todo) {\n    todo.completed = !todo.completed;\n    renderTodos();\n  }\n}\n\nfunction deleteTodo(id) {\n  todos = todos.filter(function(t) {\n    return t.id !== id;\n  });\n  renderTodos();\n}\n\nfunction clearCompleted() {\n  todos = todos.filter(function(t) {\n    return !t.completed;\n  });\n  renderTodos();\n}\n\nfunction updateStats() {\n  const completed = todos.filter(function(t) {\n    return t.completed;\n  }).length;\n  taskCount.textContent = \'已完成: \' + completed + \' / \' + todos.length;\n}\n\nfunction renderTodos() {\n  todoList.innerHTML = \'\';\n  todos.forEach(function(todo) {\n    const li = document.createElement(\'li\');\n    li.className = todo.completed ? \'completed\' : \'\';\n    \n    const checkboxHtml = \'<input type="checkbox" \' + (todo.completed ? \'checked\' : \'\') + \'>\';\n    const textHtml = \'<span class="text">\' + todo.text + \'</span>\';\n    const deleteHtml = \'<button class="delete-btn">删除</button>\';\n    \n    li.innerHTML = checkboxHtml + textHtml + deleteHtml;\n    \n    const checkbox = li.querySelector(\'input[type="checkbox"]\');\n    checkbox.addEventListener(\'change\', function() {\n      toggleTodo(todo.id);\n    });\n    \n    li.querySelector(\'.delete-btn\').addEventListener(\'click\', function() {\n      deleteTodo(todo.id);\n    });\n    \n    todoList.appendChild(li);\n  });\n  updateStats();\n}\n\naddBtn.addEventListener(\'click\', function() {\n  addTodo(todoInput.value);\n});\n\ntodoInput.addEventListener(\'keypress\', function(e) {\n  if (e.key === \'Enter\') addTodo(todoInput.value);\n});\n\nclearBtn.addEventListener(\'click\', clearCompleted);\n\naddTodo(\'学习 Vue.js\');\naddTodo(\'完成项目报告\');\naddTodo(\'阅读技术文档\');'
  }
}

const updatePreview = () => {
  if (!previewFrame.value) return
  
  const doc = previewFrame.value.contentDocument || previewFrame.value.contentWindow.document
  doc.open()
  doc.write(
    '<!DOCTYPE html>\n' +
    '<html>\n' +
    '<head>\n' +
    '  <meta charset="UTF-8">\n' +
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
    '  <style>\n' +
    '    body { margin: 0; padding: 0; min-height: 100vh; background: white; }\n' +
    cssCode.value +
    '\n  </style>\n' +
    '</head>\n' +
    '<body>\n' +
    htmlCode.value +
    '\n  <script>\n' +
    '    try {\n' +
    jsCode.value +
    '\n    } catch (e) {\n' +
    '      console.error(\'JavaScript 执行错误:\', e);\n' +
    '    }\n' +
    '  <\/script>\n' +
    '</body>\n' +
    '</html>'
  )
  doc.close()
}

const loadExample = () => {
  if (selectedExample.value && examples[selectedExample.value]) {
    htmlCode.value = examples[selectedExample.value].html
    cssCode.value = examples[selectedExample.value].css
    jsCode.value = examples[selectedExample.value].js || ''
    updatePreview()
    selectedExample.value = ''
  }
}

const clearCode = () => {
  htmlCode.value = ''
  cssCode.value = ''
  jsCode.value = ''
  updatePreview()
}

const formatCode = async () => {
  try {
    const formattedHtml = await Prettier.format(htmlCode.value, {
      parser: 'html',
      plugins: [htmlParser],
      tabWidth: 2,
      printWidth: 100
    })
    htmlCode.value = formattedHtml.trim()
  } catch (e) {
    console.error('HTML 格式化失败:', e)
  }

  try {
    const formattedCss = await Prettier.format(cssCode.value, {
      parser: 'css',
      plugins: [cssParser],
      tabWidth: 2,
      printWidth: 100
    })
    cssCode.value = formattedCss.trim()
  } catch (e) {
    console.error('CSS 格式化失败:', e)
  }

  try {
    if (jsCode.value.trim()) {
      const formattedJs = await Prettier.format(jsCode.value, {
        parser: 'babel',
        plugins: [babelParser],
        tabWidth: 2,
        printWidth: 100,
        semi: true,
        singleQuote: true
      })
      jsCode.value = formattedJs.trim()
    }
  } catch (e) {
    console.error('JavaScript 格式化失败:', e)
  }

  updatePreview()
}

onMounted(() => {
  updatePreview()
})
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  background-color: #1a1a2e;
  color: white;
  height: 60px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}

.header-title h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.example-select {
  padding: 8px 16px;
  border: 1px solid #444;
  border-radius: 6px;
  background-color: #2d2d44;
  color: white;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.example-select:hover {
  border-color: #666;
}

.example-select:focus {
  border-color: #4CAF50;
}

.action-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.format-btn {
  background-color: #4CAF50;
  color: white;
}

.format-btn:hover {
  background-color: #45a049;
}

.clear-btn {
  background-color: #f44336;
  color: white;
}

.clear-btn:hover {
  background-color: #d32f2f;
}

.main-content {
  flex: 1;
  display: flex;
  overflow: auto;
  padding: 15px;
  gap: 15px;
}

.editor-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.preview-panel {
  width: 50%;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.editor-header {
  padding: 12px 20px;
  background-color: #fafafa;
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;
}

.editor-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.editor-wrapper {
  flex: 1;
  min-height: 180px;
  display: flex;
}

.code-editor {
  width: 100%;
  min-height: 180px;
  padding: 16px;
  font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 14px;
  line-height: 1.6;
  background-color: #1e1e1e;
  color: #d4d4d4;
  border: none;
  outline: none;
  resize: vertical;
  box-sizing: border-box;
  overflow: auto;
}

.code-editor::placeholder {
  color: #6a6a6a;
}

.css-editor,
.js-editor {
  border-top: 1px solid #333;
}

.preview-wrapper {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: white;
}

@media (max-width: 900px) {
  .main-content {
    flex-direction: column;
  }
  
  .editor-panel,
  .preview-panel {
    width: 100%;
    height: auto;
  }
  
  .header {
    padding: 0 15px;
  }
  
  .header-title h1 {
    font-size: 16px;
  }
  
  .example-select,
  .action-btn {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>
