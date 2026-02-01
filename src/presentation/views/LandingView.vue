<script setup>
import { useRouter } from 'vue-router'
import { Button } from '@/presentation/components/common/ui'
import { ArrowRight, Brain, Zap, BarChart } from 'lucide-vue-next'

const router = useRouter()
</script>

<template>
  <div
    class="min-h-screen bg-background text-foreground overflow-hidden font-sans selection:bg-primary/30"
  >
    <!-- Navbar -->
    <nav
      class="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-primary/10 bg-background/80"
    >
      <div class="container mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Brain class="h-6 w-6 text-primary animate-pulse" />
          <span class="font-bold text-xl tracking-tight">EduGenius</span>
        </div>
        <div class="flex items-center gap-4">
          <Button variant="ghost" @click="router.push('/login')">Sign In</Button>
          <Button
            @click="router.push('/register')"
            class="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 container mx-auto px-6">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Text Content -->
        <div class="space-y-8 animate-in slide-in-from-left duration-700 fade-in">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
          >
            <Zap class="h-3 w-3" />
            <span>AI-Powered Learning Revolution</span>
          </div>

          <h1 class="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
            Unlock Your
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400"
              >Potential</span
            >
            with Artificial Intelligence
          </h1>

          <p class="text-xl text-muted-foreground leading-relaxed max-w-xl">
            Experience the future of education. Our AI-driven dashboard personalizes your learning
            journey, tracks real-time progress, and adapts to your unique style.
          </p>

          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              class="h-12 px-8 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/50 transition-all group"
              @click="router.push('/register')"
            >
              Start Learning Now
              <ArrowRight class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              class="h-12 px-8 text-lg rounded-full border-primary/20 hover:bg-primary/5"
              @click="router.push('/login')"
            >
              Access Demo
            </Button>
          </div>

          <div class="flex items-center gap-8 pt-8 text-muted-foreground/50">
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_theme('colors.green.500')]"
              ></div>
              <span class="text-sm font-medium">99.9% UpTime</span>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_theme('colors.blue.500')]"
              ></div>
              <span class="text-sm font-medium">10k+ Students</span>
            </div>
          </div>
        </div>

        <!-- Illustration -->
        <div
          class="relative animate-in slide-in-from-right duration-700 fade-in delay-200 group perspective-1000"
        >
          <div
            class="absolute -inset-4 bg-gradient-to-r from-primary to-purple-600 rounded-full blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity duration-1000 animate-pulse-slow"
          ></div>

          <div
            class="relative transform group-hover:scale-[1.02] transition-transform duration-700 ease-out-back"
          >
            <img
              src="/landing-hero.png"
              alt="EduGenius Dashboard"
              class="w-full h-auto rounded-3xl shadow-2xl border border-white/10 glass-effect"
            />

            <!-- Floating Elements -->
            <div
              class="absolute -right-8 -top-8 bg-card/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl animate-float delay-100"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-green-500/20 rounded-lg">
                  <BarChart class="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <div class="text-xs text-muted-foreground">Progress</div>
                  <div class="font-bold text-green-400">+28% Growth</div>
                </div>
              </div>
            </div>

            <div
              class="absolute -left-8 bottom-12 bg-card/80 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl animate-float-delayed"
            >
              <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-500/20 rounded-lg">
                  <Brain class="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div class="text-xs text-muted-foreground">AI Tutor</div>
                  <div class="font-bold text-blue-400">Active Now</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="py-24 bg-muted/20 relative overflow-hidden">
      <!-- Decorator -->
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
      ></div>

      <div class="container mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 class="text-3xl font-bold">Why Choose EduGenius?</h2>
          <p class="text-muted-foreground">
            Detailed analytics, personalized quizzes, and an AI tutor that's always ready to help
            you excel.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            class="group p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/5 relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <div
              class="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform"
            >
              <Brain class="h-6 w-6" />
            </div>
            <h3 class="text-xl font-bold mb-3">AI Personal Tutor</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">
              Get 24/7 assistance tailored to your learning pace. Our AI breaks down complex topics
              into bite-sized, easy-to-understand concepts.
            </p>
          </div>

          <div
            class="group p-8 rounded-3xl bg-card border border-border/50 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/5 relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <div
              class="bg-purple-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform"
            >
              <Zap class="h-6 w-6" />
            </div>
            <h3 class="text-xl font-bold mb-3">Adaptive Quizzes</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">
              Test your knowledge with dynamic quizzes generated from your course material. Instant
              feedback helps you identify areas for improvement.
            </p>
          </div>

          <div
            class="group p-8 rounded-3xl bg-card border border-border/50 hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-500/5 relative overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <div
              class="bg-blue-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform"
            >
              <BarChart class="h-6 w-6" />
            </div>
            <h3 class="text-xl font-bold mb-3">Deep Analytics</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">
              Visualize your progress with beautiful, interactive charts. Track your strengths and
              weaknesses to optimize your study time.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 text-center text-sm text-muted-foreground border-t border-border/40">
      <p>&copy; 2026 EduGenius. Empowering Students Everywhere.</p>
    </footer>
  </div>
</template>

<style scoped>
.glass-effect {
  backdrop-filter: blur(10px);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes float-delayed {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.perspective-1000 {
  perspective: 1000px;
}

.ease-out-back {
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
