<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  Home,
} from 'lucide-vue-next'
import { quizzesApi } from '@/infrastructure/api/quizzesApi'
import { Button } from '@/presentation/components/common/ui'
import { useToast } from '@/presentation/composables/useToast'
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/common/ui/card'

const { toast } = useToast()
const route = useRoute()
const router = useRouter()

const quiz = ref(null)
const questions = ref([])
const currentIndex = ref(0)
const answers = ref({})
const isLoading = ref(true)
const isSubmitting = ref(false)
const submitted = ref(false)
const result = ref(null)

const currentQuestion = computed(() => questions.value[currentIndex.value] || null)
const isFirstQuestion = computed(() => currentIndex.value === 0)
const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1)
const answeredCount = computed(() => Object.keys(answers.value).length)
const progress = computed(() => (answeredCount.value / questions.value.length) * 100)

const fetchQuiz = async () => {
  isLoading.value = true
  try {
    const quizId = route.params.id
    const response = await quizzesApi.getQuiz(quizId)

    // Normalize response structure
    quiz.value = response.quiz || response
    questions.value = quiz.value.questions || response.questions || []

    // If quiz was already taken, show results
    if (quiz.value.score !== undefined && quiz.value.score !== null) {
      submitted.value = true
      result.value = {
        score: quiz.value.score,
        correct: quiz.value.correct_count || 0,
        total: questions.value.length,
      }
      // Pre-fill answers if attempt_details exist
      if (quiz.value.attempt_details) {
        quiz.value.attempt_details.forEach((detail) => {
          answers.value[detail.question_id] = detail.selected_option
        })
      }
    }
  } catch (e) {
    toast({
      title: 'Error',
      description: 'Failed to load quiz',
      variant: 'destructive',
    })
    router.push('/quizzes')
  } finally {
    isLoading.value = false
  }
}

const selectAnswer = (questionId, optionIndex) => {
  if (submitted.value) return
  answers.value[questionId] = optionIndex
}

const goNext = () => {
  if (!isLastQuestion.value) {
    currentIndex.value++
  }
}

const goPrev = () => {
  if (!isFirstQuestion.value) {
    currentIndex.value--
  }
}

const goToQuestion = (index) => {
  currentIndex.value = index
}

const handleSubmit = async () => {
  if (answeredCount.value < questions.value.length) {
    toast({
      title: 'Incomplete',
      description: 'Please answer all questions before submitting',
      variant: 'destructive',
    })
    return
  }

  isSubmitting.value = true
  try {
    const response = await quizzesApi.submitQuiz({
      quiz_id: quiz.value.id,
      answers: Object.entries(answers.value).map(([questionId, selectedOption]) => ({
        question_id: parseInt(questionId),
        selected_option: selectedOption,
      })),
    })

    submitted.value = true
    result.value = {
      score: response.score || response.result?.score || 0,
      correct: response.correct_count || response.result?.correct || 0,
      total: questions.value.length,
    }

    toast({
      title: 'Quiz Submitted!',
      description: `You scored ${result.value.score}%`,
      variant: 'success',
    })
  } catch (e) {
    toast({
      title: 'Submission Failed',
      description: e.response?.data?.message || 'Failed to submit quiz',
      variant: 'destructive',
    })
  } finally {
    isSubmitting.value = false
  }
}

const getOptionClass = (question, optionIndex) => {
  const isSelected = answers.value[question.id] === optionIndex

  if (!submitted.value) {
    return isSelected
      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
      : 'border-muted hover:border-primary/50 hover:bg-muted/50'
  }

  // After submission, show correct/incorrect
  const isCorrect = question.correct_answer === optionIndex
  const wasSelected = isSelected

  if (isCorrect) {
    return 'border-green-500 bg-green-500/10'
  }
  if (wasSelected && !isCorrect) {
    return 'border-red-500 bg-red-500/10'
  }
  return 'border-muted opacity-50'
}

onMounted(fetchQuiz)
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden bg-background">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center space-y-4">
        <Loader2 class="h-10 w-10 animate-spin text-primary mx-auto" />
        <p class="text-muted-foreground">Loading quiz...</p>
      </div>
    </div>

    <!-- Results View -->
    <div v-else-if="submitted && result" class="flex-1 flex items-center justify-center p-6">
      <Card class="w-full max-w-md text-center rounded-3xl shadow-lg">
        <CardHeader class="pb-2">
          <div class="mx-auto mb-4">
            <div
              class="h-24 w-24 rounded-full flex items-center justify-center"
              :class="result.score >= 70 ? 'bg-green-500/10' : 'bg-yellow-500/10'"
            >
              <Trophy
                class="h-12 w-12"
                :class="result.score >= 70 ? 'text-green-500' : 'text-yellow-500'"
              />
            </div>
          </div>
          <CardTitle class="text-2xl">
            {{ result.score >= 70 ? 'Great Job!' : 'Keep Practicing!' }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="text-5xl font-bold text-primary">{{ result.score }}%</div>
          <p class="text-muted-foreground">
            You got {{ result.correct }} out of {{ result.total }} questions correct
          </p>

          <div class="flex gap-3 pt-4">
            <Button variant="outline" class="flex-1 rounded-xl" @click="router.push('/quizzes')">
              <Home class="mr-2 h-4 w-4" />
              Back to Quizzes
            </Button>
            <Button class="flex-1 rounded-xl" @click="currentIndex = 0">
              <RotateCcw class="mr-2 h-4 w-4" />
              Review Answers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quiz Taking View -->
    <template v-else>
      <!-- Header -->
      <div
        class="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <Button variant="ghost" size="sm" @click="router.push('/quizzes')">
            <ChevronLeft class="h-4 w-4 mr-1" />
            Back
          </Button>
          <div class="text-sm text-muted-foreground">
            Question {{ currentIndex + 1 }} of {{ questions.length }}
          </div>
          <div class="text-sm font-medium">{{ answeredCount }}/{{ questions.length }} answered</div>
        </div>

        <!-- Progress Bar -->
        <div class="h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="h-full bg-primary transition-all duration-300 rounded-full"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>

        <!-- Question Navigator -->
        <div class="flex gap-1.5 mt-3 flex-wrap">
          <button
            v-for="(q, i) in questions"
            :key="q.id"
            @click="goToQuestion(i)"
            class="w-8 h-8 rounded-lg text-xs font-medium transition-all"
            :class="[
              i === currentIndex
                ? 'bg-primary text-primary-foreground'
                : answers[q.id] !== undefined
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80',
            ]"
          >
            {{ i + 1 }}
          </button>
        </div>
      </div>

      <!-- Question Content -->
      <div class="flex-1 overflow-y-auto p-6">
        <div v-if="currentQuestion" class="max-w-2xl mx-auto">
          <h2 class="text-xl font-semibold mb-6">{{ currentQuestion.question }}</h2>

          <div class="space-y-3">
            <button
              v-for="(option, optionIndex) in currentQuestion.options"
              :key="optionIndex"
              @click="selectAnswer(currentQuestion.id, optionIndex)"
              class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3"
              :class="getOptionClass(currentQuestion, optionIndex)"
              :disabled="submitted"
            >
              <div
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-medium"
                :class="
                  answers[currentQuestion.id] === optionIndex
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-muted-foreground/30'
                "
              >
                {{ String.fromCharCode(65 + optionIndex) }}
              </div>
              <span class="flex-1">{{ option }}</span>
              <CheckCircle
                v-if="submitted && currentQuestion.correct_answer === optionIndex"
                class="h-5 w-5 text-green-500"
              />
              <XCircle
                v-if="
                  submitted &&
                  answers[currentQuestion.id] === optionIndex &&
                  currentQuestion.correct_answer !== optionIndex
                "
                class="h-5 w-5 text-red-500"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Navigation -->
      <div class="border-t p-4 bg-background">
        <div class="flex items-center justify-between max-w-2xl mx-auto">
          <Button variant="outline" @click="goPrev" :disabled="isFirstQuestion" class="rounded-xl">
            <ChevronLeft class="h-4 w-4 mr-1" />
            Previous
          </Button>

          <Button
            v-if="isLastQuestion && !submitted"
            @click="handleSubmit"
            :disabled="isSubmitting || answeredCount < questions.length"
            class="rounded-xl px-8"
          >
            <template v-if="isSubmitting">
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </template>
            <template v-else> Submit Quiz </template>
          </Button>

          <Button v-else @click="goNext" :disabled="isLastQuestion" class="rounded-xl">
            Next
            <ChevronRight class="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </template>
  </div>
</template>
