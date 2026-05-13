<script setup lang="ts">
interface Props {
  genres: string[]
  selectedGenre: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:selectedGenre', genre: string): void
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2 justify-center mb-8">
    <button
      v-for="genre in genres"
      :key="genre"
      :class="[
        'px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
        selectedGenre === genre
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white',
      ]"
      @click="emit('update:selectedGenre', genre)"
    >
      {{ genre }}
    </button>
  </div>
</template>
