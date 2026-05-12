<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-100">
      <h3 class="text-lg font-bold text-gray-800">批量查询结果</h3>
      <p class="text-sm text-gray-500 mt-1">共 {{ results.length }} 条记录</p>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">输入</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP地址</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">地区</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">运营商</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">网络类型</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="(item, index) in results" :key="index" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="font-mono text-sm text-gray-900">{{ item.input }}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="item.success" class="font-mono text-sm text-gray-900">{{ item.data.ip }}</span>
              <span v-else class="text-sm text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="item.success" class="text-sm text-gray-900">
                {{ getCountryFlag(item.data.country) }} {{ item.data.country }} - {{ item.data.city }}
              </span>
              <span v-else class="text-sm text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="item.success" class="text-sm text-gray-900">{{ item.data.isp }}</span>
              <span v-else class="text-sm text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="item.success" class="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
                {{ item.data.networkType }}
              </span>
              <span v-else class="text-sm text-gray-400">-</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span v-if="item.success" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                成功
              </span>
              <span v-else class="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                {{ item.error }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  results: {
    type: Array,
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
</script>
