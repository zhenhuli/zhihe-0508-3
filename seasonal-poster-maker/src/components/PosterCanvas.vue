<template>
  <div class="poster-canvas-container">
    <canvas
      ref="canvasRef"
      :width="canvasWidth"
      :height="canvasHeight"
      class="poster-canvas shadow-2xl rounded-lg"
    ></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  season: { type: String, default: 'spring' },
  festival: { type: Object, default: () => ({ name: '立春', date: '2月4日' }) },
  colorPalette: { type: Array, default: () => ['#FFB7C5', '#98D8C8', '#F7DC6F', '#BB8FCE'] },
  template: { type: String, default: 'simple' },
  mainTitle: { type: String, default: '' },
  subTitle: { type: String, default: '' },
  customText: { type: String, default: '' }
})

const canvasRef = ref(null)
const canvasWidth = 600
const canvasHeight = 800

const drawPoster = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  const colors = props.colorPalette
  
  drawBackground(ctx, colors, props.template)
  drawDecorations(ctx, colors, props.season, props.template)
  drawText(ctx, colors, props.festival, props.template)
}

const drawBackground = (ctx, colors, template) => {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  
  const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight)
  gradient.addColorStop(0, colors[0])
  gradient.addColorStop(0.5, colors[1])
  gradient.addColorStop(1, colors[2])
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  
  if (template === 'festive') {
    for (let i = 0; i < 20; i++) {
      ctx.beginPath()
      ctx.arc(
        Math.random() * canvasWidth,
        Math.random() * canvasHeight,
        Math.random() * 30 + 10,
        0,
        Math.PI * 2
      )
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)] + '40'
      ctx.fill()
    }
  } else if (template === 'elegant') {
    ctx.beginPath()
    ctx.moveTo(0, canvasHeight * 0.3)
    ctx.bezierCurveTo(
      canvasWidth * 0.3, canvasHeight * 0.1,
      canvasWidth * 0.7, canvasHeight * 0.5,
      canvasWidth, canvasHeight * 0.3
    )
    ctx.lineTo(canvasWidth, canvasHeight)
    ctx.lineTo(0, canvasHeight)
    ctx.closePath()
    ctx.fillStyle = colors[3] + '60'
    ctx.fill()
  }
}

const drawDecorations = (ctx, colors, season, template) => {
  const seasonIcons = {
    spring: ['🌸', '🌷', '🌼', '🍀', '🦋'],
    summer: ['☀️', '🌻', '🦗', '🌴', '🍉'],
    autumn: ['🍂', '🍁', '🌰', '🦊', '🍎'],
    winter: ['❄️', '⛄', '🎄', '🦌', '🌟']
  }
  
  const icons = seasonIcons[season] || seasonIcons.spring
  
  if (template === 'simple' || template === 'minimalist') {
    ctx.font = '60px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(icons[0], canvasWidth / 2, 150)
  } else {
    for (let i = 0; i < 8; i++) {
      const icon = icons[i % icons.length]
      ctx.font = `${30 + Math.random() * 20}px Arial`
      ctx.fillText(
        icon,
        50 + Math.random() * (canvasWidth - 100),
        80 + Math.random() * 200
      )
    }
  }
  
  if (template !== 'minimalist') {
    ctx.beginPath()
    ctx.moveTo(50, 250)
    ctx.lineTo(canvasWidth - 50, 250)
    ctx.strokeStyle = colors[3]
    ctx.lineWidth = 2
    ctx.stroke()
    
    ctx.beginPath()
    ctx.moveTo(50, canvasHeight - 150)
    ctx.lineTo(canvasWidth - 50, canvasHeight - 150)
    ctx.stroke()
  }
}

const drawText = (ctx, colors, festival, template) => {
  const textColor = getContrastColor(colors[0])
  
  ctx.textAlign = 'center'
  
  ctx.font = template === 'festive' ? 'bold 72px "Microsoft YaHei"' : 'bold 64px "Microsoft YaHei"'
  ctx.fillStyle = textColor
  ctx.textBaseline = 'middle'
  ctx.fillText(festival.name, canvasWidth / 2, 380)
  
  ctx.font = '28px "Microsoft YaHei"'
  ctx.fillStyle = textColor
  ctx.fillText(festival.date, canvasWidth / 2, 440)
  
  if (props.mainTitle) {
    ctx.font = 'bold 36px "Microsoft YaHei"'
    ctx.fillStyle = textColor
    ctx.fillText(props.mainTitle, canvasWidth / 2, 510)
  }
  
  if (props.subTitle) {
    ctx.font = '26px "Microsoft YaHei"'
    ctx.fillStyle = textColor
    ctx.fillText(props.subTitle, canvasWidth / 2, 560)
  }
  
  if (props.customText) {
    ctx.font = '22px "Microsoft YaHei"'
    ctx.fillStyle = textColor
    const lines = wrapText(ctx, props.customText, canvasWidth - 100)
    lines.forEach((line, index) => {
      ctx.fillText(line, canvasWidth / 2, 620 + index * 35)
    })
  }
  
  ctx.font = '18px "Microsoft YaHei"'
  ctx.fillStyle = textColor
  ctx.globalAlpha = 0.7
  ctx.fillText('节气 · 传统 · 文化', canvasWidth / 2, canvasHeight - 80)
  ctx.globalAlpha = 1
}

const getContrastColor = (bgColor) => {
  const hex = bgColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#333333' : '#FFFFFF'
}

const wrapText = (ctx, text, maxWidth) => {
  const words = text.split('')
  const lines = []
  let currentLine = ''
  
  for (const char of words) {
    const testLine = currentLine + char
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine)
      currentLine = char
    } else {
      currentLine = testLine
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  return lines
}

watch(
  () => [
    props.season,
    props.festival,
    props.colorPalette,
    props.template,
    props.mainTitle,
    props.subTitle,
    props.customText
  ],
  () => {
    nextTick(() => {
      drawPoster()
    })
  },
  { deep: true, immediate: true }
)

onMounted(() => {
  drawPoster()
})

defineExpose({
  canvasRef,
  drawPoster
})
</script>

<style scoped>
.poster-canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.poster-canvas {
  background: white;
  border-radius: 12px;
}
</style>
