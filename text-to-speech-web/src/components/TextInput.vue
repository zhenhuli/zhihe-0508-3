<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  segments: {
    type: Array,
    default: () => []
  },
  currentSegmentIndex: {
    type: Number,
    default: -1
  }
})

const emit = defineEmits(['update:modelValue', 'play-segment', 'copy-text'])

const textareaRef = ref(null)
const pasteContent = ref('')
const showPasteModal = ref(false)

const updateText = (event) => {
  emit('update:modelValue', event.target.value)
}

const clearText = () => {
  emit('update:modelValue', '')
}

const openPasteModal = () => {
  showPasteModal.value = true
  pasteContent.value = ''
}

const confirmPaste = () => {
  if (pasteContent.value.trim()) {
    emit('update:modelValue', props.modelValue + pasteContent.value)
  }
  showPasteModal.value = false
}

const playSegment = (index) => {
  emit('play-segment', index)
}

const insertSampleText = () => {
  const sampleText = `欢迎使用在线文本转语音工具！这是一个基于 Vue3 和 Web Speech API 开发的免费工具。

你可以在这里输入任意文本，然后点击播放按钮，系统会自动将文本转换为语音。

本工具支持多种功能：
1. 选择不同的语音音色
2. 调节语速和音量
3. 分段播放与暂停
4. 导出音频文件

现在，让我们开始体验吧！`
  emit('update:modelValue', sampleText)
}

watch(() => props.modelValue, () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = textareaRef.value.scrollHeight + 'px'
  }
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-700">文本输入</h2>
      <div class="flex gap-2">
        <button
          @click="insertSampleText"
          class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
        >
          插入示例
        </button>
        <button
          @click="openPasteModal"
          class="px-3 py-1.5 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
        >
          粘贴文本
        </button>
        <button
          @click="clearText"
          class="px-3 py-1.5 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
        >
          清空
        </button>
      </div>
    </div>
    
    <textarea
      ref="textareaRef"
      :value="modelValue"
      @input="updateText"
      placeholder="请输入或粘贴要转换的文本..."
      class="w-full min-h-[200px] p-4 border border-gray-200 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 leading-relaxed"
    ></textarea>
    
    <div class="mt-4 flex items-center justify-between">
      <span class="text-sm text-gray-500">
        字符数: {{ modelValue.length }} | 段落数: {{ segments.length }}
      </span>
    </div>
    
    <div v-if="segments.length > 0" class="mt-6">
      <h3 class="text-md font-medium text-gray-700 mb-3">分段预览</h3>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        <div
          v-for="(segment, index) in segments"
          :key="index"
          class="flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer"
          :class="{
            'bg-blue-50 border-2 border-blue-500': currentSegmentIndex === index,
            'bg-gray-50 hover:bg-gray-100 border-2 border-transparent': currentSegmentIndex !== index
          }"
          @click="playSegment(index)"
        >
          <div class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
               :class="{
                 'bg-blue-500 text-white': currentSegmentIndex === index,
                 'bg-gray-200 text-gray-600': currentSegmentIndex !== index
               }">
            {{ index + 1 }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-gray-700 text-sm line-clamp-2">{{ segment }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ segment.length }} 字符</p>
          </div>
          <button
            class="flex-shrink-0 p-2 rounded-full hover:bg-white/50 transition-colors"
            @click.stop="playSegment(index)"
            :title="currentSegmentIndex === index ? '正在播放' : '播放此段'"
          >
            <svg v-if="currentSegmentIndex === index" class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <rect x="5" y="4" width="3" height="12" rx="1"></rect>
              <rect x="12" y="4" width="3" height="12" rx="1"></rect>
            </svg>
            <svg v-else class="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div
      v-if="showPasteModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="showPasteModal = false"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-700">粘贴文本</h3>
          <button
            @click="showPasteModal = false"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-4">
          <textarea
            v-model="pasteContent"
            placeholder="请粘贴文本内容..."
            class="w-full h-48 p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>
        <div class="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            @click="showPasteModal = false"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            @click="confirmPaste"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            添加到文本
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
