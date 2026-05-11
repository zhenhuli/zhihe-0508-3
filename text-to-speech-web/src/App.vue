<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import TextInput from './components/TextInput.vue'
import VoiceSelector from './components/VoiceSelector.vue'
import ControlPanel from './components/ControlPanel.vue'
import ExportPanel from './components/ExportPanel.vue'

const text = ref('')
const selectedVoice = ref(null)
const rate = ref(1)
const pitch = ref(1)
const volume = ref(1)
const voices = ref([])
const isPlaying = ref(false)
const isPaused = ref(false)
const currentSegmentIndex = ref(-1)
const utterance = ref(null)
const segments = ref([])

const speechSynthesis = window.speechSynthesis

const loadVoices = () => {
  const availableVoices = speechSynthesis.getVoices()
  voices.value = availableVoices
  if (availableVoices.length > 0 && !selectedVoice.value) {
    const chineseVoice = availableVoices.find(v => v.lang.includes('zh'))
    selectedVoice.value = chineseVoice || availableVoices[0]
  }
}

const splitIntoSegments = (inputText) => {
  if (!inputText.trim()) return []
  const sentences = inputText.split(/([。！？\n\r]+)/).filter(s => s.trim())
  const result = []
  let currentSegment = ''
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i]
    if (currentSegment.length + sentence.length > 200) {
      if (currentSegment.trim()) result.push(currentSegment.trim())
      currentSegment = sentence
    } else {
      currentSegment += sentence
    }
  }
  
  if (currentSegment.trim()) {
    result.push(currentSegment.trim())
  }
  
  return result
}

const playSegment = (index) => {
  if (index >= segments.value.length) {
    isPlaying.value = false
    currentSegmentIndex.value = -1
    return
  }
  
  currentSegmentIndex.value = index
  const segmentText = segments.value[index]
  
  utterance.value = new SpeechSynthesisUtterance(segmentText)
  utterance.value.voice = selectedVoice.value
  utterance.value.rate = rate.value
  utterance.value.pitch = pitch.value
  utterance.value.volume = volume.value
  
  utterance.value.onend = () => {
    if (isPlaying.value && !isPaused.value) {
      playSegment(index + 1)
    }
  }
  
  utterance.value.onerror = () => {
    isPlaying.value = false
    isPaused.value = false
    currentSegmentIndex.value = -1
  }
  
  speechSynthesis.speak(utterance.value)
}

const play = () => {
  if (!text.value.trim()) return
  
  if (isPaused.value) {
    speechSynthesis.resume()
    isPaused.value = false
    return
  }
  
  speechSynthesis.cancel()
  segments.value = splitIntoSegments(text.value)
  
  if (segments.value.length === 0) return
  
  isPlaying.value = true
  isPaused.value = false
  playSegment(0)
}

const pause = () => {
  if (isPlaying.value) {
    speechSynthesis.pause()
    isPaused.value = true
  }
}

const stop = () => {
  speechSynthesis.cancel()
  isPlaying.value = false
  isPaused.value = false
  currentSegmentIndex.value = -1
}

const playSegmentByIndex = (index) => {
  speechSynthesis.cancel()
  segments.value = splitIntoSegments(text.value)
  
  if (index >= 0 && index < segments.value.length) {
    isPlaying.value = true
    isPaused.value = false
    playSegment(index)
  }
}

const handleCopyText = async (copiedText) => {
  text.value += copiedText
}

watch(text, () => {
  segments.value = splitIntoSegments(text.value)
})

onMounted(() => {
  loadVoices()
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">在线文本转语音工具</h1>
        <p class="text-gray-600">使用 Web Speech API 实现免费的文本转语音功能</p>
      </header>
      
      <div class="space-y-6">
        <TextInput 
          v-model="text" 
          :segments="segments"
          :currentSegmentIndex="currentSegmentIndex"
          @play-segment="playSegmentByIndex"
          @copy-text="handleCopyText"
        />
        
        <VoiceSelector 
          v-model="selectedVoice"
          :voices="voices"
        />
        
        <ControlPanel 
          :rate="rate"
          :pitch="pitch"
          :volume="volume"
          :isPlaying="isPlaying"
          :isPaused="isPaused"
          @update:rate="rate = $event"
          @update:pitch="pitch = $event"
          @update:volume="volume = $event"
          @play="play"
          @pause="pause"
          @stop="stop"
        />
        
        <ExportPanel 
          :text="text"
          :selectedVoice="selectedVoice"
          :rate="rate"
          :pitch="pitch"
          :volume="volume"
        />
      </div>
      
      <footer class="mt-12 text-center text-gray-500 text-sm">
        <p>提示：语音合成效果取决于浏览器支持的语音引擎。导出功能需要浏览器支持 MediaRecorder API。</p>
      </footer>
    </div>
  </div>
</template>
