<script setup>
import HomeCard from "@/components/organisms/HomeCard.vue";
import HeroText from "@/components/atoms/HeroText.vue";
import { onMounted, onBeforeUnmount } from "vue";

onMounted(() => {
  if (screen.width < 1400) {
    document.body.style.overflow = "hidden";
  }
});

onBeforeUnmount(() => {
  document.body.style.overflow = "";
});
</script>

<template>
  <main
      class="relative flex flex-col md:flex-row items-center justify-center
           min-h-screen px-4 md:px-12 py-12 md:py-16 gap-12 md:gap-6
           overflow-hidden"
  >
    <!-- Hero Text -->
    <section
        class="w-full md:w-auto flex flex-col items-center md:items-end justify-center
             text-center md:text-right space-y-5 md:mr-6"
    >
      <HeroText />
    </section>

    <!-- Home Card -->
    <section
        class="w-full md:w-auto flex justify-center md:justify-start items-center
             md:ml-6"
    >
      <HomeCard />
    </section>
  </main>
</template>

<style scoped>
main {
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile tweaks */
@media (max-width: 768px) {
  main {
    flex-direction: column;
    gap: 5rem;
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
}
</style>
