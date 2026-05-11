<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { 
  MAX_GOOGLE_TTS_LENGTH, 
  getGoogleTTSUrl, 
  getAlternativeTTSUrl,
  splitTextForTTS, 
  detectLanguage
} from '../utils/audioExport'

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  selectedVoice: {
    type: Object,
    default: null
  },
  rate: {
    type: Number,
    default: 1
  },
  pitch: {
    type: Number,
    default: 1
  },
  volume: {
    type: Number,
    default: 1
  }
})

const isExporting = ref(false)
const exportStatus = ref('')
const exportProgress = ref(0)
const showInfo = ref(false)
const showAudioPreview = ref(false)
const audioUrl = ref('')
const alternativeAudioUrl = ref('')
const currentSegment = ref(0)
const totalSegments = ref(0)
const exportError = ref('')
const audioErrorMessage = ref('')
const isIframeMode = ref(false)
const useAlternativeUrl = ref(false)
const previewMode = ref('audio')

const canExport = computed(() => {
  return props.text.trim().length > 0
})

const textLength = computed(() => props.text.trim().length)

const canUseGoogleTTS = computed(() => {
  return textLength.value <= MAX_GOOGLE_TTS_LENGTH
})

const requiredSegments = computed(() => {
  if (!canExport.value) return 0
  return splitTextForTTS(props.text).length
})

const detectedLang = computed(() => {
  if (!canExport.value) return 'zh-CN'
  return detectLanguage(props.text)
})

const showSegmentWarning = computed(() => {
  return canExport.value && !canUseGoogleTTS.value
})

const exportAsText = () => {
  if (!canExport.value) return
  
  const blob = new Blob([props.text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `text-to-speech-${Date.now()}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  showSuccess('文本文件已导出！')
}

const exportAsSRT = () => {
  if (!canExport.value) return
  
  const lines = props.text.split('\n').filter(line => line.trim())
  let srtContent = ''
  let timeIndex = 0
  
  lines.forEach((line, index) => {
    const duration = Math.max(line.length * 0.15, 2)
    const startTime = formatTime(timeIndex)
    timeIndex += duration
    const endTime = formatTime(timeIndex)
    
    srtContent += `${index + 1}\n`
    srtContent += `${startTime} --> ${endTime}\n`
    srtContent += `${line.trim()}\n\n`
  })
  
  const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `text-to-speech-${Date.now()}.srt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  showSuccess('字幕文件已导出！')
}

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  const millis = Math.floor((seconds % 1) * 1000)
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(millis).padStart(3, '0')}`
}

const exportConfig = () => {
  if (!canExport.value) return
  
  const config = {
    text: props.text,
    voice: props.selectedVoice ? {
      name: props.selectedVoice.name,
      lang: props.selectedVoice.lang
    } : null,
    settings: {
      rate: props.rate,
      pitch: props.pitch,
      volume: props.volume
    },
    exportedAt: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `tts-config-${Date.now()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  showSuccess('配置文件已导出！')
}

const copyToClipboard = async () => {
  if (!canExport.value) return
  
  try {
    await navigator.clipboard.writeText(props.text)
    showSuccess('已复制到剪贴板！')
  } catch (err) {
    showError('复制失败，请手动复制')
  }
}

const exportAsAudio = async () => {
  if (!canExport.value) return
  
  isExporting.value = true
  exportError.value = ''
  exportProgress.value = 0
  
  try {
    if (canUseGoogleTTS.value) {
      await exportSingleAudio()
    } else {
      await exportMultipleAudio()
    }
  } catch (error) {
    console.error('导出音频失败:', error)
    showError(`导出失败: ${error.message || '未知错误'}`)
  } finally {
    isExporting.value = false
  }
}

const exportSingleAudio = async () => {
  const lang = props.selectedVoice?.lang || detectedLang.value
  const url = getGoogleTTSUrl(props.text.trim(), lang)
  
  audioUrl.value = url
  alternativeAudioUrl.value = getAlternativeTTSUrl(props.text.trim(), lang)
  useAlternativeUrl.value = false
  exportProgress.value = 100
  
  const link = document.createElement('a')
  link.href = url
  link.download = `speech-${Date.now()}.mp3`
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showSuccess('音频文件已开始下载！')
}

const exportMultipleAudio = async () => {
  const segments = splitTextForTTS(props.text)
  const lang = props.selectedVoice?.lang || detectedLang.value
  
  totalSegments.value = segments.length
  currentSegment.value = 0
  
  for (let i = 0; i < segments.length; i++) {
    currentSegment.value = i + 1
    exportProgress.value = Math.round(((i + 1) / segments.length) * 100)
    
    const segment = segments[i]
    const url = getGoogleTTSUrl(segment, lang)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `speech-part-${String(i + 1).padStart(2, '0')}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
  }
  
  showSuccess(`已导出 ${segments.length} 个音频文件！`)
}

const previewAudio = () => {
  if (!canExport.value || !canUseGoogleTTS.value) return
  
  const lang = props.selectedVoice?.lang || detectedLang.value
  audioUrl.value = getGoogleTTSUrl(props.text.trim(), lang)
  alternativeAudioUrl.value = getAlternativeTTSUrl(props.text.trim(), lang)
  useAlternativeUrl.value = false
  isIframeMode.value = false
  audioErrorMessage.value = ''
  previewMode.value = 'audio'
  showAudioPreview.value = true
}

const switchToIframeMode = () => {
  isIframeMode.value = true
}

const switchToAudioMode = () => {
  isIframeMode.value = false
}

const switchUrl = () => {
  useAlternativeUrl.value = !useAlternativeUrl.value
}

const getCurrentAudioUrl = () => {
  return useAlternativeUrl.value ? alternativeAudioUrl.value : audioUrl.value
}

const openInNewTab = () => {
  window.open(getCurrentAudioUrl(), '_blank')
}

const handleAudioError = () => {
  audioErrorMessage.value = '音频加载失败，可能是由于跨域限制。请尝试以下方法：'
}

const showSuccess = (message) => {
  exportStatus.value = message
  setTimeout(() => {
    exportStatus.value = ''
  }, 4000)
}

const showError = (message) => {
  exportError.value = message
  setTimeout(() => {
    exportError.value = ''
  }, 5000)
}

const closePreview = () => {
  showAudioPreview.value = false
  audioErrorMessage.value = ''
  isIframeMode.value = false
  useAlternativeUrl.value = false
}

onUnmounted(() => {
  closePreview()
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold text-gray-700">导出选项</h2>
      <button
        @click="showInfo = !showInfo"
        class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        title="关于导出功能"
      >
        <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </button>
    </div>
    
    <div
      v-if="showInfo"
      class="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-100"
    >
      <h3 class="text-sm font-medium text-blue-700 mb-2">音频导出说明</h3>
      <div class="text-sm text-blue-600 space-y-2">
        <p><strong>MP3 音频导出：</strong></p>
        <ul class="list-disc list-inside ml-4 space-y-1">
          <li>文本长度 ≤ 200 字符：直接导出为单个 MP3 文件</li>
          <li>文本长度 > 200 字符：自动分段导出为多个 MP3 文件</li>
          <li>使用 Google TTS 服务，支持中英文等多种语言</li>
        </ul>
        <p class="mt-2"><strong>注意事项：</strong></p>
        <ul class="list-disc list-inside ml-4 space-y-1">
          <li>需要访问 Google 服务（可能需要网络代理）</li>
          <li>预览功能可能受浏览器 CORS 策略限制</li>
          <li>如果无法预览，可以直接下载或在新标签页打开</li>
        </ul>
      </div>
    </div>
    
    <div
      v-if="showSegmentWarning && !showInfo"
      class="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200"
    >
      <div class="flex items-start gap-2">
        <svg class="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
        </svg>
        <div class="text-sm text-amber-700">
          <p class="font-medium">文本较长（{{ textLength }} 字符）</p>
          <p class="mt-1">将自动分为 {{ requiredSegments }} 段导出为多个音频文件</p>
        </div>
      </div>
    </div>
    
    <div class="space-y-6">
      <div>
        <h3 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
          </svg>
          音频导出
        </h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            @click="exportAsAudio"
            :disabled="!canExport || isExporting"
            class="flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all"
            :class="{
              'border-green-200 hover:border-green-400 hover:bg-green-50 cursor-pointer': canExport && !isExporting,
              'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50': !canExport || isExporting
            }"
          >
            <div v-if="isExporting" class="w-8 h-8 mb-2">
              <svg class="w-8 h-8 text-green-500 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <svg v-else class="w-8 h-8 mb-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm font-medium" :class="canExport && !isExporting ? 'text-gray-700' : 'text-gray-400'">
              {{ isExporting ? '导出中...' : '导出 MP3' }}
            </span>
            <span class="text-xs text-gray-400 mt-1">
              {{ isExporting ? `第 ${currentSegment}/${totalSegments} 段` : (canUseGoogleTTS ? '单文件' : `分为 ${requiredSegments} 段`) }}
            </span>
          </button>
          
          <button
            @click="previewAudio"
            :disabled="!canExport || !canUseGoogleTTS"
            class="flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all"
            :class="{
              'border-purple-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer': canExport && canUseGoogleTTS,
              'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50': !canExport || !canUseGoogleTTS
            }"
          >
            <svg class="w-8 h-8 mb-2" :class="canExport && canUseGoogleTTS ? 'text-purple-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-sm font-medium" :class="canExport && canUseGoogleTTS ? 'text-gray-700' : 'text-gray-400'">预览音频</span>
            <span class="text-xs text-gray-400 mt-1">{{ canUseGoogleTTS ? '在线预览' : '仅短文本支持' }}</span>
          </button>
        </div>
        
        <div v-if="isExporting && exportProgress > 0" class="mt-4">
          <div class="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>导出进度</span>
            <span>{{ exportProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              class="bg-green-500 h-2.5 rounded-full transition-all duration-300"
              :style="{ width: `${exportProgress}%` }"
            ></div>
          </div>
        </div>
      </div>
      
      <div class="border-t pt-6">
        <h3 class="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"></path>
          </svg>
          其他导出
        </h3>
        
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            @click="exportAsText"
            :disabled="!canExport"
            class="flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all"
            :class="{
              'border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer': canExport,
              'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50': !canExport
            }"
          >
            <svg class="w-6 h-6 mb-1" :class="canExport ? 'text-blue-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span class="text-xs font-medium" :class="canExport ? 'text-gray-700' : 'text-gray-400'">文本 .txt</span>
          </button>
          
          <button
            @click="exportAsSRT"
            :disabled="!canExport"
            class="flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all"
            :class="{
              'border-gray-200 hover:border-purple-400 hover:bg-purple-50 cursor-pointer': canExport,
              'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50': !canExport
            }"
          >
            <svg class="w-6 h-6 mb-1" :class="canExport ? 'text-purple-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
            </svg>
            <span class="text-xs font-medium" :class="canExport ? 'text-gray-700' : 'text-gray-400'">字幕 .srt</span>
          </button>
          
          <button
            @click="exportConfig"
            :disabled="!canExport"
            class="flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all"
            :class="{
              'border-gray-200 hover:border-green-400 hover:bg-green-50 cursor-pointer': canExport,
              'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50': !canExport
            }"
          >
            <svg class="w-6 h-6 mb-1" :class="canExport ? 'text-green-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="text-xs font-medium" :class="canExport ? 'text-gray-700' : 'text-gray-400'">配置 .json</span>
          </button>
          
          <button
            @click="copyToClipboard"
            :disabled="!canExport"
            class="flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all"
            :class="{
              'border-gray-200 hover:border-orange-400 hover:bg-orange-50 cursor-pointer': canExport,
              'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50': !canExport
            }"
          >
            <svg class="w-6 h-6 mb-1" :class="canExport ? 'text-orange-500' : 'text-gray-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
            </svg>
            <span class="text-xs font-medium" :class="canExport ? 'text-gray-700' : 'text-gray-400'">复制文本</span>
          </button>
        </div>
      </div>
    </div>
    
    <div v-if="exportStatus" class="mt-4">
      <div class="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
        <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
        </svg>
        <span class="text-sm text-green-700">{{ exportStatus }}</span>
      </div>
    </div>
    
    <div v-if="exportError" class="mt-4">
      <div class="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-200">
        <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
        </svg>
        <span class="text-sm text-red-700">{{ exportError }}</span>
      </div>
    </div>
    
    <div v-if="!canExport" class="mt-4 p-4 bg-gray-50 rounded-lg text-center">
      <p class="text-sm text-gray-500">请先输入文本内容后再使用导出功能</p>
    </div>
    
    <div
      v-if="showAudioPreview"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      @click.self="closePreview"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div class="flex items-center justify-between p-4 border-b">
          <h3 class="text-lg font-semibold text-gray-700">音频预览</h3>
          <button
            @click="closePreview"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="p-6">
          <div class="mb-4">
            <div class="flex gap-2 mb-3">
              <button
                @click="switchToAudioMode"
                class="flex-1 px-3 py-2 text-sm rounded-lg transition-colors"
                :class="{
                  'bg-purple-100 text-purple-700 font-medium': !isIframeMode,
                  'bg-gray-100 text-gray-600 hover:bg-gray-200': isIframeMode
                }"
              >
                音频播放器
              </button>
              <button
                @click="switchToIframeMode"
                class="flex-1 px-3 py-2 text-sm rounded-lg transition-colors"
                :class="{
                  'bg-purple-100 text-purple-700 font-medium': isIframeMode,
                  'bg-gray-100 text-gray-600 hover:bg-gray-200': !isIframeMode
                }"
              >
                嵌入模式
              </button>
            </div>
            
            <div class="flex gap-2 mb-3">
              <button
                @click="switchUrl"
                class="flex-1 px-3 py-2 text-sm rounded-lg border transition-colors"
                :class="{
                  'border-blue-300 bg-blue-50 text-blue-700': !useAlternativeUrl,
                  'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100': useAlternativeUrl
                }"
              >
                {{ useAlternativeUrl ? '国际服务' : '国内服务' }}
              </button>
              <button
                @click="openInNewTab"
                class="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                新标签页打开
              </button>
            </div>
            
            <div v-if="!isIframeMode" class="bg-gray-50 rounded-lg p-4">
              <audio 
                :src="getCurrentAudioUrl()" 
                controls 
                class="w-full"
                preload="auto"
                @error="handleAudioError"
              >
                您的浏览器不支持音频播放
              </audio>
            </div>
            
            <div v-else class="bg-gray-50 rounded-lg p-4">
              <iframe 
                :src="getCurrentAudioUrl()"
                class="w-full h-24 border-0 rounded-lg bg-white"
                allow="autoplay"
              ></iframe>
            </div>
          </div>
          
          <div v-if="audioErrorMessage" class="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <p class="text-sm text-amber-700 font-medium mb-2">{{ audioErrorMessage }}</p>
            <ul class="text-sm text-amber-600 space-y-1 list-disc list-inside">
              <li>尝试切换到"嵌入模式"</li>
              <li>尝试切换"国内服务"或"国际服务"</li>
              <li>点击"新标签页打开"直接在浏览器中播放</li>
              <li>点击下方"下载音频"按钮保存文件</li>
            </ul>
          </div>
          
          <div class="text-sm text-gray-600">
            <p class="mb-2"><strong>提示：</strong></p>
            <ul class="list-disc list-inside space-y-1 text-gray-500">
              <li>预览功能依赖 Google TTS 服务，可能需要网络代理</li>
              <li>如果无法播放，可以直接下载音频文件</li>
              <li>下载的 MP3 文件可以在任何播放器中播放</li>
            </ul>
          </div>
        </div>
        
        <div class="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            @click="closePreview"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            关闭
          </button>
          <a
            :href="getCurrentAudioUrl()"
            download="speech.mp3"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            target="_blank"
          >
            下载音频
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
