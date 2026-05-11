<template>
  <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/10">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-white text-lg font-semibold">吸管取色</h2>
      <button
        @click="activatePicker"
        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg transition-all shadow-lg hover:shadow-xl"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        开始取色
      </button>
    </div>

    <div v-if="pickedColor" class="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
      <div class="w-12 h-12 rounded-lg shadow-lg" :style="{ backgroundColor: pickedColor }"></div>
      <div>
        <div class="text-white font-mono text-lg">{{ pickedColor.toUpperCase() }}</div>
        <div class="text-white/60 text-sm">已获取颜色</div>
      </div>
      <button
        @click="selectPickedColor"
        class="ml-auto px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
      >
        使用此颜色
      </button>
    </div>

    <div v-else class="text-center py-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
        <svg class="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"/>
        </svg>
      </div>
      <div class="text-white/40 text-sm">点击上方按钮启动吸管</div>
      <div class="text-white/20 text-xs mt-2">启动后点击屏幕任意位置取色</div>
    </div>

    <div class="mt-4 p-3 bg-white/5 rounded-xl">
      <div class="text-white/60 text-xs mb-2">提示</div>
      <div class="text-white/40 text-xs">
        吸管取色需要浏览器权限，请确保已允许屏幕共享。取色完成后按 ESC 键退出。
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['colorPick'])

const pickedColor = ref(null)
let stream = null
let video = null
let canvas = null
let ctx = null
let animationId = null

async function activatePicker() {
  try {
    stream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: 'monitor' },
      audio: false
    })

    video = document.createElement('video')
    video.srcObject = stream
    video.autoplay = true
    video.playsInline = true

    canvas = document.createElement('canvas')
    ctx = canvas.getContext('2d')

    video.addEventListener('loadedmetadata', startCapture)

    document.addEventListener('keydown', handleEscape)
  } catch (err) {
    console.error('无法获取屏幕:', err)
    alert('无法获取屏幕权限，请检查浏览器设置')
  }
}

function startCapture() {
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

    captureColor(Math.round(x * (video.videoWidth / window.innerWidth)), Math.round(y * (video.videoHeight / window.innerHeight)))
    cleanup()
  })
}

function captureColor(x, y) {
  try {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const pixel = ctx.getImageData(x, y, 1, 1).data
    const r = pixel[0]
    const g = pixel[1]
    const b = pixel[2]
    
    pickedColor.value = '#' + [r, g, b].map(c => {
      const hex = c.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('').toUpperCase()
  } catch (err) {
    console.error('取色失败:', err)
  }
}

function selectPickedColor() {
  if (pickedColor.value) {
    emit('colorPick', pickedColor.value)
  }
}

function handleEscape(e) {
  if (e.key === 'Escape') {
    cleanup()
  }
}

function cleanup() {
  const overlay = document.getElementById('color-picker-overlay')
  if (overlay) {
    document.body.removeChild(overlay)
  }

  if (stream) {
    stream.getTracks().forEach(track => track.stop())
    stream = null
  }

  if (video) {
    video.srcObject = null
    video = null
  }

  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  document.removeEventListener('keydown', handleEscape)
}
</script>
