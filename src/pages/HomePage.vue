<script setup>
import HomeCard from "@/components/organisms/HomeCard.vue";
import { onMounted, onBeforeUnmount } from 'vue';
import HeroText from "@/components/atoms/HeroText.vue";

onMounted(() => {
  document.body.style.overflow = 'hidden';
});

onBeforeUnmount(() => {
  document.body.style.overflow = '';
});
</script>

<template>
  <main class="flex items-center justify-center min-h-screen">
    <HeroText />
    <HomeCard />
  </main>
</template>

<style scoped>

</style>