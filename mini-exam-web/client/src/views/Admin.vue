<template>
  <div class="container">
    <div class="page-title">📚 题库管理</div>
    
    <div class="card">
      <div class="form-group">
        <div class="type-buttons" style="margin-bottom: 12px;">
          <button 
            class="type-btn"
            :class="{ active: filterType === '' }"
            @click="filterType = ''"
          >全部</button>
          <button 
            class="type-btn"
            :class="{ active: filterType === 'single' }"
            @click="filterType = 'single'"
          >单选</button>
          <button 
            class="type-btn"
            :class="{ active: filterType === 'multiple' }"
            @click="filterType = 'multiple'"
          >多选</button>
          <button 
            class="type-btn"
            :class="{ active: filterType === 'judge' }"
            @click="filterType = 'judge'"
          >判断</button>
        </div>
        <input 
          v-model="searchKeyword" 
          class="form-input" 
          placeholder="🔍 搜索题目内容..."
        >
      </div>
    </div>

    <div v-if="questions.length === 0" class="empty">
      暂无题目数据
    </div>

    <div v-else>
      <div 
        v-for="q in filteredQuestions" 
        :key="q.id"
        class="list-item"
      >
        <div class="list-item-header">
          <div class="flex items-center gap-2">
            <span :class="['tag', `tag-${q.type}`]">
              {{ getTypeName(q.type) }}
            </span>
            <span class="list-item-meta">ID: {{ q.id }}</span>
          </div>
          <span class="list-item-meta">{{ q.options.length }} 个选项</span>
        </div>
        
        <div class="list-item-content" style="margin-top: 8px;">
          <p style="color: #303133; font-size: 14px; line-height: 1.6; font-weight: 500;">
            {{ q.question }}
          </p>
        </div>
        
        <div class="flex items-center justify-between" style="margin-top: 12px;">
          <div class="list-item-content">
            <span 
              v-for="(opt, idx) in q.options.slice(0, 4)" 
              :key="idx"
              class="list-item-meta"
              style="background: #f5f7fa; padding: 4px 8px; border-radius: 4px;"
            >
              {{ String.fromCharCode(65 + idx) }}.{{ opt.length > 8 ? opt.substring(0, 8) + '...' : opt }}
            </span>
            <span v-if="q.options.length > 4" class="list-item-meta">
              +{{ q.options.length - 4 }}
            </span>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-primary btn-sm" @click="editQuestion(q)">编辑</button>
            <button class="btn btn-danger btn-sm" @click="deleteQuestion(q)">删除</button>
          </div>
        </div>
      </div>
    </div>

    <button class="fab-button" @click="showAddModal = true">
      +
    </button>

    <div v-if="showAddModal || editingQuestion" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h3 class="modal-title">{{ editingQuestion ? '编辑题目' : '新增题目' }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>

        <div class="form-group">
          <label class="form-label">题目类型</label>
          <select v-model="form.type" class="form-select" @change="resetOptions">
            <option value="single">单选题</option>
            <option value="multiple">多选题</option>
            <option value="judge">判断题</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">题目内容</label>
          <textarea v-model="form.question" class="form-textarea" rows="3" placeholder="请输入题目内容"></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">选项</label>
          <div v-if="form.type === 'judge'" class="flex gap-4">
            <label class="flex items-center gap-2">
              <input type="radio" v-model="form.answer" :value="[0]">
              <span>正确</span>
            </label>
            <label class="flex items-center gap-2">
              <input type="radio" v-model="form.answer" :value="[1]">
              <span>错误</span>
            </label>
          </div>
          <div v-else>
            <div v-for="(opt, idx) in form.options" :key="idx" class="option-input-group" style="margin-bottom: 12px;">
              <input 
                type="checkbox" 
                :checked="form.answer.includes(idx)"
                @change="toggleAnswer(idx)"
              >
              <span class="option-letter">{{ String.fromCharCode(65 + idx) }}</span>
              <input 
                v-model="form.options[idx]" 
                class="form-input" 
                :placeholder="`选项 ${String.fromCharCode(65 + idx)}`"
              >
              <button 
                v-if="form.options.length > 2"
                class="btn btn-danger btn-sm" 
                @click="removeOption(idx)"
              >删除</button>
            </div>
            <button 
              v-if="form.options.length < 6"
              class="btn btn-default btn-sm" 
              @click="addOption"
            >+ 添加选项</button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">答案解析</label>
          <textarea v-model="form.explanation" class="form-textarea" rows="2" placeholder="请输入答案解析（可选）"></textarea>
        </div>

        <div v-if="formError" class="alert alert-danger">{{ formError }}</div>

        <div class="flex justify-between" style="margin-top: 24px;">
          <button class="btn btn-default" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveQuestion">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import http from '../utils/http.js'

const questions = ref([])
const filterType = ref('')
const searchKeyword = ref('')
const showAddModal = ref(false)
const editingQuestion = ref(null)
const formError = ref('')

const defaultForm = () => ({
  type: 'single',
  question: '',
  options: ['', '', '', ''],
  answer: [],
  explanation: ''
})

const form = reactive(defaultForm())

const filteredQuestions = computed(() => {
  return questions.value.filter(q => {
    const matchType = !filterType.value || q.type === filterType.value
    const matchKeyword = !searchKeyword.value || 
      q.question.toLowerCase().includes(searchKeyword.value.toLowerCase())
    return matchType && matchKeyword
  })
})

const getTypeName = (type) => {
  const names = { single: '单选题', multiple: '多选题', judge: '判断题' }
  return names[type] || type
}

const loadQuestions = async () => {
  try {
    const res = await http.get('/api/questions')
    if (res.data.success) {
      questions.value = res.data.data
    }
  } catch (err) {
    console.error('加载题目失败', err)
  }
}

const resetOptions = () => {
  if (form.type === 'judge') {
    form.options = ['正确', '错误']
    form.answer = [0]
  } else if (form.options.length < 2) {
    form.options = ['', '', '', '']
  }
}

const addOption = () => {
  if (form.options.length < 6) {
    form.options.push('')
  }
}

const removeOption = (idx) => {
  if (form.options.length > 2) {
    form.options.splice(idx, 1)
    form.answer = form.answer.filter(a => a !== idx)
  }
}

const toggleAnswer = (idx) => {
  if (form.type === 'single') {
    form.answer = [idx]
  } else {
    const pos = form.answer.indexOf(idx)
    if (pos > -1) {
      form.answer.splice(pos, 1)
    } else {
      form.answer.push(idx)
    }
  }
}

const editQuestion = (q) => {
  editingQuestion.value = q
  Object.assign(form, {
    type: q.type,
    question: q.question,
    options: [...q.options],
    answer: [...q.answer],
    explanation: q.explanation || ''
  })
}

const closeModal = () => {
  showAddModal.value = false
  editingQuestion.value = null
  Object.assign(form, defaultForm())
  formError.value = ''
}

const validateForm = () => {
  if (!form.question.trim()) {
    formError.value = '请输入题目内容'
    return false
  }
  
  if (form.type !== 'judge') {
    const validOptions = form.options.filter(o => o.trim())
    if (validOptions.length < 2) {
      formError.value = '请至少填写2个有效选项'
      return false
    }
  }
  
  if (form.answer.length === 0) {
    formError.value = '请选择正确答案'
    return false
  }
  
  formError.value = ''
  return true
}

const saveQuestion = async () => {
  if (!validateForm()) return
  
  const data = {
    type: form.type,
    question: form.question.trim(),
    options: form.type === 'judge' ? ['正确', '错误'] : form.options.filter(o => o.trim()),
    answer: [...form.answer].sort(),
    explanation: form.explanation.trim()
  }
  
  try {
    if (editingQuestion.value) {
      await http.put(`/api/questions/${editingQuestion.value.id}`, data)
    } else {
      await http.post('/api/questions', data)
    }
    await loadQuestions()
    closeModal()
  } catch (err) {
    formError.value = '保存失败，请重试'
    console.error(err)
  }
}

const deleteQuestion = async (q) => {
  if (!confirm(`确定要删除题目"${q.question}"吗？`)) return
  
  try {
    await http.delete(`/api/questions/${q.id}`)
    await loadQuestions()
  } catch (err) {
    console.error('删除失败', err)
  }
}

onMounted(() => {
  loadQuestions()
})
</script>
