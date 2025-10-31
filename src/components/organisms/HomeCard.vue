<script setup lang="ts">
import Logo from "@/components/atoms/Logo.vue";
import { ref } from "vue";
import { useTiltCard } from "@/components/composables/useTiltCard";
import LoginFields from "@/components/molecules/LoginFields.vue";
import CardFooter from "@/components/molecules/CardFooter.vue";

const cardRef = ref<HTMLElement | null>(null);
const { handleMove, handleLeave } = useTiltCard(cardRef);
</script>

<template>
  <div class="perspective-near">
    <div
        ref="cardRef"
        @mouseleave="handleLeave"
        @mousemove="handleMove"
        @mouseenter="shadowApply"
        class="flex flex-col justify-between items-center md:w-[32rem] h-[70vh]
             rounded-4xl  backdrop-blur-md border border-white/10
             shadow-[0_0_40px_rgba(255,0,80,0.08)]
             transition-shadow duration-1000 ease-out"
    >
      <Logo id="logo" class="w-96 h-32 text-rose-100 drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]"></Logo>
      <LoginFields class="-mt-16" />
      <CardFooter class="mb-2 text-zinc-400" />
    </div>
  </div>
</template>
