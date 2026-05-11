<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900">Regex Tester</h1>
              <p class="text-xs text-gray-500">正则表达式在线调试工具</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="space-y-6">
        <RegexInput @update="handleRegexUpdate" />

        <TextEditor
          :pattern="regex.pattern"
          :flags="regex.flags"
          :is-valid="regex.isValid"
          @update="handleTextUpdate"
        />

        <GroupResults
          :text="testText"
          :pattern="regex.pattern"
          :flags="regex.flags"
          :is-valid="regex.isValid"
        />
      </div>
    </main>

    <footer class="mt-12 py-6 border-t border-gray-200 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
        <p>支持 JavaScript 正则表达式语法 | Vue3 + Vite + TailwindCSS 构建</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import RegexInput from './components/RegexInput.vue'
import TextEditor from './components/TextEditor.vue'
import GroupResults from './components/GroupResults.vue'

const regex = reactive({
  pattern: '',
  flags: 'g',
  isValid: true
})

const testText = ref('')

const handleRegexUpdate = (data) => {
  regex.pattern = data.pattern
  regex.flags = data.flags
  regex.isValid = data.isValid
}

const handleTextUpdate = (text) => {
  testText.value = text
}
</script>
