<template>
  <div class="logo-container">
    <h1>
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
h1 {
  font-family: 'Playfair Display', serif;
  font-size: 6rem;
  font-weight: 700;
  letter-spacing: 15px;
  color: #56071c;
  text-shadow: -2px 2px 2px #000000;
  position: relative;
}

h1 span {
  display: inline-block;
  animation: wave 2.5s ease-in-out infinite;
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

@media (max-width: 768px) {
  h1 {
    font-size: 4rem;
    letter-spacing: 8px;
  }
}
</style>