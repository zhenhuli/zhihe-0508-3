<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-white mb-4">
          🌐 IP 归属地查询工具
        </h1>
        <p class="text-white/80 text-lg">
          输入 IP 地址或域名，快速查询地区、运营商、网络类型信息
        </p>
      </div>
      
      <div class="mb-8">
        <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <div class="flex gap-4 mb-4">
            <button 
              @click="activeTab = 'single'"
              :class="[
                'flex-1 py-3 px-6 rounded-xl font-medium transition-all',
                activeTab === 'single' 
                  ? 'bg-white text-purple-600 shadow-lg' 
                  : 'text-white hover:bg-white/20'
              ]"
            >
              单个查询
            </button>
            <button 
              @click="activeTab = 'batch'"
              :class="[
                'flex-1 py-3 px-6 rounded-xl font-medium transition-all',
                activeTab === 'batch' 
                  ? 'bg-white text-purple-600 shadow-lg' 
                  : 'text-white hover:bg-white/20'
              ]"
            >
              批量查询
            </button>
          </div>
          
          <div v-if="activeTab === 'single'" class="space-y-4">
            <div class="flex gap-4">
              <input 
                v-model="singleInput" 
                type="text" 
                placeholder="请输入IP地址或域名，例如：8.8.8.8 或 google.com"
                class="flex-1 px-6 py-4 rounded-xl bg-white border-0 focus:ring-4 focus:ring-purple-300 outline-none text-gray-800 placeholder-gray-400 text-lg"
                @keyup.enter="handleSingleQuery"
              />
              <button 
                @click="handleSingleQuery"
                :disabled="loading"
                class="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span v-if="!loading">查询</span>
                <span v-else class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  查询中
                </span>
              </button>
            </div>
            
            <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded-xl">
              {{ error }}
            </div>
            
            <div class="flex flex-wrap gap-2">
              <span class="text-white/60 text-sm">快速查询:</span>
              <button 
                v-for="quickIp in quickIps" 
                :key="quickIp"
                @click="singleInput = quickIp; handleSingleQuery()"
                class="px-3 py-1 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-colors"
              >
                {{ quickIp }}
              </button>
            </div>
          </div>
          
          <div v-if="activeTab === 'batch'" class="space-y-4">
            <textarea 
              v-model="batchInput" 
              placeholder="请输入多个IP地址或域名，每行一个，例如：
8.8.8.8
1.1.1.1
google.com
baidu.com"
              rows="6"
              class="w-full px-6 py-4 rounded-xl bg-white border-0 focus:ring-4 focus:ring-purple-300 outline-none text-gray-800 placeholder-gray-400 resize-none"
            ></textarea>
            
            <div class="flex gap-4">
              <button 
                @click="handleBatchQuery"
                :disabled="loading"
                class="flex-1 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span v-if="!loading">开始批量查询</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  查询中...
                </span>
              </button>
              <button 
                @click="batchInput = ''; batchResults = []"
                class="px-8 py-4 bg-white/20 text-white rounded-xl font-medium hover:bg-white/30 transition-colors"
              >
                清空
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="activeTab === 'single' && singleResult" class="mb-8">
        <IpResultCard :result="singleResult" />
      </div>
      
      <div v-if="activeTab === 'batch' && batchResults.length > 0" class="mb-8">
        <BatchResultTable :results="batchResults" />
      </div>
      
      <div class="mb-8">
        <HistoryList 
          :history="history" 
          @select="handleHistorySelect"
          @delete="handleHistoryDelete"
          @clear="handleHistoryClear"
        />
      </div>
      
      <div class="text-center text-white/60 text-sm">
        <p>💡 提示：点击历史记录可快速再次查询</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { queryIp, batchQueryIp } from './api/mockIpData'
import { saveToHistory, getHistory, clearHistory, deleteFromHistory } from './utils/historyStorage'
import IpResultCard from './components/IpResultCard.vue'
import BatchResultTable from './components/BatchResultTable.vue'
import HistoryList from './components/HistoryList.vue'

const activeTab = ref('single')
const singleInput = ref('')
const batchInput = ref('')
const loading = ref(false)
const error = ref('')
const singleResult = ref(null)
const batchResults = ref([])
const history = ref([])

const quickIps = ['8.8.8.8', '1.1.1.1', '114.114.114.114', 'baidu.com', 'google.com']

onMounted(() => {
  history.value = getHistory()
})

async function handleSingleQuery() {
  if (!singleInput.value.trim()) {
    error.value = '请输入IP地址或域名'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const result = await queryIp(singleInput.value)
    singleResult.value = result.data
    history.value = saveToHistory(result.data)
  } catch (err) {
    error.value = err.message
    singleResult.value = null
  } finally {
    loading.value = false
  }
}

async function handleBatchQuery() {
  const inputs = batchInput.value.split('\n').filter(line => line.trim())
  
  if (inputs.length === 0) {
    error.value = '请输入至少一个IP地址或域名'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const results = await batchQueryIp(inputs)
    batchResults.value = results
    
    results.forEach(item => {
      if (item.success) {
        history.value = saveToHistory(item.data)
      }
    })
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function handleHistorySelect(item) {
  singleInput.value = item.ip
  activeTab.value = 'single'
  singleResult.value = item
}

function handleHistoryDelete(ip) {
  history.value = deleteFromHistory(ip)
}

function handleHistoryClear() {
  if (confirm('确定要清空所有查询历史吗？')) {
    clearHistory()
    history.value = []
  }
}
</script>
