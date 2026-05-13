<script setup lang="ts">
import { albums, genres } from '~/data/albums'
import type { Album } from '~/types/album'

const selectedGenre = ref('All')
const selectedAlbum = ref<Album | null>(null)
const showModal = ref(false)
const screenWidth = ref(1200)

const { isClient } = useNuxtApp()

onMounted(() => {
  if (isClient) {
    screenWidth.value = window.innerWidth
  }
  window.addEventListener('resize', handleResize)
})

const filteredAlbums = computed(() => {
  if (selectedGenre.value === 'All') {
    return albums
  }
  return albums.filter((album) => album.genre === selectedGenre.value)
})

const gridCols = computed(() => {
  if (screenWidth.value < 480) return 1
  if (screenWidth.value < 640) return 2
  if (screenWidth.value < 768) return 2
  if (screenWidth.value < 1024) return 3
  if (screenWidth.value < 1280) return 4
  return 5
})

const rowHeight = computed(() => {
  if (screenWidth.value < 480) return 180
  if (screenWidth.value < 640) return 160
  if (screenWidth.value < 768) return 150
  if (screenWidth.value < 1024) return 140
  return 150
})

const gapSize = computed(() => {
  if (screenWidth.value < 480) return '0.5rem'
  if (screenWidth.value < 640) return '0.75rem'
  return '1rem'
})

const getAlbumSize = (index: number): 'small' | 'medium' | 'large' => {
  const cols = gridCols.value
  
  if (cols === 1) {
    return 'medium'
  }
  
  if (cols === 2) {
    const pattern = ['medium', 'small', 'medium', 'large', 'small', 'medium']
    return pattern[index % pattern.length] as 'small' | 'medium' | 'large'
  }
  
  if (cols === 3) {
    const pattern = ['large', 'medium', 'small', 'medium', 'large', 'small', 'medium', 'medium', 'large']
    return pattern[index % pattern.length] as 'small' | 'medium' | 'large'
  }
  
  if (cols === 4) {
    const pattern = ['large', 'medium', 'small', 'medium', 'large', 'small', 'medium', 'medium', 'large', 'small', 'medium', 'large']
    return pattern[index % pattern.length] as 'small' | 'medium' | 'large'
  }
  
  const pattern = ['large', 'medium', 'small', 'medium', 'large', 'small', 'medium', 'medium', 'large', 'small', 'medium', 'large', 'small', 'medium', 'large']
  return pattern[index % pattern.length] as 'small' | 'medium' | 'large'
}

const sizedAlbums = computed(() => {
  return filteredAlbums.value.map((album, index) => ({
    ...album,
    size: getAlbumSize(index),
  }))
})

const openAlbumModal = (album: Album) => {
  selectedAlbum.value = album
  showModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeAlbumModal = () => {
  showModal.value = false
  document.body.style.overflow = ''
}

const handleResize = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  document.body.style.overflow = ''
})
</script>

<template>
  <div class="min-h-screen bg-gray-900">
    <header class="py-6 sm:py-8 px-4">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2">
          <span class="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Music Gallery
          </span>
        </h1>
        <p class="text-gray-400 text-base sm:text-lg">Discover amazing albums</p>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-2 sm:px-4 pb-12">
      <div class="mb-6 sm:mb-8">
        <div class="flex flex-wrap gap-2 justify-center">
          <button
            v-for="genre in genres"
            :key="genre"
            :class="[
              'px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300',
              selectedGenre === genre
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white',
            ]"
            @click="selectedGenre = genre"
          >
            {{ genre }}
          </button>
        </div>
      </div>

      <div
        class="grid auto-rows-[var(--row-height)] gap-[var(--gap)]"
        :style="{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
          '--row-height': `${rowHeight.value}px`,
          '--gap': gapSize.value,
        } as any"
      >
        <AlbumCard
          v-for="album in sizedAlbums"
          :key="album.id"
          :album="album"
          :size="album.size"
          @click="openAlbumModal(album)"
        />
      </div>

      <div v-if="filteredAlbums.length === 0" class="text-center py-12">
        <p class="text-gray-400 text-lg">No albums found for this genre</p>
      </div>
    </main>

    <footer class="py-8 text-center text-gray-500 text-sm">
      <p>© 2024 Music Gallery. All rights reserved.</p>
    </footer>

    <AlbumModal
      :album="selectedAlbum"
      :show="showModal"
      @close="closeAlbumModal"
    />
  </div>
</template>
