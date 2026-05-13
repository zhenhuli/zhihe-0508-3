<script setup lang="ts">
import type { Album } from '~/types/album'

interface Props {
  album: Album
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
})

const emit = defineEmits<{
  (e: 'click', album: Album): void
}>()

const sizeClasses = {
  small: 'col-span-1 row-span-1',
  medium: 'col-span-1 row-span-2',
  large: 'col-span-2 row-span-2',
}

const titleSizeClass = computed(() => {
  switch (props.size) {
    case 'small': return 'text-sm sm:text-base'
    case 'large': return 'text-xl sm:text-2xl'
    default: return 'text-base sm:text-lg'
  }
})

const artistSizeClass = computed(() => {
  switch (props.size) {
    case 'small': return 'text-xs'
    case 'large': return 'text-sm sm:text-base'
    default: return 'text-xs sm:text-sm'
  }
})

const paddingClass = computed(() => {
  switch (props.size) {
    case 'small': return 'p-2 sm:p-3'
    case 'large': return 'p-4 sm:p-5'
    default: return 'p-3 sm:p-4'
  }
})
</script>

<template>
  <div
    :class="[
      sizeClasses[size],
      'relative group cursor-pointer transition-all duration-500 ease-out',
    ]"
    @click="emit('click', album)"
  >
    <div
      class="relative w-full h-full rounded-xl overflow-hidden bg-gray-800 shadow-lg transition-all duration-500 ease-out group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/20"
    >
      <img
        :src="album.cover"
        :alt="album.title"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div
        :class="[
          paddingClass,
          'absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500',
        ]"
      >
        <h3 :class="['font-bold text-white mb-0.5 sm:mb-1', titleSizeClass]">{{ album.title }}</h3>
        <p :class="['text-gray-300', artistSizeClass]">{{ album.artist }}</p>
        <div class="flex items-center gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
          <span class="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-purple-600 rounded-full text-[10px] sm:text-xs text-white">
            {{ album.genre }}
          </span>
          <span class="text-gray-400 text-[10px] sm:text-xs">{{ album.year }}</span>
        </div>
      </div>

      <div class="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
