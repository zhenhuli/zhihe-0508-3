<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800">匹配结果与分组</h2>
      <button
        v-if="matchResults.length > 0"
        @click="expandAll = !expandAll"
        class="text-sm text-blue-600 hover:text-blue-700 transition-colors"
      >
        {{ expandAll ? '全部收起' : '全部展开' }}
      </button>
    </div>

    <div v-if="!pattern || !text" class="text-center py-8 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-sm">输入正则表达式和测试文本查看匹配结果</p>
    </div>

    <div v-else-if="!isValid" class="text-center py-8 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-3 text-red-300" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <p class="text-sm text-red-500">正则表达式语法错误</p>
    </div>

    <div v-else-if="matchResults.length === 0" class="text-center py-8 text-gray-500">
      <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p class="text-sm">未找到匹配项</p>
    </div>

    <div v-else class="space-y-3 max-h-96 overflow-auto">
      <div
        v-for="(result, idx) in matchResults"
        :key="idx"
        class="border border-gray-200 rounded-lg overflow-hidden"
      >
        <div
          class="flex items-center justify-between px-4 py-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
          @click="toggleMatch(idx)"
        >
          <div class="flex items-center gap-3">
            <span class="flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {{ idx + 1 }}
            </span>
            <div>
              <span class="font-mono text-sm text-gray-800 break-all">{{ result.fullMatch }}</span>
              <span class="ml-2 text-xs text-gray-500">位置: {{ result.index }}-{{ result.index + result.fullMatch.length }}</span>
            </div>
          </div>
          <svg
            class="w-5 h-5 text-gray-400 transition-transform"
            :class="expandedMatches[idx] || expandAll ? 'rotate-180' : ''"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <div v-if="expandedMatches[idx] || expandAll" class="px-4 py-3 border-t border-gray-200 bg-white">
          <div v-if="result.groups.length > 0" class="space-y-2">
            <div class="text-xs font-medium text-gray-500 mb-2">捕获组：</div>
            <div
              v-for="(group, gIdx) in result.groups"
              :key="gIdx"
              class="flex items-start gap-3 py-2 px-3 bg-gray-50 rounded"
            >
              <span class="flex-shrink-0 w-16 text-xs text-gray-500 pt-0.5">
                分组 {{ gIdx + 1 }}
              </span>
              <span class="font-mono text-sm text-gray-800 break-all">
                {{ group || '(空)' }}
              </span>
            </div>
          </div>
          <div v-else class="text-xs text-gray-500">
            无捕获组
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  pattern: {
    type: String,
    default: ''
  },
  flags: {
    type: String,
    default: 'g'
  },
  isValid: {
    type: Boolean,
    default: true
  }
})

const expandedMatches = ref({})
const expandAll = ref(false)

const matchResults = computed(() => {
  if (!props.pattern || !props.isValid || !props.text) return []

  try {
    const regex = new RegExp(props.pattern, props.flags.includes('g') ? props.flags : props.flags + 'g')
    const results = []
    let match

    while ((match = regex.exec(props.text)) !== null) {
      const groups = match.slice(1)
      results.push({
        fullMatch: match[0],
        index: match.index,
        groups: groups
      })

      if (match[0].length === 0) {
        regex.lastIndex++
      }
    }

    return results
  } catch {
    return []
  }
})

const toggleMatch = (idx) => {
  expandedMatches.value[idx] = !expandedMatches.value[idx]
}

watch(() => [props.pattern, props.text, props.flags], () => {
  expandedMatches.value = {}
})
</script>
