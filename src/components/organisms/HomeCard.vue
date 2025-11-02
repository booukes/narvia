<script setup lang="ts">
import Logo from "@/components/atoms/Logo.vue";
import { ref } from "vue";
import { useTiltCard } from "@/composables/useTiltCard";

import LoginFields from "@/components/molecules/LoginFields.vue";
import RegisterFields from "@/components/molecules/RegisterFields.vue";
import StartingFields from "@/components/molecules/StartingFields.vue";
import CardFooter from "@/components/molecules/CardFooter.vue";

const cardRef = ref<HTMLElement | null>(null);
const { handleMove, handleLeave, shadowApply } = useTiltCard(cardRef);

const emit = defineEmits(['switchMode', 'start'])

const mode = ref<"login" | "register" | "start">("login");

const toggleMode = () => {
  if (mode.value === "start") return; // prevent switching from profile setup
  mode.value = mode.value === "login" ? "register" : "login";
};

const handleStart = () => {
  mode.value = "start";
  emit('start')
};

const handleProfileComplete = () => {
  // optional emit to parent if you want to redirect or continue
  console.log("Profile completed!");
};
</script>

<template>
  <div class="perspective-normal">
    <div
        ref="cardRef"
        @mouseleave="handleLeave"
        @mousemove="handleMove"
        @mouseenter="shadowApply"
        class="flex flex-col justify-between items-center
             w-[90vw] sm:w-[32rem] px-4 rounded-3xl border backdrop-blur-sm border-white/10
             shadow-[0_0_40px_rgba(255,0,255,0.2)] overflow-auto
             h-[85vh]"
    >
      <Logo
          id="logo"
          class="w-64 sm:w-96 h-20 mt-0 sm:mt-4 text-rose-100
               drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]"
      />

      <Transition name="fade-slide" mode="out-in">
        <component
            :is="mode === 'login'
              ? LoginFields
              : mode === 'register'
              ? RegisterFields
              : StartingFields"
            @switchMode="toggleMode"
            @start="handleStart"
            @startComplete="handleProfileComplete"
            class="-mt-2 w-[80%]"
            :key="mode"
        />
      </Transition>

      <CardFooter v-if="mode !== 'start'" class="mb-6 text-zinc-400 text-sm" />
    </div>
  </div>
</template>

<style scoped>
.perspective-normal {
  perspective: 1200px;
  display: flex;
  justify-content: center;
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
</style>
