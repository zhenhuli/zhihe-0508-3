<template>
  <div class="container">
    <div class="page-title">📊 统计分析</div>

    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalExams }}</div>
          <div class="stat-label">答题次数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalQuestions }}</div>
          <div class="stat-label">累计答题</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.totalCorrect }}</div>
          <div class="stat-label">答对题数</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ stats.averageAccuracy }}%</div>
          <div class="stat-label">平均正确率</div>
        </div>
      </div>

      <div class="card" style="margin-top: 16px;">
        <div class="card-header">❌ 高频错题（TOP 20）</div>
        
        <div v-if="stats.wrongQuestions.length === 0" class="empty">
          太棒了，没有错题记录！
        </div>

        <div v-else>
          <div 
            v-for="(q, idx) in stats.wrongQuestions" 
            :key="q.id"
            class="list-item"
          >
            <div class="list-item-header">
              <div class="flex items-center gap-2">
                <span class="tag tag-danger" style="font-size: 14px;">
                  🔴 {{ q.wrongCount }} 次错误
                </span>
                <span class="list-item-meta">第 {{ idx + 1 }} 名</span>
              </div>
              <span :class="['tag', `tag-${q.type}`]">
                {{ getTypeName(q.type) }}
              </span>
            </div>
            
            <div class="list-item-content" style="margin-top: 8px;">
              <p style="color: #303133; font-size: 14px; line-height: 1.6; font-weight: 500;">
                {{ q.question }}
              </p>
            </div>
            
            <div class="list-item-content" style="margin-top: 8px;">
              <div style="margin-bottom: 4px; font-size: 12px; color: #909399;">
                ✅ 正确答案：
              </div>
              <div style="font-size: 13px; color: #67c23a; font-weight: 500;">
                {{ formatAnswer(q.answer, q.options) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import http from '../utils/http.js'

const loading = ref(true)
const stats = reactive({
  totalExams: 0,
  totalQuestions: 0,
  totalCorrect: 0,
  averageAccuracy: 0,
  wrongQuestions: []
})

const getTypeName = (type) => {
  const names = { single: '单选题', multiple: '多选题', judge: '判断题' }
  return names[type] || type
}

const formatAnswer = (answer, options) => {
  return answer
    .sort((a, b) => a - b)
    .map(idx => `${String.fromCharCode(65 + idx)}.${options[idx]}`)
    .join(', ')
}

const loadStats = async () => {
  try {
    const res = await http.get('/api/stats')
    if (res.data.success) {
      Object.assign(stats, res.data.data)
    }
  } catch (err) {
    console.error('加载统计数据失败', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>
