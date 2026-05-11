<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
    <h2 class="text-white text-lg font-semibold mb-4">格式复制</h2>

    <div class="grid grid-cols-2 gap-3">
      <button
        v-for="format in formats"
        :key="format.type"
        @click="copyColor(format.type)"
        class="group flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg shadow" :style="{ backgroundColor: color }"></div>
          <span class="text-white/80 text-sm">{{ format.label }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-white/40 text-xs font-mono">{{ format.value }}</span>
          <svg
            class="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors"
            :class="{ 'text-green-400': copied === format.type }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              v-if="copied === format.type"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { hexToRgb, rgbToHsl, rgbToString, hslToString } from '../utils/colorConverter'

const props = defineProps({
  color: {
    type: String,
    required: true
  }
})

const copied = ref(null)

const rgbValues = computed(() => hexToRgb(props.color))
const hslValues = computed(() => rgbToHsl(rgbValues.value.r, rgbValues.value.g, rgbValues.value.b))

const formats = computed(() => [
  { type: 'hex', label: 'HEX', value: props.color.toUpperCase() },
  { type: 'rgb', label: 'RGB', value: rgbToString(rgbValues.value.r, rgbValues.value.g, rgbValues.value.b) },
  { type: 'hsl', label: 'HSL', value: hslToString(hslValues.value.h, hslValues.value.s, hslValues.value.l) },
  { type: 'hex3', label: 'HEX 3位', value: shortenHex(props.color) },
  { type: 'rgba', label: 'RGBA', value: `rgba(${rgbValues.value.r}, ${rgbValues.value.g}, ${rgbValues.value.b}, 1)` },
  { type: 'hsla', label: 'HSLA', value: `hsla(${hslValues.value.h}, ${hslValues.value.s}%, ${hslValues.value.l}%, 1)` },
])

function shortenHex(hex) {
  const h = hex.replace('#', '')
  if (h[0] === h[1] && h[2] === h[3] && h[4] === h[5]) {
    return '#' + h[0] + h[2] + h[4]
  }
  return hex
}

function copyColor(type) {
  let text = ''
  switch (type) {
    case 'hex':
      text = props.color.toUpperCase()
      break
    case 'rgb':
      text = rgbToString(rgbValues.value.r, rgbValues.value.g, rgbValues.value.b)
      break
    case 'hsl':
      text = hslToString(hslValues.value.h, hslValues.value.s, hslValues.value.l)
      break
    case 'hex3':
      text = shortenHex(props.color).toUpperCase()
      break
    case 'rgba':
      text = `rgba(${rgbValues.value.r}, ${rgbValues.value.g}, ${rgbValues.value.b}, 1)`
      break
    case 'hsla':
      text = `hsla(${hslValues.value.h}, ${hslValues.value.s}%, ${hslValues.value.l}%, 1)`
      break
  }

  navigator.clipboard.writeText(text).then(() => {
    copied.value = type
    setTimeout(() => {
      copied.value = null
    }, 2000)
  })
}
</script>
