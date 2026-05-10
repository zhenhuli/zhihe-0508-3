<template>
  <div class="container" v-if="!examData">
    <div class="empty">暂无考试数据，请先开始测试</div>
    <button class="btn btn-primary btn-lg" @click="router.push('/')" style="margin-top: 20px;">返回首页</button>
  </div>

  <div class="container" v-else>
    <div class="timer" :class="{ 'alert-warning': timeLeft < 60 }">
      ⏱️ {{ formatTime(timeLeft) }}
    </div>

    <div class="exam-info">
      <div class="exam-info-text">
        第 {{ currentIndex + 1 }} / {{ examData.questions.length }} 题
      </div>
      <div class="progress-bar" style="margin-top: 8px;">
        <div 
          class="progress-fill" 
          :style="{ width: `${((currentIndex + 1) / examData.questions.length) * 100}%` }"
        ></div>
      </div>
    </div>

    <div class="question-card" v-if="currentQuestion" style="margin-top: 12px;">
      <div class="question-header">
        <span class="question-number">
          <span :class="['tag', `tag-${currentQuestion.type}`]">
            {{ getTypeName(currentQuestion.type) }}
          </span>
        </span>
      </div>

      <div class="question-content">{{ currentQuestion.question }}</div>

      <div v-if="currentQuestion.type === 'multiple'" class="alert alert-warning">
        💡 这是多选题，请选择所有正确答案
      </div>

      <div>
        <div 
          v-for="(opt, idx) in currentQuestion.options" 
          :key="idx"
          class="option-item"
          :class="{ selected: isSelected(currentQuestion.id, idx) }"
          @click="selectOption(currentQuestion.id, idx)"
        >
          <span class="option-letter">{{ String.fromCharCode(65 + idx) }}</span>
          <span class="option-text">{{ opt }}</span>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top: 12px;">
      <div class="question-nav">
        <div 
          v-for="(_, idx) in examData.questions.length" 
          :key="idx"
          class="question-nav-item"
          :class="{ 
            answered: getAnswerStatus(idx) === 'answered',
            active: currentIndex === idx
          }"
          @click="jumpToQuestion(idx)"
        >
          {{ idx + 1 }}
        </div>
      </div>
    </div>

    <div class="fixed-bottom safe-area-bottom">
      <div class="nav-buttons">
        <button 
          class="btn btn-default" 
          @click="prevQuestion"
          :disabled="currentIndex === 0"
        >⬅️ 上一题</button>
        <button 
          v-if="currentIndex < examData.questions.length - 1"
          class="btn btn-primary" 
          @click="nextQuestion"
        >下一题 ➡️</button>
        <button 
          v-else
          class="btn btn-success" 
          @click="submitExam"
        >✅ 提交试卷</button>
      </div>
    </div>
  </div>

  <div v-if="showConfirmModal" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">📝 确认提交</h3>
      </div>
      <div style="margin-bottom: 24px;">
        <p style="font-size: 15px;">您已完成 <strong style="color: #67c23a;">{{ answeredCount }}</strong> 道题目</p>
        <p style="font-size: 15px; margin-top: 8px;">还有 <strong style="color: #f56c6c;">{{ unansweredCount }}</strong> 道题目未作答</p>
        <p style="margin-top: 16px; color: #909399; font-size: 13px;">确定要提交试卷吗？提交后将无法修改。</p>
      </div>
      <div class="flex justify-between">
        <button class="btn btn-default" style="flex: 1; margin-right: 12px;" @click="showConfirmModal = false">继续答题</button>
        <button class="btn btn-success" style="flex: 1;" @click="confirmSubmit">确认提交</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '../utils/http.js'

const router = useRouter()

const examData = ref(null)
const currentIndex = ref(0)
const answers = ref({})
const timeLeft = ref(0)
const showConfirmModal = ref(false)
let timer = null

const currentQuestion = computed(() => {
  if (!examData.value || !examData.value.questions) return null
  return examData.value.questions[currentIndex.value]
})

const answeredCount = computed(() => {
  return Object.keys(answers.value).filter(k => {
    return answers.value[k] && answers.value[k].length > 0
  }).length
})

const unansweredCount = computed(() => {
  if (!examData.value) return 0
  return examData.value.questions.length - answeredCount.value
})

const getTypeName = (type) => {
  const names = { single: '单选题', multiple: '多选题', judge: '判断题' }
  return names[type] || type
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const isSelected = (questionId, optionIdx) => {
  const answer = answers.value[questionId]
  return answer && answer.includes(optionIdx)
}

const selectOption = (questionId, optionIdx) => {
  const question = examData.value.questions.find(q => q.id === questionId)
  if (!question) return

  if (!answers.value[questionId]) {
    answers.value[questionId] = []
  }

  if (question.type === 'single' || question.type === 'judge') {
    answers.value[questionId] = [optionIdx]
  } else {
    const pos = answers.value[questionId].indexOf(optionIdx)
    if (pos > -1) {
      answers.value[questionId].splice(pos, 1)
    } else {
      answers.value[questionId].push(optionIdx)
    }
  }
}

const getAnswerStatus = (idx) => {
  const question = examData.value.questions[idx]
  if (!question) return 'empty'
  const answer = answers.value[question.id]
  if (!answer || answer.length === 0) return 'empty'
  return 'answered'
}

const prevQuestion = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const nextQuestion = () => {
  if (currentIndex.value < examData.value.questions.length - 1) {
    currentIndex.value++
  } else {
    showConfirmModal.value = true
  }
}

const jumpToQuestion = (idx) => {
  currentIndex.value = idx
}

const submitExam = () => {
  showConfirmModal.value = true
}

const confirmSubmit = async () => {
  showConfirmModal.value = false
  
  const timeSpent = examData.value.timeLimit - timeLeft.value
  
  try {
    const res = await http.post('/api/exam/submit', {
      examId: examData.value.examId,
      answers: answers.value,
      timeSpent
    })
    
    if (res.data.success) {
      localStorage.removeItem('currentExam')
      if (timer) clearInterval(timer)
      router.push(`/result/${examData.value.examId}`)
    }
  } catch (err) {
    console.error('提交失败', err)
    alert('提交失败，请重试')
  }
}

const loadExam = () => {
  const stored = localStorage.getItem('currentExam')
  if (!stored) {
    return
  }
  
  try {
    const data = JSON.parse(stored)
    examData.value = data
    
    const elapsed = Math.floor((Date.now() - data.startTime) / 1000)
    timeLeft.value = Math.max(0, data.timeLimit - elapsed)
    
    timer = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--
        if (timeLeft.value === 0) {
          confirmSubmit()
        }
      }
    }, 1000)
  } catch (err) {
    console.error('加载考试数据失败', err)
  }
}

onMounted(() => {
  loadExam()
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>
