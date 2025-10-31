<script setup>
import Background from "@/components/atoms/Background.vue";
</script>

<template>
  <div class="relative min-h-screen">
    <Background />
    <RouterView class="text-zinc-200 relative z-10" />
  </div>
</template>


<style scoped>
html, body, #app {
  height: 100%;
}
</style>
