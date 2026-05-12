<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:shadow-xl">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xl font-bold text-gray-800">{{ result.ip }}</h3>
      <span class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
        查询成功
      </span>
    </div>
    
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-gray-50 rounded-xl p-4">
        <div class="text-sm text-gray-500 mb-1">国家/地区</div>
        <div class="font-semibold text-gray-800 flex items-center gap-2">
          <span class="text-2xl">{{ getCountryFlag(result.country) }}</span>
          {{ result.country }}
        </div>
      </div>
      
      <div class="bg-gray-50 rounded-xl p-4">
        <div class="text-sm text-gray-500 mb-1">省份/州</div>
        <div class="font-semibold text-gray-800">{{ result.region }}</div>
      </div>
      
      <div class="bg-gray-50 rounded-xl p-4">
        <div class="text-sm text-gray-500 mb-1">城市</div>
        <div class="font-semibold text-gray-800">{{ result.city }}</div>
      </div>
      
      <div class="bg-gray-50 rounded-xl p-4">
        <div class="text-sm text-gray-500 mb-1">运营商</div>
        <div class="font-semibold text-gray-800">{{ result.isp }}</div>
      </div>
      
      <div class="bg-gray-50 rounded-xl p-4">
        <div class="text-sm text-gray-500 mb-1">网络类型</div>
        <div class="font-semibold text-gray-800">
          <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
            {{ result.networkType }}
          </span>
        </div>
      </div>
      
      <div class="bg-gray-50 rounded-xl p-4">
        <div class="text-sm text-gray-500 mb-1">时区</div>
        <div class="font-semibold text-gray-800">{{ result.timezone }}</div>
      </div>
    </div>
    
    <div class="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-400">
      查询时间: {{ formatTime(result.queryTime) }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  result: {
    type: Object,
    required: true
  }
})

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
  return date.toLocaleString('zh-CN')
}
</script>
