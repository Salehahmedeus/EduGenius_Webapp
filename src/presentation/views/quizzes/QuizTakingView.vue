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
  Lightbulb,
  Eye,
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
const isReviewMode = ref(false)
const showExplanation = ref(false)
const submissionDetails = ref({}) // Store submission details by question_id

const currentQuestion = computed(() => questions.value[currentIndex.value] || null)
const isFirstQuestion = computed(() => currentIndex.value === 0)
const isLastQuestion = computed(() => currentIndex.value === questions.value.length - 1)
const answeredCount = computed(() => Object.keys(answers.value).length)
const progress = computed(() => (answeredCount.value / questions.value.length) * 100)

// Helper to find the correct answer index from option text
const getCorrectAnswerIndex = (question) => {
  if (!question || !question.correct_answer) return -1
  return question.options.findIndex((opt) => opt === question.correct_answer)
}

const fetchQuiz = async () => {
  isLoading.value = true
  try {
    const quizId = route.params.id
    const response = await quizzesApi.getQuiz(quizId)

    // Normalize response structure
    quiz.value = response.quiz || response
    questions.value = quiz.value.questions || response.questions || []

    // Check if this is a completed quiz (for review)
    if (quiz.value.is_completed || quiz.value.result) {
      isReviewMode.value = true
      submitted.value = true

      // Calculate result from stored data if available
      if (quiz.value.result) {
        result.value = {
          score: quiz.value.result.score || 0,
          correct: quiz.value.result.correct_count || 0,
          total: questions.value.length,
        }
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
  showExplanation.value = false
  if (!isLastQuestion.value) {
    currentIndex.value++
  }
}

const goPrev = () => {
  showExplanation.value = false
  if (!isFirstQuestion.value) {
    currentIndex.value--
  }
}

const goToQuestion = (index) => {
  showExplanation.value = false
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

    // Store submission details for review
    const details = response.data?.details || response.details || []
    details.forEach((detail) => {
      submissionDetails.value[detail.question_id] = detail
    })

    submitted.value = true
    result.value = {
      score: response.data?.score ?? response.score ?? 0,
      correct: response.data?.correct_answers ?? response.correct_count ?? 0,
      total: response.data?.total_questions ?? questions.value.length,
      feedback: response.data?.feedback || response.feedback || '',
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

const startReview = () => {
  isReviewMode.value = true
  currentIndex.value = 0
  showExplanation.value = false
}

// Get user's answer details from submission
const getQuestionDetails = (questionId) => {
  return submissionDetails.value[questionId] || null
}

// Get user's selected option index from submission details or local answers
const getUserSelectedIndex = (question) => {
  const details = getQuestionDetails(question.id)
  if (details && details.selected_option !== null && details.selected_option !== undefined) {
    // If selected_option is a number (index), use it directly
    if (typeof details.selected_option === 'number') {
      return details.selected_option
    }
    // If it's a string (answer text), find the index
    return question.options.findIndex(
      (opt) => opt === details.selected_option || opt === details.user_answer,
    )
  }
  // Fall back to local answers
  return answers.value[question.id] ?? -1
}

// Check if user selected this option
const isUserSelectedOption = (question, optionIndex) => {
  return getUserSelectedIndex(question) === optionIndex
}

const getOptionClass = (question, optionIndex) => {
  const isSelected = isUserSelectedOption(question, optionIndex)
  const correctIndex = getCorrectAnswerIndex(question)
  const isCorrectOption = optionIndex === correctIndex

  if (!submitted.value && !isReviewMode.value) {
    const localSelected = answers.value[question.id] === optionIndex
    return localSelected
      ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
      : 'border-muted hover:border-primary/50 hover:bg-muted/50'
  }

  // In review/submitted mode, show correct/incorrect
  if (isCorrectOption) {
    return 'border-green-500 bg-green-500/10'
  }
  if (isSelected && !isCorrectOption) {
    return 'border-red-500 bg-red-500/10'
  }
  return 'border-muted opacity-50'
}

const isOptionCorrect = (question, optionIndex) => {
  return optionIndex === getCorrectAnswerIndex(question)
}

const isOptionWrong = (question, optionIndex) => {
  const isSelected = isUserSelectedOption(question, optionIndex)
  return isSelected && !isOptionCorrect(question, optionIndex)
}

// Get explanation from submission details or question
const getExplanation = (question) => {
  const details = getQuestionDetails(question.id)
  return details?.explanation || question.explanation || ''
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

    <!-- Results View (shown after submission, before review) -->
    <div
      v-else-if="submitted && result && !isReviewMode"
      class="flex-1 flex items-center justify-center p-6"
    >
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
            <Button class="flex-1 rounded-xl" @click="startReview">
              <Eye class="mr-2 h-4 w-4" />
              Review Answers
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Quiz Taking / Review View -->
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
          <div class="flex items-center gap-2">
            <span
              v-if="isReviewMode"
              class="text-xs font-medium px-2 py-1 rounded-full bg-blue-500/10 text-blue-500"
            >
              Review Mode
            </span>
            <span class="text-sm text-muted-foreground">
              Question {{ currentIndex + 1 }} of {{ questions.length }}
            </span>
          </div>
          <div class="text-sm font-medium">
            <span v-if="!isReviewMode">{{ answeredCount }}/{{ questions.length }} answered</span>
            <span v-else class="text-muted-foreground">Viewing answers</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="h-2 bg-muted rounded-full overflow-hidden">
          <div
            class="h-full transition-all duration-300 rounded-full"
            :class="isReviewMode ? 'bg-blue-500' : 'bg-primary'"
            :style="{
              width: isReviewMode
                ? `${((currentIndex + 1) / questions.length) * 100}%`
                : `${progress}%`,
            }"
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
                : isReviewMode
                  ? getCorrectAnswerIndex(q) === answers[q.id]
                    ? 'bg-green-500/20 text-green-600'
                    : 'bg-red-500/20 text-red-600'
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
          <h2 class="text-xl font-semibold mb-6">
            {{ currentQuestion.question_text || currentQuestion.question }}
          </h2>

          <div class="space-y-3">
            <button
              v-for="(option, optionIndex) in currentQuestion.options"
              :key="optionIndex"
              @click="selectAnswer(currentQuestion.id, optionIndex)"
              class="w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3"
              :class="getOptionClass(currentQuestion, optionIndex)"
              :disabled="submitted || isReviewMode"
            >
              <div
                class="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 font-medium"
                :class="[
                  isReviewMode || submitted
                    ? isOptionCorrect(currentQuestion, optionIndex)
                      ? 'border-green-500 bg-green-500 text-white'
                      : isOptionWrong(currentQuestion, optionIndex)
                        ? 'border-red-500 bg-red-500 text-white'
                        : isUserSelectedOption(currentQuestion, optionIndex)
                          ? 'border-orange-500 bg-orange-500 text-white'
                          : 'border-muted-foreground/30'
                    : answers[currentQuestion.id] === optionIndex
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground/30',
                ]"
              >
                {{ String.fromCharCode(65 + optionIndex) }}
              </div>
              <div class="flex-1 flex flex-col gap-1">
                <span>{{ option }}</span>
                <!-- Labels for review mode -->
                <div v-if="isReviewMode || submitted" class="flex gap-2 flex-wrap">
                  <span
                    v-if="isUserSelectedOption(currentQuestion, optionIndex)"
                    class="text-[10px] font-medium px-1.5 py-0.5 rounded"
                    :class="
                      isOptionCorrect(currentQuestion, optionIndex)
                        ? 'bg-green-500/20 text-green-600'
                        : 'bg-red-500/20 text-red-600'
                    "
                  >
                    Your Answer
                  </span>
                  <span
                    v-if="
                      isOptionCorrect(currentQuestion, optionIndex) &&
                      !isUserSelectedOption(currentQuestion, optionIndex)
                    "
                    class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-green-500/20 text-green-600"
                  >
                    Correct Answer
                  </span>
                </div>
              </div>
              <CheckCircle
                v-if="(isReviewMode || submitted) && isOptionCorrect(currentQuestion, optionIndex)"
                class="h-5 w-5 text-green-500"
              />
              <XCircle
                v-if="(isReviewMode || submitted) && isOptionWrong(currentQuestion, optionIndex)"
                class="h-5 w-5 text-red-500"
              />
            </button>
          </div>

          <!-- Explanation Section (Review Mode) -->
          <div v-if="(isReviewMode || submitted) && getExplanation(currentQuestion)" class="mt-6">
            <Button
              variant="outline"
              size="sm"
              class="rounded-xl mb-3"
              @click="showExplanation = !showExplanation"
            >
              <Lightbulb class="mr-2 h-4 w-4 text-yellow-500" />
              {{ showExplanation ? 'Hide' : 'Show' }} Explanation
            </Button>

            <div
              v-if="showExplanation"
              class="p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20 animate-in slide-in-from-top-2 duration-200"
            >
              <div class="flex items-start gap-3">
                <Lightbulb class="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <p class="text-sm text-muted-foreground leading-relaxed">
                  {{ getExplanation(currentQuestion) }}
                </p>
              </div>
            </div>
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
            v-if="isLastQuestion && !submitted && !isReviewMode"
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

          <Button
            v-else-if="isLastQuestion && isReviewMode"
            @click="router.push('/quizzes')"
            class="rounded-xl"
          >
            Finish Review
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
