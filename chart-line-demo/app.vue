<template>
  <div :class="['min-h-screen transition-colors duration-300', theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50']">
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { theme } = useChart()

watch(
  theme,
  (newTheme) => {
    if (process.client) {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  },
  { immediate: true }
)
</script>
