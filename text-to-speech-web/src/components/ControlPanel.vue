<script setup>
const props = defineProps({
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
  },
  isPlaying: {
    type: Boolean,
    default: false
  },
  isPaused: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:rate',
  'update:pitch',
  'update:volume',
  'play',
  'pause',
  'stop'
])

const updateRate = (event) => {
  emit('update:rate', parseFloat(event.target.value))
}

const updatePitch = (event) => {
  emit('update:pitch', parseFloat(event.target.value))
}

const updateVolume = (event) => {
  emit('update:volume', parseFloat(event.target.value))
}

const getRateLabel = (rate) => {
  if (rate === 0.5) return '0.5x (很慢)'
  if (rate === 0.75) return '0.75x (慢)'
  if (rate === 1) return '1.0x (正常)'
  if (rate === 1.25) return '1.25x (快)'
  if (rate === 1.5) return '1.5x (很快)'
  if (rate === 2) return '2.0x (极快)'
  return `${rate}x`
}

const getPitchLabel = (pitch) => {
  if (pitch === 0.5) return '0.5 (很低)'
  if (pitch === 0.75) return '0.75 (低)'
  if (pitch === 1) return '1.0 (正常)'
  if (pitch === 1.25) return '1.25 (高)'
  if (pitch === 1.5) return '1.5 (很高)'
  if (pitch === 2) return '2.0 (极高)'
  return `${pitch}`
}

const getVolumeLabel = (volume) => {
  const percentage = Math.round(volume * 100)
  if (volume === 0) return '0% (静音)'
  if (volume === 0.5) return '50% (中)'
  if (volume === 1) return '100% (最大)'
  return `${percentage}%`
}
</script>

<template>
  <div class="bg-white rounded-xl shadow-lg p-6">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">播放控制</h2>
    
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-600">语速</label>
            <span class="text-sm text-blue-600 font-medium">{{ getRateLabel(rate) }}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.25"
            :value="rate"
            @input="updateRate"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.5x</span>
            <span>1.0x</span>
            <span>2.0x</span>
          </div>
        </div>
        
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-600">音调</label>
            <span class="text-sm text-purple-600 font-medium">{{ getPitchLabel(pitch) }}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.25"
            :value="pitch"
            @input="updatePitch"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>0.5</span>
            <span>1.0</span>
            <span>2.0</span>
          </div>
        </div>
        
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="text-sm font-medium text-gray-600">音量</label>
            <span class="text-sm text-green-600 font-medium">{{ getVolumeLabel(volume) }}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            :value="volume"
            @input="updateVolume"
            class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div class="flex justify-between text-xs text-gray-400 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
      
      <div class="flex items-center justify-center gap-4 pt-4 border-t">
        <button
          v-if="!isPlaying || isPaused"
          @click="$emit('play')"
          class="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <svg v-if="isPaused" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
          </svg>
          {{ isPaused ? '继续' : '播放' }}
        </button>
        
        <button
          v-if="isPlaying && !isPaused"
          @click="$emit('pause')"
          class="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <rect x="5" y="4" width="3" height="12" rx="1"></rect>
            <rect x="12" y="4" width="3" height="12" rx="1"></rect>
          </svg>
          暂停
        </button>
        
        <button
          v-if="isPlaying || isPaused"
          @click="$emit('stop')"
          class="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-md hover:shadow-lg"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <rect x="5" y="5" width="10" height="10" rx="1"></rect>
          </svg>
          停止
        </button>
      </div>
      
      <div v-if="isPlaying || isPaused" class="text-center">
        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
              :class="{
                'bg-green-100 text-green-700': isPlaying && !isPaused,
                'bg-yellow-100 text-yellow-700': isPaused
              }">
          <span class="w-2 h-2 rounded-full animate-pulse"
                :class="{
                  'bg-green-500': isPlaying && !isPaused,
                  'bg-yellow-500': isPaused
                }"></span>
          {{ isPaused ? '已暂停' : '正在播放' }}
        </span>
      </div>
    </div>
  </div>
</template>
