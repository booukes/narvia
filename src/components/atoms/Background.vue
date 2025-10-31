<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const stars = document.querySelector(".stars");
  let pending = false;

  // Gentle parallax just for stars
  window.addEventListener("mousemove", (e) => {
    if (pending) return;
    pending = true;
    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 10;
      stars.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      pending = false;
    });
  });

  // Randomize lanterns for natural movement
  const lanterns = document.querySelectorAll(".lantern");
  lanterns.forEach((lantern) => {
    const delay = Math.random() * 15;
    const duration = 22 + Math.random() * 10;
    const drift = (Math.random() * 40 - 20).toFixed(1); // horizontal wobble
    const scale = 0.8 + Math.random() * 0.4;

    lantern.style.setProperty("--delay", `${delay}s`);
    lantern.style.setProperty("--duration", `${duration}s`);
    lantern.style.setProperty("--drift", `${drift}px`);
    lantern.style.setProperty("--scale", scale);
  });
});
</script>

<template>
  <div class="animated-bg absolute inset-0 -z-10 overflow-hidden">
    <div class="base-gradient"></div>
    <div class="stars"></div>

    <!-- Floating lanterns -->
    <div class="lantern lantern1"></div>
    <div class="lantern lantern2"></div>
    <div class="lantern lantern3"></div>
    <div class="lantern lantern4"></div>
    <div class="lantern lantern5"></div>
    <div class="lantern lantern6"></div>
    <div class="lantern lantern7"></div>
    <div class="lantern lantern8"></div>
  </div>
</template>

<style scoped>
.animated-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  background: radial-gradient(circle at 50% 40%, #070010, #000);
  will-change: transform;
}

.stars {
  position: absolute;
  width: 160%;
  height: 160%;
  background-image: url("data:image/svg+xml,%3Csvg width='6' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='1' cy='1' r='1' fill='white' opacity='0.25'/%3E%3C/svg%3E");
  background-size: 6px 6px;
  opacity: 0.06;
  animation: slowDrift 160s linear infinite;
  will-change: transform;
}

@keyframes slowDrift {
  from { transform: translateY(0); }
  to { transform: translateY(-100px); }
}

.base-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 80%, rgba(255, 0, 128, 0.1), rgba(0, 0, 0, 0) 70%),
  radial-gradient(circle at 20% 20%, rgba(0, 255, 200, 0.08), rgba(0, 0, 0, 0) 80%);
  pointer-events: none;
}

.lantern {
  position: absolute;
  width: 80px;
  height: 120px;
  border-radius: 40% 40% 50% 50%;
  background: radial-gradient(circle at 50% 40%, rgba(255, 210, 120, 0.9), rgba(255, 80, 150, 0.6) 70%, transparent 100%);
  box-shadow: 0 0 30px rgba(255, 160, 100, 0.4), 0 0 60px rgba(255, 100, 180, 0.2);
  opacity: 0.75;
  mix-blend-mode: screen;
  will-change: transform, opacity;
  animation: floatUp var(--duration, 25s) ease-in-out infinite var(--delay, 0s);
}

/* Gentle upward float + horizontal drift */
@keyframes floatUp {
  0% {
    transform: translate(0, 0) scale(var(--scale, 1));
    opacity: 0;
  }
  10% {
    opacity: 0.9;
  }
  40% {
    transform: translate(calc(var(--drift, 20px) * 0.5), -40vh) rotate(5deg) scale(var(--scale, 1));
  }
  70% {
    transform: translate(calc(var(--drift, 20px)), -80vh) rotate(-5deg) scale(var(--scale, 1));
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translate(calc(var(--drift, 20px) * 1.2), -110vh) rotate(0deg) scale(var(--scale, 1));
    opacity: 0;
  }
}

/* Base lantern placements */
.lantern1 { left: 5%;  bottom: -20%; }
.lantern2 { left: 20%; bottom: -25%; }
.lantern3 { left: 35%; bottom: -18%; }
.lantern4 { left: 50%; bottom: -22%; }
.lantern5 { left: 65%; bottom: -20%; }
.lantern6 { left: 80%; bottom: -25%; }
.lantern7 { left: 90%; bottom: -18%; }
.lantern8 { left: 10%; bottom: -28%; }

</style>
