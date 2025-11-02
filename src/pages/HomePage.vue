<script lang="ts" setup>
import HomeCard from "@/components/organisms/HomeCard.vue";
import HeroText from "@/components/atoms/HeroText.vue";
import {onMounted, onBeforeUnmount, ref} from "vue";
import LoginFields from "@/components/molecules/LoginFields.vue";
import RegisterFields from "@/components/molecules/RegisterFields.vue";
import LetsStartHero from "@/components/atoms/LetsStartHero.vue";

const mode = ref<"start"|"nostart">("nostart");

const toggleMode = () => {
  if (typeof mode !== "object") {
    console.error("🔥 MODE IS BROKEN HERE:", mode);
    return;
  }
  mode.value = mode.value === "start" ? "nostart" : "start";
};

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
    <Transition name="fade-slide" mode="out-in">
      <component
          :is="mode === 'start' ? LetsStartHero : HeroText"
          class="-mt-2 w-[80%]"
          :key="mode"
      />
    </Transition>
    <!-- Home Card -->
    <section
        class="w-full md:w-auto flex justify-center md:justify-start items-center
             md:ml-6"
    >
      <HomeCard @start="toggleMode"/>
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
/* fade-slide animation for the login/register fields */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
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
