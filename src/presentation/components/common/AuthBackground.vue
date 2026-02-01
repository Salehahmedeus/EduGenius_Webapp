<template>
  <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-background">
    <!-- Animated Blobs -->
    <div
      class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-blob"
    ></div>
    <div
      class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000"
    ></div>
    <div
      class="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000"
    ></div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite alternate ease-in-out;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>
