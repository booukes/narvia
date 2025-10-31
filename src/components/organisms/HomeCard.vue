<script setup lang="ts">
import Logo from "@/components/atoms/Logo.vue";
import { ref } from "vue";
import { useTiltCard } from "@/components/composables/useTiltCard";
import LoginFields from "@/components/molecules/LoginFields.vue";
import CardFooter from "@/components/molecules/CardFooter.vue";

const cardRef = ref<HTMLElement | null>(null);
const { handleMove, handleLeave, shadowApply } = useTiltCard(cardRef);
</script>

<template>
  <div class="perspective-normal">
    <div
        ref="cardRef"
        @mouseleave="handleLeave"
        @mousemove="handleMove"
        @mouseenter="shadowApply"
        class="flex flex-col justify-between items-center
             w-[90vw] sm:w-[32rem] h-[70vh] max-h-[600px]
             rounded-3xl backdrop-blur-md border border-white/10
             shadow-[0_0_40px_rgba(255,0,255,0.4)]
              "
    >
      <Logo
          id="logo"
          class="w-64 sm:w-96 h-20 mt-0 sm:mt-4 text-rose-100
               drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]"
      />
      <LoginFields class="-mt-8 w-[80%]" />
      <CardFooter class="mb-6 text-zinc-400 text-sm" />
    </div>
  </div>
</template>

<style scoped>
.perspective-normal {
  perspective: 1200px;
  display: flex;
  justify-content: center;
}
</style>
