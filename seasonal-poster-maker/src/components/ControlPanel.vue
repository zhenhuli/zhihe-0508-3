<template>
  <div class="control-panel bg-white rounded-2xl shadow-xl p-6 h-full overflow-y-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <span>🎨</span>
      海报设计面板
    </h2>
    
    <div class="space-y-6">
      <div class="section">
        <h3 class="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>🌱</span>
          选择季节
        </h3>
        <div class="grid grid-cols-4 gap-2">
          <button
            v-for="season in seasons"
            :key="season.id"
            @click="selectSeason(season.id)"
            :class="[
              'p-3 rounded-xl text-center transition-all duration-300',
              selectedSeason === season.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            ]"
          >
            <div class="text-2xl mb-1">{{ season.icon }}</div>
            <div class="text-xs font-medium">{{ season.name }}</div>
          </button>
        </div>
      </div>
      
      <div class="section">
        <h3 class="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>🎉</span>
          选择节日节气
        </h3>
        <div class="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          <button
            v-for="festival in currentFestivals"
            :key="festival.id"
            @click="selectFestival(festival)"
            :class="[
              'p-2 rounded-lg text-sm transition-all duration-200',
              selectedFestival.id === festival.id
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            ]"
          >
            <div class="font-medium">{{ festival.name }}</div>
            <div class="text-xs opacity-75">{{ festival.date }}</div>
          </button>
        </div>
      </div>
      
      <div class="section">
        <h3 class="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>🎭</span>
          选择模板
        </h3>
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="tpl in templates"
            :key="tpl.id"
            @click="selectTemplate(tpl.id)"
            :class="[
              'p-4 rounded-xl text-center transition-all duration-300 border-2',
              selectedTemplate === tpl.id
                ? 'border-purple-500 bg-purple-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-purple-300'
            ]"
          >
            <div class="font-semibold text-gray-800">{{ tpl.name }}</div>
            <div class="text-xs text-gray-500 mt-1">{{ tpl.preview }}</div>
          </button>
        </div>
      </div>
      
      <div class="section">
        <h3 class="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>🎨</span>
          配色方案
        </h3>
        <div class="space-y-2">
          <div
            v-for="palette in currentColorPalettes"
            :key="palette.id"
            @click="selectColorPalette(palette.colors)"
            :class="[
              'p-3 rounded-xl cursor-pointer transition-all duration-300 border-2',
              JSON.stringify(selectedColorPalette) === JSON.stringify(palette.colors)
                ? 'border-purple-500 shadow-md'
                : 'border-gray-200 hover:border-purple-300'
            ]"
          >
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-700 text-sm">{{ palette.name }}</span>
              <div class="flex gap-1">
                <div
                  v-for="(color, index) in palette.colors"
                  :key="index"
                  class="w-6 h-6 rounded-full border border-gray-200"
                  :style="{ backgroundColor: color }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h3 class="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>✏️</span>
          自定义文字
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">主标题</label>
            <input
              v-model="mainTitle"
              type="text"
              placeholder="输入主标题..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">副标题</label>
            <input
              v-model="subTitle"
              type="text"
              placeholder="输入副标题..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1">自定义文案</label>
            <textarea
              v-model="customText"
              placeholder="输入自定义文案..."
              rows="3"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 outline-none resize-none"
            ></textarea>
          </div>
        </div>
      </div>
      
      <div class="section pt-4 border-t border-gray-200">
        <button
          @click="downloadPoster"
          class="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
        >
          <span>💾</span>
          下载海报
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { seasons, colorPalettes, templates } from '../data/seasons.js'

const props = defineProps({
  canvasRef: { type: Object, default: null }
})

const emit = defineEmits(['update'])

const selectedSeason = ref('spring')
const selectedFestival = ref({ id: 'lichun', name: '立春', date: '2月4日' })
const selectedTemplate = ref('simple')
const selectedColorPalette = ref(['#FFB7C5', '#98D8C8', '#F7DC6F', '#BB8FCE'])
const mainTitle = ref('')
const subTitle = ref('')
const customText = ref('')

const currentFestivals = computed(() => {
  const season = seasons.find(s => s.id === selectedSeason.value)
  return season ? season.festivals : []
})

const currentColorPalettes = computed(() => {
  return colorPalettes[selectedSeason.value] || colorPalettes.spring
})

const selectSeason = (seasonId) => {
  selectedSeason.value = seasonId
  const season = seasons.find(s => s.id === seasonId)
  if (season && season.festivals.length > 0) {
    selectedFestival.value = season.festivals[0]
  }
  selectedColorPalette.value = currentColorPalettes.value[0].colors
  emitUpdate()
}

const selectFestival = (festival) => {
  selectedFestival.value = festival
  emitUpdate()
}

const selectTemplate = (templateId) => {
  selectedTemplate.value = templateId
  emitUpdate()
}

const selectColorPalette = (colors) => {
  selectedColorPalette.value = colors
  emitUpdate()
}

const emitUpdate = () => {
  emit('update', {
    season: selectedSeason.value,
    festival: selectedFestival.value,
    template: selectedTemplate.value,
    colorPalette: selectedColorPalette.value,
    mainTitle: mainTitle.value,
    subTitle: subTitle.value,
    customText: customText.value
  })
}

const downloadPoster = () => {
  if (!props.canvasRef || !props.canvasRef.value) return
  
  const canvas = props.canvasRef.value
  const link = document.createElement('a')
  link.download = `${selectedFestival.value.name}_海报.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}

watch(
  [mainTitle, subTitle, customText],
  () => {
    emitUpdate()
  },
  { deep: true }
)

emitUpdate()
</script>

<style scoped>
.control-panel {
  max-height: calc(100vh - 40px);
}

.control-panel::-webkit-scrollbar {
  width: 6px;
}

.control-panel::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.control-panel::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.control-panel::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

.section {
  scroll-margin-top: 20px;
}
</style>
