<template>
  <div class="container">
    <div class="card">
      <div class="card-header flex justify-between items-center">
        <span>错题本</span>
        <button class="btn btn-primary" @click="router.push('/')">再测一次</button>
      </div>

      <div v-if="loading" class="loading">加载中...</div>
      
      <div v-else-if="wrongQuestions.length === 0" class="empty">
        太棒了，没有错题记录！继续保持！
      </div>

      <div v-else>
        <div v-for="(q, idx) in wrongQuestions" :key="q.id" class="question-card" style="border: 1px solid #ebeef5; border-radius: 8px; padding: 20px;">
          <div class="question-header">
            <span class="question-number">
              <span class="tag tag-danger">错误 {{ q.wrongCount }} 次</span>
              <span :class="['tag', `tag-${q.type}`]" style="margin-left: 8px;">
                {{ getTypeName(q.type) }}
              </span>
              第 {{ idx + 1 }} 题
            </span>
          </div>

          <div class="question-content">{{ q.question }}</div>

          <div>
            <div 
              v-for="(opt, optIdx) in q.options" 
              :key="optIdx"
              class="option-item"
              :class="{ correct: q.correctAnswer.includes(optIdx) }"
            >
              <span class="option-letter">{{ String.fromCharCode(65 + optIdx) }}</span>
              <span>{{ opt }}</span>
              <span v-if="q.correctAnswer.includes(optIdx)" style="margin-left: 8px; color: #67c23a;">✓ 正确答案</span>
            </div>
          </div>

          <div v-if="q.explanation" class="alert alert-warning" style="margin-top: 16px;">
            <strong>解析：</strong>{{ q.explanation }}
          </div>

          <div class="alert alert-default" style="margin-top: 16px; background-color: #f5f7fa;">
            <strong>历史错误记录：</strong>
            <ul style="margin-top: 8px; margin-left: 20px;">
              <li v-for="(record, ridx) in q.examRecords.slice(0, 5)" :key="ridx">
                你的答案：{{ formatAnswer(record.userAnswer, q.options) }}
                （{{ formatDate(record.createdAt) }}）
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '../utils/http.js'

const router = useRouter()

const loading = ref(true)
const wrongQuestions = ref([])

const getTypeName = (type) => {
  const names = { single: '单选题', multiple: '多选题', judge: '判断题' }
  return names[type] || type
}

const formatAnswer = (answer, options) => {
  if (!answer || answer.length === 0) return '未作答'
  return answer
    .sort((a, b) => a - b)
    .map(idx => `${String.fromCharCode(65 + idx)}.${options[idx]}`)
    .join(', ')
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

const loadWrongQuestions = async () => {
  try {
    const res = await http.get('/api/wrong-questions')
    if (res.data.success) {
      wrongQuestions.value = res.data.data
    }
  } catch (err) {
    console.error('加载错题失败', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadWrongQuestions()
})
</script>
