<script setup lang="ts">
import type { Album } from '~/types/album'

interface Props {
  album: Album | null
  show: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show && album"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click="handleBackdropClick"
      >
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        <div
          class="relative w-full max-w-lg max-h-[90vh] bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-modalIn"
        >
          <div class="relative">
            <img
              :src="album.cover"
              :alt="album.title"
              class="w-full h-56 object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            <button
              @click="emit('close')"
              class="absolute top-4 right-4 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 -mt-16 relative">
            <div class="mb-6">
              <h3 class="text-2xl font-bold text-white mb-1">{{ album.title }}</h3>
              <p class="text-gray-400 text-lg">{{ album.artist }}</p>
              <div class="flex items-center gap-2 mt-3">
                <span class="px-3 py-1 bg-purple-600 rounded-full text-sm text-white">
                  {{ album.genre }}
                </span>
                <span class="text-gray-400 text-sm">{{ album.year }}</span>
                <span class="text-gray-400 text-sm">• {{ album.tracks.length }} tracks</span>
              </div>
            </div>

            <div class="space-y-2 max-h-64 overflow-y-auto pr-2">
              <h4 class="text-lg font-semibold text-white mb-3 sticky top-0 bg-gray-900 py-2">Tracklist</h4>
              <div
                v-for="(track, index) in album.tracks"
                :key="track.id"
                class="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors group/track cursor-pointer"
              >
                <div class="flex items-center gap-3">
                  <span class="text-gray-500 text-sm w-6 text-center font-medium">{{ index + 1 }}</span>
                  <span class="text-white group-hover/track:text-purple-400 transition-colors">{{ track.title }}</span>
                </div>
                <span class="text-gray-400 text-sm font-mono">{{ track.duration }}</span>
              </div>
            </div>

            <div class="mt-6 flex gap-3">
              <button class="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Play Album
              </button>
              <button class="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
              <button class="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modalIn {
  animation: modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
</style>
