<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  const heroText = document.querySelector('.hero-text')
  let mouseX = 0, mouseY = 0
  let targetX = 0, targetY = 0
  let rafId

  // Move handler – light and fast
  const handleMove = (e) => {
    const rect = window
    mouseX = (e.clientX / rect.innerWidth - 0.5) * 10
    mouseY = (e.clientY / rect.innerHeight - 0.5) * 10
  }

  // Smooth animation frame loop
  const animate = () => {
    targetX += (mouseX - targetX) * 0.1
    targetY += (mouseY - targetY) * 0.1
    heroText.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
    rafId = requestAnimationFrame(animate)
  }

  window.addEventListener('mousemove', handleMove)
  animate()

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', handleMove)
    cancelAnimationFrame(rafId)
  })
})
</script>

<template>
  <div class="hero-wrapper">
    <div class="hero-text">
      <h2>
        <span class="block big gloss">Create.</span>
        <span class="block big shine delay">Shine.</span>
        <span class="block big glow delay2">Be seen.</span>
      </h2>
      <p class="tagline md:text-nowrap mx-auto">where creativity finds its light.</p>
    </div>
  </div>
</template>

<style scoped>
.hero-wrapper {
  position: relative;

  overflow: hidden;
  perspective: none
}

@media (min-width: 768px) {
  .hero-wrapper {
    width: 30vw;
  }
}

.hero-text {
  font-family: 'Playfair Display', serif;
  user-select: none;
  position: relative;
  color: #fff;
  z-index: 5;
  will-change: transform;
  filter: drop-shadow(0 0 10px rgba(255, 0, 128, 0.3));
  text-align: center;
  padding: 0 1rem;
}


h2 {
  line-height: 1.05;
}

.big {
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 800;
  display: block;
  letter-spacing: -0.02em;
}

/* Gloss */
.gloss {
  background: linear-gradient(180deg, #fff 10%, #c72c80 80%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: shimmer 3s ease-in-out infinite alternate;
  text-shadow:
      0 0 20px rgba(255, 150, 255, 0.3),
      0 0 50px rgba(255, 120, 200, 0.3);
}

/* Shine */
.shine {
  background: linear-gradient(180deg, #e0e0e0 0%, #8f0d51 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: shimmer 4s ease-in-out infinite alternate;
  text-shadow:
      0 0 10px rgba(255, 180, 255, 0.2),
      0 0 30px rgba(255, 180, 255, 0.15);
}

/* Glow */
.glow {
  background: linear-gradient(180deg, #fff 0%, #ff4fa8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: pulse 2.5s ease-in-out infinite;
  text-shadow:
      0 0 10px rgba(255, 80, 180, 0.5),
      0 0 30px rgba(255, 80, 180, 0.3);
}

.delay { animation-delay: 1.5s; }
.delay2 { animation-delay: 3s; }

.tagline {
  margin-top: 0.75rem;
  font-size: 1rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Inter', sans-serif;
  max-width: 32ch;
  line-height: 1.5;
  text-shadow: 0 0 10px rgba(255, 120, 200, 0.3);
}

@keyframes shimmer {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

@keyframes pulse {
  0%, 100% {
    text-shadow:
        0 0 10px rgba(255, 80, 180, 0.5),
        0 0 30px rgba(255, 80, 180, 0.3);
    transform: scale(1);
  }
  50% {
    text-shadow:
        0 0 30px rgba(255, 120, 200, 0.8),
        0 0 50px rgba(255, 120, 200, 0.5);
    transform: scale(1.02);
  }
}
</style>