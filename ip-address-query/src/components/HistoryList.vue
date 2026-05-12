<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <div>
        <h3 class="text-lg font-bold text-gray-800">查询历史</h3>
        <p class="text-sm text-gray-500 mt-1">共 {{ history.length }} 条记录</p>
      </div>
      <button 
        v-if="history.length > 0"
        @click="$emit('clear')"
        class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
      >
        清空历史
      </button>
    </div>
    
    <div v-if="history.length === 0" class="p-12 text-center">
      <div class="text-6xl mb-4">📭</div>
      <p class="text-gray-500">暂无查询记录</p>
    </div>
    
    <div v-else class="divide-y divide-gray-100 max-h-96 overflow-y-auto">
      <div 
        v-for="(item, index) in history" 
        :key="index"
        class="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between group"
        @click="$emit('select', item)"
      >
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <span class="font-mono text-sm font-semibold text-gray-900">{{ item.ip }}</span>
            <span class="text-lg">{{ getCountryFlag(item.country) }}</span>
          </div>
          <div class="text-sm text-gray-500 mt-1">
            {{ item.country }} · {{ item.city }} · {{ item.isp }}
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-400">{{ formatTime(item.queryTime) }}</span>
          <button 
            @click.stop="$emit('delete', item.ip)"
            class="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  history: {
    type: Array,
    required: true
  }
})

defineEmits(['select', 'delete', 'clear'])

const countryFlags = {
  '中国': '🇨🇳',
  '美国': '🇺🇸',
  '日本': '🇯🇵',
  '韩国': '🇰🇷',
  '英国': '🇬🇧',
  '德国': '🇩🇪'
}

function getCountryFlag(country) {
  return countryFlags[country] || '🌍'
}

function formatTime(timeStr) {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  
  return date.toLocaleDateString('zh-CN')
}
</script>
