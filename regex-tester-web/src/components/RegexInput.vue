<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-800">正则表达式</h2>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">修饰符：</span>
        <label class="flex items-center gap-1 text-sm cursor-pointer select-none">
          <input type="checkbox" v-model="flags.global" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span>g (全局)</span>
        </label>
        <label class="flex items-center gap-1 text-sm cursor-pointer select-none">
          <input type="checkbox" v-model="flags.ignoreCase" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span>i (忽略大小写)</span>
        </label>
        <label class="flex items-center gap-1 text-sm cursor-pointer select-none">
          <input type="checkbox" v-model="flags.multiline" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span>m (多行)</span>
        </label>
        <label class="flex items-center gap-1 text-sm cursor-pointer select-none">
          <input type="checkbox" v-model="flags.dotAll" class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
          <span>s (点匹配全部)</span>
        </label>
      </div>
    </div>

    <div class="relative">
      <div class="flex items-center bg-gray-50 border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500" :class="error ? 'border-red-400 focus-within:ring-red-500 focus-within:border-red-500' : ''">
        <span class="px-3 text-gray-400 text-lg font-mono">/</span>
        <input
          type="text"
          v-model="pattern"
          placeholder="输入正则表达式..."
          class="flex-1 bg-transparent py-3 px-1 text-lg font-mono outline-none text-gray-800"
          @input="handleInput"
        />
        <span class="px-3 text-gray-400 text-lg font-mono">/{{ flagsString }}</span>
      </div>
    </div>

    <div v-if="error" class="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
      <svg class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
      <span class="text-sm text-red-700">{{ error }}</span>
    </div>

    <div class="mt-4">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-sm font-medium text-gray-700">常用模板：</span>
        <div class="flex gap-2 flex-wrap">
          <button
            v-for="template in templates"
            :key="template.name"
            @click="applyTemplate(template)"
            class="px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
          >
            {{ template.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['update'])

const pattern = ref('')
const flags = ref({
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false
})
const error = ref('')

const flagsString = computed(() => {
  let str = ''
  if (flags.value.global) str += 'g'
  if (flags.value.ignoreCase) str += 'i'
  if (flags.value.multiline) str += 'm'
  if (flags.value.dotAll) str += 's'
  return str
})

const templates = [
  { name: '邮箱', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
  { name: '手机号', pattern: '1[3-9]\\d{9}' },
  { name: 'URL', pattern: 'https?://[\\w-]+(\\.[\\w-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?' },
  { name: 'IP地址', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b' },
  { name: '身份证号', pattern: '\\d{17}[\\dXx]|\\d{15}' },
  { name: '中文字符', pattern: '[\\u4e00-\\u9fa5]+' },
  { name: '日期', pattern: '\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}' },
  { name: 'HTML标签', pattern: '<([a-zA-Z][a-zA-Z0-9]*)\\b[^>]*>.*?</\\1>|<[a-zA-Z][a-zA-Z0-9]*\\b[^>]*/?>' }
]

const validateRegex = () => {
  if (!pattern.value) {
    error.value = ''
    emit('update', { pattern: '', flags: flagsString.value, isValid: true })
    return
  }

  try {
    new RegExp(pattern.value, flagsString.value)
    error.value = ''
    emit('update', { pattern: pattern.value, flags: flagsString.value, isValid: true })
  } catch (e) {
    error.value = e.message
    emit('update', { pattern: pattern.value, flags: flagsString.value, isValid: false, error: e.message })
  }
}

const handleInput = () => {
  validateRegex()
}

const applyTemplate = (template) => {
  pattern.value = template.pattern
  validateRegex()
}

watch(flags, () => {
  validateRegex()
}, { deep: true })
</script>
