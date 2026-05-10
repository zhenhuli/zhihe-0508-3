<template>
  <div class="container">
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="!result" class="empty">
      找不到答题记录
      <button class="btn btn-primary" @click="router.push('/')" style="margin-top: 20px;">返回首页</button>
    </div>

    <div v-else>
      <div class="card">
        <div class="card-header">答题结果</div>
        
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ result.totalCount }}</div>
            <div class="stat-label">总题数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ result.correctCount }}</div>
            <div class="stat-label">答对题数</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ result.accuracy }}%</div>
            <div class="stat-label">正确率</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ formatTime(result.timeSpent) }}</div>
            <div class="stat-label">用时</div>
          </div>
        </div>

        <div class="alert" :class="result.accuracy >= 80 ? 'alert-success' : result.accuracy >= 60 ? 'alert-warning' : 'alert-danger'" style="margin-top: 20px;">
          <strong>
            {{ result.accuracy >= 80 ? '🎉 优秀！继续保持！' : result.accuracy >= 60 ? '👍 不错，还可以更好！' : '💪 加油，多多练习！' }}
          </strong>
        </div>

        <div class="flex justify-between" style="margin-top: 24px; gap: 16px;">
          <button class="btn btn-primary" @click="router.push('/')">再测一次</button>
          <button class="btn btn-default" @click="router.push('/wrong')">查看错题本</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">答题详情</div>
        
        <div v-for="(item, idx) in result.results" :key="idx" class="question-card">
          <div class="question-header">
            <span class="question-number">
              <span :class="['tag', item.isCorrect ? 'tag-success' : 'tag-danger']">
                {{ item.isCorrect ? '正确' : '错误' }}
              </span>
              <span :class="['tag', `tag-${item.type}`]" style="margin-left: 8px;">
                {{ getTypeName(item.type) }}
              </span>
              第 {{ idx + 1 }} 题
            </span>
          </div>

          <div class="question-content">{{ item.question }}</div>

          <div>
            <div 
              v-for="(opt, optIdx) in item.options" 
              :key="optIdx"
              class="option-item"
              :class="getOptionClass(item, optIdx)"
            >
              <span class="option-letter">{{ String.fromCharCode(65 + optIdx) }}</span>
              <span>{{ opt }}</span>
              <span v-if="item.correctAnswer.includes(optIdx)" style="margin-left: 8px; color: #67c23a;">✓ 正确答案</span>
              <span v-else-if="item.userAnswer.includes(optIdx) && !item.correctAnswer.includes(optIdx)" style="margin-left: 8px; color: #f56c6c;">✗ 你的选择</span>
            </div>
          </div>

          <div v-if="item.explanation" class="alert alert-warning" style="margin-top: 16px;">
            <strong>解析：</strong>{{ item.explanation }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import http from '../utils/http.js'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const result = ref(null)

const getTypeName = (type) => {
  const names = { single: '单选题', multiple: '多选题', judge: '判断题' }
  return names[type] || type
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}

const getOptionClass = (item, optIdx) => {
  const isCorrectAnswer = item.correctAnswer.includes(optIdx)
  const isUserAnswer = item.userAnswer.includes(optIdx)
  
  if (isCorrectAnswer) return 'correct'
  if (isUserAnswer && !isCorrectAnswer) return 'wrong'
  return ''
}

const loadResult = async () => {
  try {
    const res = await http.get(`/api/records/${route.params.examId}`)
    if (res.data.success) {
      result.value = res.data.data
    }
  } catch (err) {
    console.error('加载结果失败', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadResult()
})
</script>
