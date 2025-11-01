<template>
  <div class="logo-container">
    <h1 class="text-pink-400/40">
      <span>n</span><span>a</span><span>r</span><span>v</span><span>i</span><span>a</span>
    </h1>
  </div>
</template>
<style scoped>
.logo-container{
  display: flex;
  justify-content: center;
  margin-right: -15px;
}

@media (max-width: 640px) {
  .logo-container{
    margin-right: -8px;
  }
}

h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(4rem,3.5vw, 6rem);
  font-weight: 700;
  letter-spacing: clamp(8px, 2vw, 15px);
  position: relative;
}

h1 span {
  display: inline-block;
  animation: wave 5s ease-in-out infinite;
}

h1 span:nth-child(1) { animation-delay: 0s; }
h1 span:nth-child(2) { animation-delay: 0.1s; }
h1 span:nth-child(3) { animation-delay: 0.2s; }
h1 span:nth-child(4) { animation-delay: 0.3s; }
h1 span:nth-child(5) { animation-delay: 0.4s; }
h1 span:nth-child(6) { animation-delay: 0.5s; }

@keyframes wave {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>