<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <h2 class="text-white text-lg font-semibold">专业取色器</h2>
        <div class="flex gap-1 bg-white/10 rounded-lg p-1">
          <button
            v-for="mode in pickerModes"
            :key="mode.value"
            @click="currentMode = mode.value"
            class="px-3 py-1.5 text-xs rounded-md transition-all"
            :class="currentMode === mode.value ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white/80'"
          >
            {{ mode.label }}
          </button>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button
          @click="activatePicker"
          class="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white/80 text-sm rounded-lg transition-all"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          吸管
        </button>
        <div class="w-12 h-12 rounded-full shadow-lg ring-4 ring-white/20" :style="{ backgroundColor: currentHex }"></div>
      </div>
    </div>

    <div v-if="currentMode === 'linear'" class="space-y-6">
      <div class="relative">
        <div class="w-full h-48 rounded-xl overflow-hidden shadow-lg">
          <div class="w-full h-full" :style="gradientStyle"></div>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          :value="hsl.h"
          @input="updateHue"
          class="absolute bottom -translate-y-3 left-0 right-0 w-full h-2 appearance-none cursor-pointer rounded-full bg-gradient-to-r from-red via-yellow via-green via-cyan via-blue via-purple to-red"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-white/60 text-sm">饱和度</span>
            <span class="text-white font-mono">{{ hsl.s }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            :value="hsl.s"
            @input="updateHslS"
            class="w-full h-2 appearance-none cursor-pointer rounded-full"
            :style="{ background: `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))` }"
          />
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-white/60 text-sm">亮度</span>
            <span class="text-white font-mono">{{ hsl.l }}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            :value="hsl.l"
            @input="updateHslL"
            class="w-full h-2 appearance-none cursor-pointer rounded-full"
            :style="{ background: `linear-gradient(to right, hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))` }"
          />
        </div>
      </div>
    </div>

    <div v-else-if="currentMode === 'wheel'" class="flex justify-center mb-6">
      <div class="relative">
        <canvas
          ref="wheelCanvas"
          :width="wheelSize"
          :height="wheelSize"
          class="rounded-full cursor-crosshair"
          @mousedown="startWheelDrag"
          @mousemove="onWheelDrag"
          @mouseup="stopWheelDrag"
          @mouseleave="stopWheelDrag"
        ></canvas>
        <div
          class="absolute w-5 h-5 rounded-full border-2 border-white shadow-lg pointer-events-none"
          :style="{
            left: `${pointerX - 10}px`,
            top: `${pointerY - 10}px`,
            backgroundColor: 'transparent'
          }"
        ></div>
      </div>
    </div>

    <div v-else-if="currentMode === 'palette'" class="grid grid-cols-6 gap-2 mb-6">
      <div
        v-for="preset in presetColors"
        :key="preset"
        @click="selectPreset(preset)"
        class="aspect-square rounded-lg cursor-pointer transition-transform hover:scale-110 shadow-md"
        :style="{ backgroundColor: preset }"
        :title="preset"
      ></div>
    </div>

    <div class="space-y-4">
      <div class="grid grid-cols-3 gap-4">
        <div class="bg-white/5 rounded-xl p-4">
          <label class="text-white/60 text-sm mb-2 block">HEX</label>
          <div class="flex items-center gap-2">
            <span class="text-white/40">#</span>
            <input
              type="text"
              :value="hexInput"
              @input="updateHex"
              class="bg-transparent border-none outline-none text-white font-mono text-lg w-full uppercase"
              maxlength="6"
            />
          </div>
        </div>

        <div class="bg-white/5 rounded-xl p-4">
          <label class="text-white/60 text-sm mb-2 block">HSL</label>
          <div class="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="360"
              :value="hsl.h"
              @input="updateHslH"
              class="bg-transparent border-none outline-none text-white font-mono text-lg w-14"
            />
            <span class="text-white/40">°</span>
          </div>
        </div>

        <div class="bg-white/5 rounded-xl p-4">
          <label class="text-white/60 text-sm mb-2 block">RGB</label>
          <div class="flex items-center gap-1">
            <input
              type="number"
              min="0"
              max="255"
              :value="rgb.r"
              @input="updateRgbR"
              class="bg-transparent border-none outline-none text-white font-mono text-lg w-12"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <input
          type="number"
          min="0"
          max="255"
          :value="rgb.g"
          @input="updateRgbG"
          class="bg-white/5 rounded-lg p-3 border-none outline-none text-white font-mono text-center"
          placeholder="G"
        />
        <input
          type="number"
          min="0"
          max="255"
          :value="rgb.b"
          @input="updateRgbB"
          class="bg-white/5 rounded-lg p-3 border-none outline-none text-white font-mono text-center"
          placeholder="B"
        />
      </div>
    </div>

    <div v-if="pickedColor" class="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg" :style="{ backgroundColor: pickedColor }"></div>
      <div>
        <div class="text-green-400 text-sm font-medium">吸管取色成功</div>
        <div class="text-white/60 text-xs font-mono">{{ pickedColor.toUpperCase() }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, isValidHex } from '../utils/colorConverter'

const emit = defineEmits(['colorChange'])

const pickerModes = [
  { label: '线性', value: 'linear' },
  { label: '色轮', value: 'wheel' },
  { label: '调色板', value: 'palette' }
]

const currentMode = ref('linear')
const hexInput = ref('3B82F6')
const rgb = ref({ r: 59, g: 130, b: 246 })
const hsl = ref({ h: 217, s: 90, l: 60 })
const pickedColor = ref(null)

const wheelSize = 280
const wheelCenter = wheelSize / 2
const wheelRadius = wheelSize / 2 - 10
const innerRadius = wheelSize / 4

const wheelCanvas = ref(null)
const isDragging = ref(false)

const currentHex = computed(() => `#${hexInput.value}`)

const gradientStyle = computed(() => ({
  background: `linear-gradient(to right, hsl(${hsl.value.h}, 100%, 50%), hsl(${hsl.value.h}, 0%, 50%)), linear-gradient(to bottom, transparent, hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%))`,
  backgroundBlendMode: 'multiply'
}))

const pointerX = computed(() => {
  const angle = (hsl.value.h / 360) * 2 * Math.PI - Math.PI / 2
  const radius = (hsl.value.s / 100) * (wheelRadius - innerRadius) + innerRadius
  return wheelCenter + Math.cos(angle) * radius
})

const pointerY = computed(() => {
  const angle = (hsl.value.h / 360) * 2 * Math.PI - Math.PI / 2
  const radius = (hsl.value.s / 100) * (wheelRadius - innerRadius) + innerRadius
  return wheelCenter + Math.sin(angle) * radius
})

const presetColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
  '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000', '#808080',
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8B500', '#FF69B4'
]

function drawColorWheel() {
  const canvas = wheelCanvas.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  
  const centerX = wheelCenter
  const centerY = wheelCenter
  const radius = wheelRadius
  
  const imageData = ctx.createImageData(wheelSize, wheelSize)
  const data = imageData.data
  
  for (let y = 0; y < wheelSize; y++) {
    for (let x = 0; x < wheelSize; x++) {
      const dx = x - centerX
      const dy = y - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance <= radius) {
        if (distance <= innerRadius) {
          const intensity = 1 - (distance / innerRadius)
          const r = Math.round((rgb.value.r * intensity + 255 * (1 - intensity)))
          const g = Math.round((rgb.value.g * intensity + 255 * (1 - intensity)))
          const b = Math.round((rgb.value.b * intensity + 255 * (1 - intensity)))
          
          const i = (y * wheelSize + x) * 4
          data[i] = r
          data[i + 1] = g
          data[i + 2] = b
          data[i + 3] = 255
        } else {
          const angle = Math.atan2(dy, dx) + Math.PI
          const hue = (angle / (2 * Math.PI)) * 360
          const saturation = ((distance - innerRadius) / (radius - innerRadius)) * 100
          const lightness = hsl.value.l
          
          const rgbColor = hslToRgb(hue, saturation, lightness)
          
          const i = (y * wheelSize + x) * 4
          data[i] = rgbColor.r
          data[i + 1] = rgbColor.g
          data[i + 2] = rgbColor.b
          data[i + 3] = 255
        }
      } else {
        const i = (y * wheelSize + x) * 4
        data[i] = 0
        data[i + 1] = 0
        data[i + 2] = 0
        data[i + 3] = 0
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0)
  
  ctx.beginPath()
  ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
  ctx.lineWidth = 1
  ctx.stroke()
}

function updateHex(e) {
  const value = e.target.value.toUpperCase()
  if (isValidHex(value) || value === '') {
    hexInput.value = value
    if (value) {
      const newRgb = hexToRgb(`#${value}`)
      rgb.value = newRgb
      hsl.value = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)
      if (currentMode.value === 'wheel') {
        nextTick(drawColorWheel)
      }
      emit('colorChange', `#${value}`)
    }
  }
}

function updateRgbR(e) {
  const value = Math.min(255, Math.max(0, parseInt(e.target.value) || 0))
  rgb.value = { ...rgb.value, r: value }
  hexInput.value = rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b).slice(1)
  hsl.value = rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b)
  if (currentMode.value === 'wheel') {
    nextTick(drawColorWheel)
  }
  emit('colorChange', `#${hexInput.value}`)
}

function updateRgbG(e) {
  const value = Math.min(255, Math.max(0, parseInt(e.target.value) || 0))
  rgb.value = { ...rgb.value, g: value }
  hexInput.value = rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b).slice(1)
  hsl.value = rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b)
  if (currentMode.value === 'wheel') {
    nextTick(drawColorWheel)
  }
  emit('colorChange', `#${hexInput.value}`)
}

function updateRgbB(e) {
  const value = Math.min(255, Math.max(0, parseInt(e.target.value) || 0))
  rgb.value = { ...rgb.value, b: value }
  hexInput.value = rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b).slice(1)
  hsl.value = rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b)
  if (currentMode.value === 'wheel') {
    nextTick(drawColorWheel)
  }
  emit('colorChange', `#${hexInput.value}`)
}

function updateHslH(e) {
  const value = Math.min(360, Math.max(0, parseInt(e.target.value) || 0))
  hsl.value = { ...hsl.value, h: value }
  const newRgb = hslToRgb(hsl.value.h, hsl.value.s, hsl.value.l)
  rgb.value = newRgb
  hexInput.value = rgbToHex(newRgb.r, newRgb.g, newRgb.b).slice(1)
  if (currentMode.value === 'wheel') {
    nextTick(drawColorWheel)
  }
  emit('colorChange', `#${hexInput.value}`)
}

function updateHslS(e) {
  const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
  hsl.value = { ...hsl.value, s: value }
  const newRgb = hslToRgb(hsl.value.h, hsl.value.s, hsl.value.l)
  rgb.value = newRgb
  hexInput.value = rgbToHex(newRgb.r, newRgb.g, newRgb.b).slice(1)
  if (currentMode.value === 'wheel') {
    nextTick(drawColorWheel)
  }
  emit('colorChange', `#${hexInput.value}`)
}

function updateHslL(e) {
  const value = Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
  hsl.value = { ...hsl.value, l: value }
  const newRgb = hslToRgb(hsl.value.h, hsl.value.s, hsl.value.l)
  rgb.value = newRgb
  hexInput.value = rgbToHex(newRgb.r, newRgb.g, newRgb.b).slice(1)
  if (currentMode.value === 'wheel') {
    nextTick(drawColorWheel)
  }
  emit('colorChange', `#${hexInput.value}`)
}

function updateHue(e) {
  updateHslH(e)
}

function selectPreset(preset) {
  hexInput.value = preset.slice(1)
  const newRgb = hexToRgb(preset)
  rgb.value = newRgb
  hsl.value = rgbToHsl(newRgb.r, newRgb.g, newRgb.b)
  if (currentMode.value === 'wheel') {
    nextTick(drawColorWheel)
  }
  emit('colorChange', preset)
}

function startWheelDrag(e) {
  isDragging.value = true
  updateWheelColor(e)
}

function onWheelDrag(e) {
  if (isDragging.value) {
    updateWheelColor(e)
  }
}

function stopWheelDrag() {
  isDragging.value = false
}

function updateWheelColor(e) {
  const canvas = wheelCanvas.value
  if (!canvas) return
  
  const rect = canvas.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const dx = x - wheelCenter
  const dy = y - wheelCenter
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance <= wheelRadius && distance >= innerRadius) {
    let angle = Math.atan2(dy, dx) + Math.PI
    const hue = Math.round((angle / (2 * Math.PI)) * 360)
    
    const saturation = Math.round(((distance - innerRadius) / (wheelRadius - innerRadius)) * 100)
    
    hsl.value = { ...hsl.value, h: hue, s: saturation }
    const newRgb = hslToRgb(hsl.value.h, hsl.value.s, hsl.value.l)
    rgb.value = newRgb
    hexInput.value = rgbToHex(newRgb.r, newRgb.g, newRgb.b).slice(1)
    nextTick(drawColorWheel)
    emit('colorChange', `#${hexInput.value}`)
  }
}

async function activatePicker() {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: 'monitor' },
      audio: false
    })

    const video = document.createElement('video')
    video.srcObject = stream
    video.autoplay = true
    video.playsInline = true

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      const pickerOverlay = document.createElement('div')
      pickerOverlay.id = 'color-picker-overlay'
      pickerOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        cursor: crosshair;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
      `
      pickerOverlay.innerHTML = `
        <div style="color: white; font-size: 18px; text-align: center;">
          <div style="margin-bottom: 10px;">点击任意位置取色</div>
          <div style="font-size: 14px; opacity: 0.7;">按 ESC 取消</div>
        </div>
      `
      document.body.appendChild(pickerOverlay)

      pickerOverlay.addEventListener('click', (e) => {
        const rect = pickerOverlay.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const pixel = ctx.getImageData(Math.round(x * (video.videoWidth / window.innerWidth)), Math.round(y * (video.videoHeight / window.innerHeight)), 1, 1).data
        const r = pixel[0]
        const g = pixel[1]
        const b = pixel[2]

        const color = '#' + [r, g, b].map(c => {
          const hex = c.toString(16)
          return hex.length === 1 ? '0' + hex : hex
        }).join('').toUpperCase()

        pickedColor.value = color
        hexInput.value = color.slice(1)
        rgb.value = { r, g, b }
        hsl.value = rgbToHsl(r, g, b)
        if (currentMode.value === 'wheel') {
          nextTick(drawColorWheel)
        }
        emit('colorChange', color)

        setTimeout(() => {
          pickedColor.value = null
        }, 3000)

        stream.getTracks().forEach(track => track.stop())
        document.body.removeChild(pickerOverlay)
      })

      document.addEventListener('keydown', function handleEscape(e) {
        if (e.key === 'Escape') {
          stream.getTracks().forEach(track => track.stop())
          document.body.removeChild(pickerOverlay)
          document.removeEventListener('keydown', handleEscape)
        }
      })
    })
  } catch (err) {
    console.error('无法获取屏幕:', err)
    alert('无法获取屏幕权限，请检查浏览器设置')
  }
}

watch(currentMode, (newMode) => {
  if (newMode === 'wheel') {
    nextTick(drawColorWheel)
  }
})

watch([rgb, hsl], () => {
  if (currentMode.value === 'wheel') {
    nextTick(drawColorWheel)
  }
  emit('colorChange', `#${hexInput.value}`)
}, { deep: true })

onMounted(() => {
  if (currentMode.value === 'wheel') {
    drawColorWheel()
  }
})
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>
