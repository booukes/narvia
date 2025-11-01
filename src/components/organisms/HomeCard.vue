<script setup lang="ts">
import Logo from "@/components/atoms/Logo.vue";
import { ref } from "vue";
import { useTiltCard } from "@/components/composables/useTiltCard";
import LoginFields from "@/components/molecules/LoginFields.vue";
import CardFooter from "@/components/molecules/CardFooter.vue";
import RegisterFields from "@/components/molecules/RegisterFields.vue";

const cardRef = ref<HTMLElement | null>(null);
const { handleMove, handleLeave, shadowApply } = useTiltCard(cardRef);

const mode = ref<"login" | "register">("login");

const toggleMode = () => {
  mode.value = mode.value === "login" ? "register" : "login";
};
</script>

<template>
  <div class="perspective-near">
    <div
        ref="cardRef"
        @mouseleave="handleLeave"
        @mousemove="handleMove"
        @mouseenter="shadowApply"
        class="flex flex-col justify-between items-center
             w-[90vw] sm:w-[32rem] px-4 rounded-3xl backdrop-blur-md border border-white/10
             shadow-[0_0_40px_rgba(255,0,255,0.4)] overflow-hidden
             h-[85vh]"
    >
      <Logo
          id="logo"
          class="w-64 sm:w-96 h-20 mt-0 sm:mt-4 text-rose-100
               drop-shadow-[0_4px_8px_rgba(0,0,0,0.7)]"
      />

      <Transition name="fade-slide" mode="out-in">
        <component
            :is="mode === 'login' ? LoginFields : RegisterFields"
            @switchMode="toggleMode"
            class="-mt-2 w-[80%]"
            :key="mode"
        />
      </Transition>

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
