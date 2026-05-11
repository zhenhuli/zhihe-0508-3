<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null
  },
  voices: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')

const filteredVoices = computed(() => {
  if (!searchQuery.value) return props.voices
  const query = searchQuery.value.toLowerCase()
  return props.voices.filter(voice => 
    voice.name.toLowerCase().includes(query) || 
    voice.lang.toLowerCase().includes(query)
  )
})

const groupedVoices = computed(() => {
  const groups = {
    chinese: [],
    english: [],
    other: []
  }
  
  filteredVoices.value.forEach(voice => {
    if (voice.lang.includes('zh')) {
      groups.chinese.push(voice)
    } else if (voice.lang.includes('en')) {
      groups.english.push(voice)
    } else {
      groups.other.push(voice)
    }
  })
  
  return groups
})

const selectVoice = (voice) => {
  emit('update:modelValue', voice)
}

const getVoiceLabel = (voice) => {
  return `${voice.name} (${voice.lang})${voice.default ? ' - 默认' : ''}`
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">选择语音音色</h2>
    
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索语音..."
        class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    
    <div class="space-y-4 max-h-80 overflow-y-auto pr-2">
      <div v-if="groupedVoices.chinese.length > 0">
        <h3 class="text-sm font-medium text-gray-500 mb-2">中文语音</h3>
        <div class="space-y-1">
          <button
            v-for="voice in groupedVoices.chinese"
            :key="voice.name"
            @click="selectVoice(voice)"
            class="w-full text-left px-3 py-2 rounded-lg transition-all text-sm"
            :class="{
              'bg-blue-50 border-2 border-blue-500 text-blue-700': modelValue?.name === voice.name,
              'bg-gray-50 hover:bg-gray-100 border-2 border-transparent text-gray-700': modelValue?.name !== voice.name
            }"
          >
            <div class="flex items-center justify-between">
            <span>{{ voice.name }}</span>
            <span class="text-xs text-gray-400">{{ voice.lang }}</span>
            </div>
          </button>
        </div>
      </div>
      
      <div v-if="groupedVoices.english.length > 0">
        <h3 class="text-sm font-medium text-gray-500 mb-2">英文语音</h3>
        <div class="space-y-1">
          <button
            v-for="voice in groupedVoices.english"
            :key="voice.name"
            @click="selectVoice(voice)"
            class="w-full text-left px-3 py-2 rounded-lg transition-all text-sm"
            :class="{
              'bg-blue-50 border-2 border-blue-500 text-blue-700': modelValue?.name === voice.name,
              'bg-gray-50 hover:bg-gray-100 border-2 border-transparent text-gray-700': modelValue?.name !== voice.name
            }"
          >
            <div class="flex items-center justify-between">
            <span>{{ voice.name }}</span>
            <span class="text-xs text-gray-400">{{ voice.lang }}</span>
            </div>
          </button>
        </div>
      </div>
      
      <div v-if="groupedVoices.other.length > 0">
        <h3 class="text-sm font-medium text-gray-500 mb-2">其他语言</h3>
        <div class="space-y-1">
          <button
            v-for="voice in groupedVoices.other"
            :key="voice.name"
            @click="selectVoice(voice)"
            class="w-full text-left px-3 py-2 rounded-lg transition-all text-sm"
            :class="{
              'bg-blue-50 border-2 border-blue-500 text-blue-700': modelValue?.name === voice.name,
              'bg-gray-50 hover:bg-gray-100 border-2 border-transparent text-gray-700': modelValue?.name !== voice.name
            }"
          >
            <div class="flex items-center justify-between">
            <span>{{ voice.name }}</span>
            <span class="text-xs text-gray-400">{{ voice.lang }}</span>
            </div>
          </button>
        </div>
      </div>
      
      <div v-if="filteredVoices.length === 0" class="text-center py-8 text-gray-400">
        未找到匹配的语音
      </div>
    </div>
    
    <div v-if="modelValue" class="mt-4 p-3 bg-blue-50 rounded-lg">
      <p class="text-sm text-gray-600">
        <span class="font-medium">当前选择:</span> {{ getVoiceLabel(modelValue) }}
      </p>
    </div>
  </div>
</template>
