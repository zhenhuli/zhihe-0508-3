<template>
  <div class="container">
    <div class="page-title">📋 答题记录</div>
    
    <div v-if="loading" class="loading">加载中...</div>
    
    <div v-else-if="records.length === 0" class="empty">
      暂无答题记录
    </div>

    <div v-else>
      <div 
        v-for="(record, idx) in records" 
        :key="record.id"
        class="list-item"
        @click="viewDetail(record)"
      >
        <div class="list-item-header">
          <div class="flex items-center gap-2">
            <span 
              :class="['tag', record.accuracy >= 80 ? 'tag-success' : record.accuracy >= 60 ? 'tag-judge' : 'tag-danger']"
              style="font-size: 16px; padding: 6px 12px;"
            >
              {{ record.accuracy }}%
            </span>
            <span class="list-item-meta">#{{ idx + 1 }}</span>
          </div>
          <span 
            :class="['tag', record.accuracy >= 80 ? 'tag-success' : record.accuracy >= 60 ? 'tag-judge' : 'tag-danger']"
          >
            {{ record.accuracy >= 80 ? '优秀' : record.accuracy >= 60 ? '良好' : '加油' }}
          </span>
        </div>
        
        <div class="record-stats" style="margin-top: 12px;">
          <div class="record-stat-item">
            <div class="record-stat-value">{{ record.totalCount }}</div>
            <div class="record-stat-label">总题数</div>
          </div>
          <div class="record-stat-item">
            <div class="record-stat-value" style="color: #67c23a;">{{ record.correctCount }}</div>
            <div class="record-stat-label">答对</div>
          </div>
          <div class="record-stat-item">
            <div class="record-stat-value" style="color: #f56c6c;">{{ record.totalCount - record.correctCount }}</div>
            <div class="record-stat-label">答错</div>
          </div>
          <div class="record-stat-item">
            <div class="record-stat-value" style="color: #409eff;">{{ formatTime(record.timeSpent) }}</div>
            <div class="record-stat-label">用时</div>
          </div>
        </div>
        
        <div class="flex items-center justify-between" style="margin-top: 12px;">
          <span class="list-item-meta">🕐 {{ formatDate(record.createdAt) }}</span>
          <button class="btn btn-primary btn-sm" @click.stop="viewDetail(record)">
            查看详情 →
          </button>
        </div>
      </div>
      
      <button 
        class="btn btn-danger btn-sm" 
        @click="clearRecords" 
        v-if="records.length > 0"
        style="width: 100%; margin-top: 12px;"
      >
        🗑️ 清空所有记录
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import http from '../utils/http.js'

const router = useRouter()

const loading = ref(true)
const records = ref([])

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}分${secs}秒`
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN')
}

const loadRecords = async () => {
  try {
    const res = await http.get('/api/records')
    if (res.data.success) {
      records.value = res.data.data
    }
  } catch (err) {
    console.error('加载记录失败', err)
  } finally {
    loading.value = false
  }
}

const viewDetail = (record) => {
  router.push(`/result/${record.id}`)
}

const clearRecords = async () => {
  if (!confirm('确定要清空所有答题记录吗？此操作不可恢复。')) return
  
  try {
    await http.get('/api/clear')
    await loadRecords()
  } catch (err) {
    console.error('清空记录失败', err)
  }
}

onMounted(() => {
  loadRecords()
})
</script>
