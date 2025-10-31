<script setup>
import { onMounted } from "vue";

onMounted(() => {
  // Subtle parallax movement based on mouse
  const bg = document.querySelector(".animated-bg");
  window.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    bg.style.transform = `translate(${x}px, ${y}px) scale(1.02)`;
  });
});
</script>

<template>
  <div class="animated-bg absolute inset-0 -z-10 overflow-hidden">
    <div class="aurora"></div>
    <div class="stars"></div>
  </div>
</template>

<style scoped>
.animated-bg {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 250%;
  background: radial-gradient(circle at 30% 30%, #0b0010, #000);
  overflow: hidden;
  transition: transform 0.3s ease-out;
}

/* Aurora effect – upgraded cosmic flavor */
.aurora {
  position: absolute;
  width: 120%;
  height: 120%;
  background: conic-gradient(
      from 180deg,
      rgba(157, 10, 85, 0.5),
      rgba(20, 196, 183, 0.4),
      rgba(180, 15, 180, 0.45),
      rgba(50, 0, 120, 0.5)
  );
  filter: blur(200px) brightness(.6) saturate(0.7);
  opacity: 0.7;
  animation: rotateAurora 60s linear infinite;
  will-change: transform;
  mix-blend-mode: screen;
}


@keyframes rotateAurora {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes rotateAuroraReverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

/* Stars stay subtle */
.stars {
  position: absolute;
  width: 200%;
  height: 200%;
  background-image: radial-gradient(white 1px, transparent 1px);
  background-size: 6px 6px;
  opacity: 0.08;
  animation: driftStars 120s linear infinite;
}

@keyframes driftStars {
  from { transform: translateY(0px); }
  to { transform: translateY(-200px); }
}
</style>

