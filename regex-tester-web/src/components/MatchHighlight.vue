<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800">匹配高亮</h2>
      <div class="flex items-center gap-4 text-sm">
        <span class="text-gray-600">
          匹配数：<span class="font-semibold" :class="matchCount > 0 ? 'text-green-600' : 'text-gray-500'">{{ matchCount }}</span>
        </span>
      </div>
    </div>

    <div class="relative">
      <div
        class="w-full h-64 p-4 bg-gray-50 border border-gray-200 rounded-lg overflow-auto font-mono text-sm leading-relaxed whitespace-pre-wrap break-all"
      >
        <template v-if="highlightedContent.length > 0">
          <span
            v-for="(segment, index) in highlightedContent"
            :key="index"
            :class="segment.isMatch ? 'bg-yellow-200 text-gray-900 px-0.5 rounded' : 'text-gray-800'"
          >{{ segment.text }}</span>
        </template>
        <template v-else>
          <span class="text-gray-400">{{ text || '暂无测试文本' }}</span>
        </template>
      </div>
    </div>

    <div v-if="!pattern" class="mt-3 text-sm text-gray-500">
      提示：输入正则表达式开始匹配测试
    </div>
    <div v-else-if="!isValid" class="mt-3 text-sm text-red-500">
      正则表达式语法错误，请检查
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const matchCount = computed(() => {
  if (!props.pattern || !props.isValid || !props.text) return 0
  
  try {
    const regex = new RegExp(props.pattern, props.flags)
    const matches = props.text.match(regex)
    return matches ? matches.length : 0
  } catch {
    return 0
  }
})

const highlightedContent = computed(() => {
  if (!props.pattern || !props.isValid || !props.text) {
    return props.text ? [{ text: props.text, isMatch: false }] : []
  }

  try {
    const regex = new RegExp(props.pattern, props.flags.includes('g') ? props.flags : props.flags + 'g')
    const segments = []
    let lastIndex = 0
    let match

    while ((match = regex.exec(props.text)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          text: props.text.slice(lastIndex, match.index),
          isMatch: false
        })
      }

      if (match[0]) {
        segments.push({
          text: match[0],
          isMatch: true
        })
      }

      lastIndex = match.index + match[0].length

      if (match[0].length === 0) {
        regex.lastIndex++
      }
    }

    if (lastIndex < props.text.length) {
      segments.push({
        text: props.text.slice(lastIndex),
        isMatch: false
      })
    }

    return segments.length > 0 ? segments : [{ text: props.text, isMatch: false }]
  } catch {
    return [{ text: props.text, isMatch: false }]
  }
})
</script>
