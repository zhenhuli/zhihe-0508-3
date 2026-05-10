<template>
  <div class="container">
    <div class="page-title">📝 迷你自测</div>
    
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ questionCount }}</div>
        <div class="stat-label">题库总量</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ examCount }}</div>
        <div class="stat-label">答题次数</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ avgAccuracy }}%</div>
        <div class="stat-label">平均正确率</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ wrongCount }}</div>
        <div class="stat-label">错题数量</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">⚡ 开始测试</div>
      
      <div class="form-group">
        <label class="form-label">题目数量</label>
        <div class="type-buttons">
          <button 
            v-for="num in [3, 5, 10, 15]" 
            :key="num"
            class="type-btn"
            :class="{ active: examConfig.count === num }"
            @click="examConfig.count = num"
          >{{ num }}题</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">题目类型（可多选）</label>
        <div class="type-buttons">
          <button 
            class="type-btn"
            :class="{ active: examConfig.types.includes('single') }"
            @click="toggleType('single')"
          >单选</button>
          <button 
            class="type-btn"
            :class="{ active: examConfig.types.includes('multiple') }"
            @click="toggleType('multiple')"
          >多选</button>
          <button 
            class="type-btn"
            :class="{ active: examConfig.types.includes('judge') }"
            @click="toggleType('judge')"
          >判断</button>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">答题时间</label>
        <div class="type-buttons">
          <button 
            v-for="time in [3, 5, 10, 15]" 
            :key="time"
            class="type-btn"
            :class="{ active: examConfig.timeLimit === time }"
            @click="examConfig.timeLimit = time"
          >{{ time }}分钟</button>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <button 
        class="btn btn-primary btn-lg" 
        @click="startExam" 
        :disabled="examConfig.types.length === 0"
        :class="{ 'btn-disabled': examConfig.types.length === 0 }"
      >
        🚀 开始答题
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '../utils/http.js'

const router = useRouter()

const questionCount = ref(0)
const examCount = ref(0)
const avgAccuracy = ref(0)
const wrongCount = ref(0)
const error = ref('')

const examConfig = reactive({
  count: 5,
  types: ['single', 'multiple', 'judge'],
  timeLimit: 5
})

const toggleType = (type) => {
  const index = examConfig.types.indexOf(type)
  if (index > -1) {
    if (examConfig.types.length > 1) {
      examConfig.types.splice(index, 1)
    }
  } else {
    examConfig.types.push(type)
  }
}

const loadStats = async () => {
  try {
    const [questionsRes, statsRes] = await Promise.all([
      http.get('/api/questions'),
      http.get('/api/stats')
    ])
    
    if (questionsRes.data.success) {
      questionCount.value = questionsRes.data.data.length
    }
    
    if (statsRes.data.success) {
      const stats = statsRes.data.data
      examCount.value = stats.totalExams
      avgAccuracy.value = stats.averageAccuracy
      wrongCount.value = stats.wrongQuestions.length
    }
  } catch (err) {
    console.error('加载统计数据失败', err)
  }
}

const startExam = async () => {
  error.value = ''
  
  if (examConfig.types.length === 0) {
    error.value = '请至少选择一种题目类型'
    return
  }
  
  try {
    const res = await http.post('/api/exam/generate', {
      count: examConfig.count,
      types: examConfig.types
    })
    
    if (res.data.success) {
      const { examId, questions } = res.data.data
      
      const examData = {
        examId,
        questions,
        timeLimit: examConfig.timeLimit * 60,
        startTime: Date.now()
      }
      
      localStorage.setItem('currentExam', JSON.stringify(examData))
      router.push('/exam')
    } else {
      error.value = res.data.message || '生成试卷失败'
    }
  } catch (err) {
    error.value = '生成试卷失败，请稍后重试'
    console.error(err)
  }
}

onMounted(() => {
  loadStats()
})
</script>
