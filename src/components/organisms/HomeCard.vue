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
    <div ref="cardRef" @mouseleave="handleLeave" @mousemove="handleMove" class="flex flex-col justify-between items-center md:w-[32rem] h-[70vh] rounded-4xl bg-zinc-200/5 backdrop-blur-xs" >
      <Logo id="logo" class="w-96 h-32"></Logo>
      <LoginFields class="-mt-16"/>
      <CardFooter class="mb-2" />
    </div>
  </div>
</template>

<style scoped>

</style>