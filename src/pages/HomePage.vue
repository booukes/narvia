<script setup>
import HomeCard from "@/components/organisms/HomeCard.vue";
import { onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <main class="flex items-center justify-center min-h-screen">
    <HomeCard />
  </main>
</template>

<style scoped>

</style>