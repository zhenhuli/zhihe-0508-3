<script setup>
import { ref, computed, onMounted, watch } from 'vue'

const podcasts = ref([])
const newName = ref('')
const newUpdateTime = ref('')

const loadFromStorage = () => {
  const saved = localStorage.getItem('podcast-list')
  if (saved) {
    podcasts.value = JSON.parse(saved)
  }
}

const saveToStorage = () => {
  localStorage.setItem('podcast-list', JSON.stringify(podcasts.value))
}

onMounted(() => {
  loadFromStorage()
})

watch(podcasts, () => {
  saveToStorage()
}, { deep: true })

const addPodcast = () => {
  if (!newName.value.trim()) return
  
  podcasts.value.unshift({
    id: Date.now(),
    name: newName.value.trim(),
    updateTime: newUpdateTime.value || new Date().toLocaleDateString(),
    progress: 0,
    listened: false
  })
  
  newName.value = ''
  newUpdateTime.value = ''
}

const toggleListened = (id) => {
  const podcast = podcasts.value.find(p => p.id === id)
  if (podcast) {
    podcast.listened = !podcast.listened
  }
}

const removePodcast = (id) => {
  podcasts.value = podcasts.value.filter(p => p.id !== id)
}

const updateProgress = (id, event) => {
  const podcast = podcasts.value.find(p => p.id === id)
  if (podcast) {
    podcast.progress = parseInt(event.target.value)
  }
}

const stats = computed(() => {
  const total = podcasts.value.length
  const listened = podcasts.value.filter(p => p.listened).length
  const avgProgress = total > 0 
    ? Math.round(podcasts.value.reduce((sum, p) => sum + p.progress, 0) / total)
    : 0
  return { total, listened, avgProgress }
})
</script>

<template>
  <div class="container">
    <header class="header">
      <h1>🎙️ 播客订阅清单</h1>
      <div class="stats">
        <span>总订阅: {{ stats.total }}</span>
        <span>已听: {{ stats.listened }}</span>
        <span>平均进度: {{ stats.avgProgress }}%</span>
      </div>
    </header>

    <div class="add-form">
      <input 
        v-model="newName" 
        type="text" 
        placeholder="节目名称"
        class="input-name"
        @keyup.enter="addPodcast"
      />
      <input 
        v-model="newUpdateTime" 
        type="text" 
        placeholder="更新时间 (可选)"
        class="input-time"
        @keyup.enter="addPodcast"
      />
      <button @click="addPodcast" class="add-btn">添加</button>
    </div>

    <div class="podcast-list">
      <div 
        v-for="podcast in podcasts" 
        :key="podcast.id"
        class="podcast-card"
        :class="{ listened: podcast.listened }"
      >
        <div class="podcast-info">
          <div class="podcast-name">{{ podcast.name }}</div>
          <div class="podcast-time">更新时间: {{ podcast.updateTime }}</div>
        </div>
        
        <div class="progress-section">
          <input 
            type="range" 
            min="0" 
            max="100" 
            :value="podcast.progress"
            @input="updateProgress(podcast.id, $event)"
            class="progress-slider"
          />
          <span class="progress-text">{{ podcast.progress }}%</span>
        </div>

        <div class="actions">
          <button 
            class="toggle-btn"
            :class="{ active: podcast.listened }"
            @click="toggleListened(podcast.id)"
          >
            {{ podcast.listened ? '✓ 已听' : '○ 未听' }}
          </button>
          <button class="delete-btn" @click="removePodcast(podcast.id)">删除</button>
        </div>
      </div>

      <div v-if="podcasts.length === 0" class="empty-state">
        <p>暂无订阅，开始添加你的第一个播客吧！</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 15px;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 30px;
  font-size: 14px;
  color: #7f8c8d;
}

.add-form {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
}

.input-name {
  flex: 2;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input-name:focus {
  outline: none;
  border-color: #3498db;
}

.input-time {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.input-time:focus {
  outline: none;
  border-color: #3498db;
}

.add-btn {
  padding: 12px 24px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.add-btn:hover {
  background: #2980b9;
}

.podcast-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.podcast-card {
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
}

.podcast-card:hover {
  border-color: #3498db;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15);
}

.podcast-card.listened {
  border-color: #27ae60;
  background: #f0fdf4;
}

.podcast-info {
  margin-bottom: 15px;
}

.podcast-name {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 5px;
}

.podcast-time {
  font-size: 14px;
  color: #7f8c8d;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}

.progress-slider {
  flex: 1;
  height: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: #e9ecef;
  border-radius: 4px;
  outline: none;
}

.progress-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #3498db;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s;
}

.progress-slider::-webkit-slider-thumb:hover {
  background: #2980b9;
}

.progress-text {
  min-width: 50px;
  text-align: right;
  font-weight: 600;
  color: #3498db;
}

.actions {
  display: flex;
  gap: 10px;
}

.toggle-btn {
  flex: 1;
  padding: 10px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-btn.active {
  border-color: #27ae60;
  background: #27ae60;
  color: white;
}

.toggle-btn:not(.active):hover {
  border-color: #3498db;
  color: #3498db;
}

.delete-btn {
  padding: 10px 20px;
  border: none;
  background: #e74c3c;
  color: white;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.delete-btn:hover {
  background: #c0392b;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
  font-size: 16px;
}

@media (max-width: 600px) {
  .add-form {
    flex-direction: column;
  }
  
  .stats {
    flex-direction: column;
    gap: 10px;
  }
  
  .actions {
    flex-direction: column;
  }
}
</style>
