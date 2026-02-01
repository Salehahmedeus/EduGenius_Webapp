<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Button } from '@/presentation/components/common/ui'
import { ArrowRight, Brain, Zap, BarChart, Sun, Moon } from 'lucide-vue-next'
import { useDark, useToggle } from '@vueuse/core'
import { useLanguage } from '@/presentation/composables/useLanguage'
import { landingTranslations } from '@/shared/locales/landingTranslations'

const router = useRouter()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const { currentLocale, setLocale } = useLanguage()

// Get reactive translations based on current locale
const t = computed(() => landingTranslations[currentLocale.value])

const toggleLanguage = () => {
  setLocale(currentLocale.value === 'en' ? 'ar' : 'en')
}
</script>

<template>
  <div
    class="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/30"
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
          <!-- Controls -->
          <Button
            variant="ghost"
            size="sm"
            @click="toggleLanguage"
            class="hidden md:flex text-muted-foreground hover:text-foreground"
          >
            {{ currentLocale === 'en' ? 'العربية' : 'English' }}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            @click="toggleDark()"
            class="rounded-full w-9 h-9 border border-border/50"
            aria-label="Toggle dark mode"
          >
            <Sun v-if="isDark" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
          </Button>

          <div class="h-6 w-px bg-border/50 mx-2"></div>

          <Button variant="ghost" @click="router.push('/login')">{{ t.nav.signIn }}</Button>
          <Button
            @click="router.push('/register')"
            class="shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
          >
            {{ t.nav.getStarted }}
          </Button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-20 pb-20 lg:pt-32 lg:pb-32 container mx-auto px-6">
      <div class="grid lg:grid-cols-2 gap-12 items-center">
        <!-- Text Content -->
        <div class="space-y-8 animate-in slide-in-from-left duration-700 fade-in">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20"
          >
            <Zap class="h-3 w-3" />
            <span>{{ t.hero.badge }}</span>
          </div>

          <h1 class="text-5xl lg:text-7xl font-bold leading-tight tracking-tight">
            {{ t.hero.title }}
          </h1>

          <p class="text-xl text-muted-foreground leading-relaxed max-w-xl">
            {{ t.hero.description }}
          </p>

          <div class="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              class="h-12 px-8 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/50 transition-all group"
              @click="router.push('/register')"
            >
              {{ t.hero.cta }}
              <ArrowRight
                class="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform rtl:rotate-180"
              />
            </Button>
          </div>

          <div class="flex items-center gap-8 pt-8 text-muted-foreground/50">
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_theme('colors.green.500')]"
              ></div>
              <span class="text-sm font-medium">{{ t.hero.uptime }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div
                class="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_theme('colors.blue.500')]"
              ></div>
              <span class="text-sm font-medium">{{ t.hero.students }}</span>
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
                  <div class="text-xs text-muted-foreground">{{ t.hero.progress }}</div>
                  <div class="font-bold text-green-400">{{ t.hero.growth }}</div>
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
                  <div class="text-xs text-muted-foreground">{{ t.hero.tutor }}</div>
                  <div class="font-bold text-blue-400">{{ t.hero.active }}</div>
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
          <h2 class="text-3xl font-bold">{{ t.features.title }}</h2>
          <p class="text-muted-foreground">
            {{ t.features.description }}
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
            <h3 class="text-xl font-bold mb-3">{{ t.features.item1.title }}</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">
              {{ t.features.item1.desc }}
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
            <h3 class="text-xl font-bold mb-3">{{ t.features.item2.title }}</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">
              {{ t.features.item2.desc }}
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
            <h3 class="text-xl font-bold mb-3">{{ t.features.item3.title }}</h3>
            <p class="text-muted-foreground text-sm leading-relaxed">
              {{ t.features.item3.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-24 relative">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 class="text-3xl font-bold">{{ t.howItWorks.title }}</h2>
          <p class="text-muted-foreground">{{ t.howItWorks.description }}</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 relative">
          <!-- Connecting Line -->
          <div
            class="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-border to-transparent"
          ></div>

          <div class="relative text-center space-y-4">
            <div
              class="w-24 h-24 bg-background border-4 border-muted rounded-full flex items-center justify-center mx-auto relative z-10 shadow-lg"
            >
              <span class="text-3xl font-bold text-muted-foreground">1</span>
            </div>
            <h3 class="text-xl font-bold">{{ t.howItWorks.step1.title }}</h3>
            <p class="text-muted-foreground text-sm font-sans">
              {{ t.howItWorks.step1.desc }}
            </p>
          </div>

          <div class="relative text-center space-y-4">
            <div
              class="w-24 h-24 bg-primary text-primary-foreground border-4 border-primary/20 rounded-full flex items-center justify-center mx-auto relative z-10 shadow-xl shadow-primary/20"
            >
              <span class="text-3xl font-bold">2</span>
            </div>
            <h3 class="text-xl font-bold">{{ t.howItWorks.step2.title }}</h3>
            <p class="text-muted-foreground text-sm font-sans">
              {{ t.howItWorks.step2.desc }}
            </p>
          </div>

          <div class="relative text-center space-y-4">
            <div
              class="w-24 h-24 bg-background border-4 border-muted rounded-full flex items-center justify-center mx-auto relative z-10 shadow-lg"
            >
              <span class="text-3xl font-bold text-muted-foreground">3</span>
            </div>
            <h3 class="text-xl font-bold">{{ t.howItWorks.step3.title }}</h3>
            <p class="text-muted-foreground text-sm font-sans">
              {{ t.howItWorks.step3.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-24 bg-muted/20">
      <div class="container mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-16">
          <h2 class="text-3xl font-bold mb-4">{{ t.testimonials.title }}</h2>
          <p class="text-muted-foreground">
            {{ t.testimonials.description }}
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(quote, index) in t.testimonials.quotes"
            :key="index"
            class="p-6 rounded-2xl bg-card border border-border shadow-sm"
          >
            <div class="flex items-center gap-1 text-yellow-500 mb-4">★★★★★</div>
            <p class="text-muted-foreground mb-6 italic">
              {{ quote.text }}
            </p>
            <div class="flex items-center gap-3">
              <div
                :class="[
                  'w-10 h-10 rounded-full bg-gradient-to-tr',
                  index === 0
                    ? 'from-purple-500 to-pink-500'
                    : index === 1
                      ? 'from-blue-500 to-green-500'
                      : 'from-amber-500 to-orange-500',
                ]"
              ></div>
              <div>
                <div class="font-bold">{{ quote.author }}</div>
                <div class="text-xs text-muted-foreground">{{ quote.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-24">
      <div class="container mx-auto px-6 max-w-3xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-bold mb-4">{{ t.faq.title }}</h2>
        </div>

        <div class="space-y-4">
          <div
            v-for="(item, index) in t.faq.questions"
            :key="index"
            class="group border border-border rounded-lg p-6 hover:border-primary/50 transition-colors cursor-pointer"
          >
            <h3 class="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
              {{ item.q }}
            </h3>
            <p class="text-muted-foreground">
              {{ item.a }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="relative bg-slate-900 text-white overflow-hidden mt-24">
      <div class="container relative z-10 mx-auto px-6 py-24">
        <div class="grid md:grid-cols-4 gap-12 mb-16">
          <div class="space-y-4 col-span-2">
            <div class="flex items-center gap-2 mb-6">
              <Brain class="h-8 w-8 text-primary" />
              <span class="font-bold text-2xl tracking-tight">EduGenius</span>
            </div>
            <p class="text-gray-300 max-w-sm leading-relaxed">
              {{ t.footer.about }}
            </p>
            <div class="flex gap-4 pt-4">
              <!-- Social Placeholders -->
              <div
                class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill-rule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div
                class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-bold text-lg mb-6">{{ t.footer.platform.title }}</h4>
            <ul class="space-y-4 text-gray-400">
              <li class="hover:text-primary transition-colors cursor-pointer">
                {{ t.footer.platform.features }}
              </li>
              <li class="hover:text-primary transition-colors cursor-pointer">
                {{ t.footer.platform.pricing }}
              </li>
              <li class="hover:text-primary transition-colors cursor-pointer">
                {{ t.footer.platform.schools }}
              </li>
              <li class="hover:text-primary transition-colors cursor-pointer">
                {{ t.footer.platform.research }}
              </li>
            </ul>
          </div>

          <div>
            <h4 class="font-bold text-lg mb-6">{{ t.footer.support.title }}</h4>
            <ul class="space-y-4 text-gray-400">
              <li class="hover:text-primary transition-colors cursor-pointer">
                {{ t.footer.support.help }}
              </li>
              <li class="hover:text-primary transition-colors cursor-pointer">
                {{ t.footer.support.community }}
              </li>
              <li class="hover:text-primary transition-colors cursor-pointer">
                {{ t.footer.support.terms }}
              </li>
              <li class="hover:text-primary transition-colors cursor-pointer">
                {{ t.footer.support.privacy }}
              </li>
            </ul>
          </div>
        </div>

        <div
          class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500"
        >
          <p>{{ t.footer.rights }}</p>
          <div class="flex items-center gap-6">
            <span class="hover:text-white transition-colors cursor-pointer">{{
              t.footer.bottom.privacy
            }}</span>
            <span class="hover:text-white transition-colors cursor-pointer">{{
              t.footer.bottom.terms
            }}</span>
            <span class="hover:text-white transition-colors cursor-pointer">{{
              t.footer.bottom.sitemap
            }}</span>
          </div>
        </div>
      </div>
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
