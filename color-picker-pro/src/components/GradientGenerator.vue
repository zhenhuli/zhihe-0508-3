<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-white text-lg font-semibold">三色渐变</h2>
      <button
        @click="generateGradient"
        class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-lg transition-colors"
      >
        随机生成
      </button>
    </div>

    <div class="relative h-32 rounded-xl mb-6 overflow-hidden">
      <div class="absolute inset-0" :style="gradientStyle"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div class="absolute bottom-3 left-3 text-white font-mono text-sm">
        {{ gradientCss }}
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 mb-6">
      <div v-for="(color, index) in gradientColors" :key="index" class="space-y-2">
        <label class="text-white/60 text-xs">颜色 {{ index + 1 }}</label>
        <div class="flex items-center gap-2">
          <input
            type="color"
            :value="color"
            @input="updateGradientColor(index, $event.target.value)"
            class="w-10 h-10 rounded-lg cursor-pointer border-none bg-transparent"
          />
          <input
            type="text"
            :value="color.toUpperCase()"
            @input="updateGradientColorHex(index, $event.target.value)"
            class="flex-1 bg-white/5 border-none outline-none text-white font-mono text-sm px-3 py-2 rounded-lg uppercase"
          />
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div>
        <label class="text-white/60 text-xs mb-2 block">渐变方向</label>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="direction in directions"
            :key="direction.value"
            @click="gradientDirection = direction.value"
            class="px-3 py-2 text-xs rounded-lg transition-all"
            :class="gradientDirection === direction.value ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'"
          >
            {{ direction.label }}
          </button>
        </div>
      </div>

      <div>
        <label class="text-white/60 text-xs mb-2 block">渐变类型</label>
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="type in gradientTypes"
            :key="type.value"
            @click="gradientType = type.value"
            class="px-4 py-2 text-sm rounded-lg transition-all"
            :class="gradientType === type.value ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
    </div>

    <button
      @click="copyGradient"
      class="mt-4 w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium rounded-xl transition-all shadow-lg hover:shadow-xl"
    >
      {{ copied ? '已复制!' : '复制CSS代码' }}
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { isValidHex } from '../utils/colorConverter'

const gradientColors = ref(['#FF6B6B', '#4ECDC4', '#45B7D1'])
const gradientDirection = ref('to right')
const gradientType = ref('linear')
const copied = ref(false)

const directions = [
  { label: '→', value: 'to right' },
  { label: '←', value: 'to left' },
  { label: '↑', value: 'to top' },
  { label: '↓', value: 'to bottom' },
]

const gradientTypes = [
  { label: '线性', value: 'linear' },
  { label: '径向', value: 'radial' },
]

const gradientStyle = computed(() => {
  const colors = gradientColors.value.join(', ')
  if (gradientType.value === 'linear') {
    return {
      background: `linear-gradient(${gradientDirection.value}, ${colors})`
    }
  } else {
    return {
      background: `radial-gradient(circle, ${colors})`
    }
  }
})

const gradientCss = computed(() => {
  const colors = gradientColors.value.join(', ')
  if (gradientType.value === 'linear') {
    return `background: linear-gradient(${gradientDirection.value}, ${colors});`
  } else {
    return `background: radial-gradient(circle, ${colors});`
  }
})

function updateGradientColor(index, value) {
  gradientColors.value[index] = value
}

function updateGradientColorHex(index, value) {
  const hex = value.startsWith('#') ? value : '#' + value
  if (isValidHex(hex)) {
    gradientColors.value[index] = hex.toLowerCase()
  }
}

function generateGradient() {
  const colors = []
  for (let i = 0; i < 3; i++) {
    const hue = Math.floor(Math.random() * 360)
    colors.push(`hsl(${hue}, 70%, 55%)`)
  }
  gradientColors.value = colors
}

function copyGradient() {
  navigator.clipboard.writeText(gradientCss.value).then(() => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  })
}
</script>
