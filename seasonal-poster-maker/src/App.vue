<template>
  <div class="app min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600">
    <header class="py-6 px-8">
      <h1 class="text-4xl font-bold text-white text-center flex items-center justify-center gap-3">
        <span class="text-5xl">🎑</span>
        节日节气海报制作
        <span class="text-5xl">🎑</span>
      </h1>
      <p class="text-center text-white/80 mt-2 text-lg">
        轻松制作精美的传统节气海报
      </p>
    </header>
    
    <main class="container mx-auto px-4 pb-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1 order-2 lg:order-1">
          <ControlPanel
            :canvas-ref="posterCanvas?.canvasRef"
            @update="handleUpdate"
          />
        </div>
        
        <div class="lg:col-span-2 order-1 lg:order-2 flex justify-center items-start">
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 shadow-2xl">
            <PosterCanvas
              ref="posterCanvas"
              :season="posterConfig.season"
              :festival="posterConfig.festival"
              :color-palette="posterConfig.colorPalette"
              :template="posterConfig.template"
              :main-title="posterConfig.mainTitle"
              :sub-title="posterConfig.subTitle"
              :custom-text="posterConfig.customText"
            />
          </div>
        </div>
      </div>
    </main>
    
    <footer class="py-4 text-center text-white/60 text-sm">
      <p>传承中华传统文化 · 二十四节气</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import PosterCanvas from './components/PosterCanvas.vue'
import ControlPanel from './components/ControlPanel.vue'

const posterCanvas = ref(null)

const posterConfig = reactive({
  season: 'spring',
  festival: { id: 'lichun', name: '立春', date: '2月4日' },
  colorPalette: ['#FFB7C5', '#98D8C8', '#F7DC6F', '#BB8FCE'],
  template: 'simple',
  mainTitle: '',
  subTitle: '',
  customText: ''
})

const handleUpdate = (config) => {
  Object.assign(posterConfig, config)
}
</script>

<style>
body {
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
}
</style>
