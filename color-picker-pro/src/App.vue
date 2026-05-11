<template>
  <div class="min-h-screen py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <header class="text-center mb-10">
        <h1 class="text-4xl font-bold text-white mb-3">
          <span class="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            ColorPicker Pro
          </span>
        </h1>
        <p class="text-white/60">专业在线取色器，支持多种颜色格式转换与配色方案</p>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-6">
          <ColorPicker @color-change="handleColorChange" />
          <ColorCopy :color="currentColor" />
        </div>

        <div class="space-y-6">
          <GradientGenerator />
          <ColorHistory :color="currentColor" @select="handleColorSelect" />
          <ColorFavorites :color="currentColor" @select="handleColorSelect" />
        </div>
      </div>

      <footer class="mt-10 text-center">
        <p class="text-white/40 text-sm">
          Made with Vue3 + Vite + Tailwind CSS
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ColorPicker from './components/ColorPicker.vue'
import ColorHistory from './components/ColorHistory.vue'
import ColorFavorites from './components/ColorFavorites.vue'
import ColorCopy from './components/ColorCopy.vue'
import GradientGenerator from './components/GradientGenerator.vue'

const currentColor = ref('#3B82F6')

function handleColorChange(color) {
  currentColor.value = color
}

function handleColorSelect(color) {
  currentColor.value = color
}
</script>
