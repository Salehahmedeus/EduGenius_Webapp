<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Loader2,
  TrendingUp,
  Brain,
  FileText,
  Clock,
  BookOpen,
  Download,
  X,
  Sparkles,
  Target,
  AlertCircle,
  BarChart2,
  Check,
} from 'lucide-vue-next'
import { dashboardApi } from '@/infrastructure/api/dashboardApi'
import { useAuthStore } from '@/presentation/stores/authStore'
import { Button } from '@/presentation/components/common/ui'
import { useToast } from '@/presentation/composables/useToast'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/presentation/components/common/ui/card'
import { formatters } from '@/shared/utils/formatters'

const router = useRouter()
const { toast } = useToast()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const isLoading = ref(true)
const dashboardData = ref(null)
const reportData = ref(null)
const showReportModal = ref(false)
const isGeneratingReport = ref(false)

const stats = computed(() => dashboardData.value?.stats || {})
const charts = computed(() => dashboardData.value?.charts || {})
const insights = computed(() => dashboardData.value?.insights || [])
const recommendation = computed(() => dashboardData.value?.recommendation || null)

// Fetch dashboard data
const fetchDashboardData = async () => {
  isLoading.value = true
  try {
    const response = await dashboardApi.getDashboardHome()
    dashboardData.value = response
  } catch (e) {
    console.error('Failed to fetch dashboard data', e)
    toast({
      title: 'Error',
      description: 'Failed to load dashboard data',
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}

// Generate report
const handleGenerateReport = async () => {
  isGeneratingReport.value = true
  try {
    const response = await dashboardApi.getProgressReport()
    reportData.value = response.data || response // Adjust based on API structure
    showReportModal.value = true
  } catch (e) {
    console.error('Report generation error:', e)

    // Mock Fallback for Demo/Testing if API fails
    toast({
      title: 'Generated Local Report',
      description: 'Server unreachable. Showing generated report based on local data.',
      variant: 'default',
    })

    reportData.value = {
      user_id: user.value?.id,
      total_quizzes: stats.value.quiz_count || 0,
      average_score: stats.value.avg_score || 0,
      topics_studied: charts.value.topic_strengths?.map((t) => t.topic) || [],
      strengths: charts.value.topic_strengths
        ?.filter((t) => parseFloat(t.avg_score) >= 70)
        .map((t) => t.topic) || ['General Knowledge'],
      weaknesses:
        charts.value.topic_strengths
          ?.filter((t) => parseFloat(t.avg_score) < 70)
          .map((t) => t.topic) || [],
      summary: `Based on your recent activity, you have completed ${stats.value.quiz_count || 0} quizzes with an average score of ${parseFloat(stats.value.avg_score || 0).toFixed(1)}%. We recommend focusing on your identified weak areas to improve your overall performance.`,
      generated_at: new Date().toISOString(),
      id: 999,
    }
    showReportModal.value = true
  } finally {
    isGeneratingReport.value = false
  }
}

// Chart Helpers
const getSmoothTrendPath = () => {
  const data = charts.value?.performance_trend || []
  if (!data.length) return ''

  // Normalize scores to 0-100 scale
  // Graph height = 60, Width = 100
  const height = 60
  const width = 100
  const scores = data.map((d) => parseFloat(d.avg_score))
  const points = scores.map((score, index) => {
    const x = (index / (scores.length - 1 || 1)) * width
    const y = height - (score / 100) * height
    return [x, y]
  })

  if (points.length < 2) return ''

  // Build SVG path
  let d = `M ${points[0][0]} ${points[0][1]}`

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[0]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = i !== points.length - 2 ? points[i + 2] : p2

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6

    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0]} ${p2[1]}`
  }

  return d
}

const getAreaPath = () => {
  const path = getSmoothTrendPath()
  if (!path) return ''
  return `${path} L 100,60 L 0,60 Z`
}

const getBarHeight = (score) => {
  return `${parseFloat(score)}%`
}

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/login')
    return
  }
  fetchDashboardData()
})
</script>

<template>
  <div class="h-full flex flex-col overflow-y-auto bg-background p-6 space-y-8 custom-scrollbar">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p class="text-muted-foreground">
          Welcome back, {{ user?.name || user?.email?.split('@')[0] || 'Student' }}! Here's your
          learning overview.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <Button
          variant="outline"
          @click="fetchDashboardData"
          class="rounded-xl"
          :disabled="isLoading"
        >
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          Refresh
        </Button>
        <Button
          @click="handleGenerateReport"
          class="rounded-xl shadow-sm"
          :disabled="isGeneratingReport"
        >
          <Loader2 v-if="isGeneratingReport" class="mr-2 h-4 w-4 animate-spin" />
          <Download v-else class="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>
    </div>

    <div v-if="isLoading && !dashboardData" class="flex-1 flex items-center justify-center">
      <Loader2 class="h-10 w-10 animate-spin text-primary" />
    </div>

    <template v-else>
      <!-- Stats Grid -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card class="rounded-2xl border-muted/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium"> Uploaded Materials </CardTitle>
            <FileText class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.uploaded_count || 0 }}</div>
            <p class="text-xs text-muted-foreground">Documents processed</p>
          </CardContent>
        </Card>
        <Card class="rounded-2xl border-muted/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium"> Quizzes Taken </CardTitle>
            <Brain class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ stats.quiz_count || 0 }}</div>
            <p class="text-xs text-muted-foreground">Total assessments</p>
          </CardContent>
        </Card>
        <Card class="rounded-2xl border-muted/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle class="text-sm font-medium"> Average Score </CardTitle>
            <Target class="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">{{ parseFloat(stats.avg_score || 0).toFixed(1) }}%</div>
            <p class="text-xs text-muted-foreground">Across all quizzes</p>
          </CardContent>
        </Card>
      </div>

      <!-- Recommendation Banner -->
      <div
        v-if="recommendation"
        class="bg-primary/5 border border-primary/10 rounded-2xl p-4 flex items-start gap-4"
      >
        <div class="p-2 bg-primary/10 rounded-xl">
          <Sparkles class="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 class="font-semibold text-sm text-foreground mb-1">AI Recommendation</h3>
          <p class="text-sm text-muted-foreground mb-3">
            {{ recommendation.text }}
          </p>
          <Button
            v-if="recommendation.action === 'chat'"
            size="sm"
            variant="outline"
            class="rounded-lg h-8 text-xs"
            @click="router.push('/ai-tutor')"
          >
            Chat with AI Tutor
          </Button>
          <Button
            v-else-if="recommendation.action === 'quiz'"
            size="sm"
            variant="outline"
            class="rounded-lg h-8 text-xs"
            @click="router.push('/quizzes')"
          >
            Take a Quiz
          </Button>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <!-- Performance Trend Chart -->
        <Card class="col-span-4 rounded-2xl border-muted/50 shadow-sm">
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>Your quiz scores over time</CardDescription>
          </CardHeader>
          <CardContent class="pl-2">
            <div class="h-[200px] w-full mt-4 flex items-end justify-center relative group">
              <svg
                v-if="charts.performance_trend?.length > 1"
                viewBox="0 0 100 60"
                class="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <!-- Defs for Gradient -->
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-color="hsl(var(--primary))" stop-opacity="0.2" />
                    <stop offset="100%" stop-color="hsl(var(--primary))" stop-opacity="0" />
                  </linearGradient>
                </defs>

                <!-- Grid Lines -->
                <line
                  v-for="i in 5"
                  :key="i"
                  x1="0"
                  :y1="i * 12"
                  x2="100"
                  :y2="i * 12"
                  stroke="currentColor"
                  stroke-opacity="0.05"
                  stroke-width="0.5"
                />

                <!-- Area Fill -->
                <path
                  :d="getAreaPath()"
                  fill="url(#chartGradient)"
                  stroke="none"
                  class="transition-all duration-500"
                />

                <!-- Line Path -->
                <path
                  :d="getSmoothTrendPath()"
                  fill="none"
                  stroke="hsl(var(--primary))"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="vector-effect-non-scaling-stroke drop-shadow-sm"
                />

                <!-- Interactive Dots -->
                <circle
                  v-for="(point, i) in charts.performance_trend"
                  :key="i"
                  :cx="(i / (charts.performance_trend.length - 1)) * 100"
                  :cy="60 - (parseFloat(point.avg_score) / 100) * 60"
                  r="0"
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--primary))"
                  stroke-width="2"
                  class="group-hover:r-[2] transition-all duration-300"
                />
              </svg>
              <div
                v-else
                class="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground"
              >
                <TrendingUp class="h-8 w-8 mb-2 opacity-20" />
                <span class="text-sm">Not enough data to show trend</span>
              </div>
            </div>
            <!-- X Axis Labels -->
            <div class="flex justify-between mt-2 px-1">
              <span class="text-[10px] text-muted-foreground">Earlier</span>
              <span class="text-[10px] text-muted-foreground">Latest</span>
            </div>
          </CardContent>
        </Card>

        <!-- Topic Strengths & Insights -->
        <Card class="col-span-3 rounded-2xl border-muted/50 shadow-sm flex flex-col">
          <CardHeader>
            <CardTitle>Insights & Strengths</CardTitle>
            <CardDescription>AI analysis of your performance</CardDescription>
          </CardHeader>
          <CardContent class="flex-1 space-y-6">
            <!-- Topic Bars -->
            <div class="space-y-3">
              <h4 class="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                Topic Proficiency
              </h4>
              <div v-if="charts.topic_strengths?.length" class="space-y-3">
                <div
                  v-for="(topic, i) in charts.topic_strengths.slice(0, 3)"
                  :key="i"
                  class="space-y-1"
                >
                  <div class="flex items-center justify-between text-xs">
                    <span class="font-medium truncate max-w-[150px]">{{
                      topic.topic || 'Unknown Topic'
                    }}</span>
                    <span class="text-muted-foreground"
                      >{{ parseFloat(topic.avg_score).toFixed(0) }}%</span
                    >
                  </div>
                  <div class="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      class="h-full bg-primary rounded-full"
                      :style="{ width: getBarHeight(topic.avg_score) }"
                    ></div>
                  </div>
                </div>
              </div>
              <div v-else class="text-xs text-muted-foreground italic">
                No topic data available yet.
              </div>
            </div>

            <!-- Insights List -->
            <div class="space-y-3">
              <h4 class="text-xs font-semibold uppercase text-muted-foreground tracking-wider">
                AI Observations
              </h4>
              <ul v-if="insights.length" class="space-y-2">
                <li
                  v-for="(insight, i) in insights.slice(0, 3)"
                  :key="i"
                  class="text-xs text-muted-foreground flex gap-2 items-start"
                >
                  <span class="bg-primary/20 p-0.5 rounded-full mt-0.5 shrink-0">
                    <Check class="h-2 w-2 text-primary opacity-0" />
                  </span>
                  <span>{{ insight }}</span>
                </li>
              </ul>
              <div v-else class="text-xs text-muted-foreground italic">
                Complete more activities to generate insights.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </template>

    <!-- Report Modal -->
    <Teleport to="body">
      <div
        v-if="showReportModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        @click.self="showReportModal = false"
      >
        <div
          class="bg-background rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-0 animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col overflow-hidden"
        >
          <!-- Modal Header -->
          <div class="p-6 border-b flex items-center justify-between bg-muted/20">
            <div class="flex items-center gap-3">
              <div class="bg-primary/10 p-2 rounded-xl">
                <FileText class="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 class="text-xl font-bold">Progress Report</h2>
                <p class="text-xs text-muted-foreground" v-if="reportData?.generated_at">
                  Generated on {{ formatters.date(reportData.generated_at, 'full') }}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" @click="showReportModal = false">
              <X class="h-4 w-4" />
            </Button>
          </div>

          <!-- Report Content -->
          <div class="p-6 overflow-y-auto custom-scrollbar space-y-6">
            <div v-if="isGeneratingReport" class="flex flex-col items-center justify-center py-12">
              <Loader2 class="h-8 w-8 animate-spin text-primary mb-2" />
              <p class="text-muted-foreground">Generating comprehensive report...</p>
            </div>

            <template v-else-if="reportData">
              <!-- Summary Section -->
              <div class="bg-primary/5 p-4 rounded-xl border border-primary/10">
                <h3 class="font-semibold mb-2 flex items-center gap-2 text-primary">
                  <Sparkles class="h-4 w-4" />
                  Executive Summary
                </h3>
                <p class="text-sm leading-relaxed text-muted-foreground">
                  {{ reportData.summary }}
                </p>
              </div>

              <!-- Key Metrics Grid -->
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-muted/30 p-4 rounded-xl">
                  <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Total Quizzes
                  </div>
                  <div class="text-2xl font-bold">{{ reportData.total_quizzes }}</div>
                </div>
                <div class="bg-muted/30 p-4 rounded-xl">
                  <div class="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                    Average Score
                  </div>
                  <div class="text-2xl font-bold">
                    {{ parseFloat(reportData.average_score).toFixed(1) }}%
                  </div>
                </div>
              </div>

              <!-- Strengths & Weaknesses -->
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 class="font-semibold mb-3 flex items-center gap-2 text-green-600">
                    <TrendingUp class="h-4 w-4" />
                    Strengths
                  </h4>
                  <ul v-if="reportData.strengths?.length" class="space-y-2">
                    <li
                      v-for="(item, i) in reportData.strengths"
                      :key="i"
                      class="text-sm bg-green-500/10 text-green-600 px-3 py-2 rounded-lg border border-green-500/20"
                    >
                      {{ item }}
                    </li>
                  </ul>
                  <p v-else class="text-sm text-muted-foreground italic">
                    No specific strengths identified yet.
                  </p>
                </div>

                <div>
                  <h4 class="font-semibold mb-3 flex items-center gap-2 text-red-500">
                    <AlertCircle class="h-4 w-4" />
                    Areas for Improvement
                  </h4>
                  <ul v-if="reportData.weaknesses?.length" class="space-y-2">
                    <li
                      v-for="(item, i) in reportData.weaknesses"
                      :key="i"
                      class="text-sm bg-red-500/10 text-red-600 px-3 py-2 rounded-lg border border-red-500/20"
                    >
                      {{ item }}
                    </li>
                  </ul>
                  <p v-else class="text-sm text-muted-foreground italic">
                    No active weaknesses detected.
                  </p>
                </div>
              </div>

              <div>
                <h4 class="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen class="h-4 w-4 text-primary" />
                  Topics Studied
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="(topic, i) in reportData.topics_studied"
                    :key="i"
                    class="text-xs bg-muted px-2.5 py-1 rounded-full text-foreground/80"
                  >
                    {{ topic }}
                  </span>
                </div>
              </div>
            </template>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 border-t bg-muted/20 flex justify-end gap-2">
            <Button variant="outline" @click="showReportModal = false"> Close </Button>
            <Button @click="window.print()" class="gap-2">
              <Download class="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted));
  border-radius: 9999px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border));
}

/* Ensure chart maintains aspect ratio */
.vector-effect-non-scaling-stroke {
  vector-effect: non-scaling-stroke;
}
</style>
