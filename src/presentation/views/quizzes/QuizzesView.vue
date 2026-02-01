<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Loader2, BookOpen, Trophy, Clock, ChevronRight, Sparkles, X } from 'lucide-vue-next'
import { quizzesApi } from '@/infrastructure/api/quizzesApi'
import { Button, Input, Label } from '@/presentation/components/common/ui'
import { useToast } from '@/presentation/composables/useToast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/common/ui/card'
import { formatters } from '@/shared/utils/formatters'

const { toast } = useToast()
const router = useRouter()

const quizzes = ref([])
const isLoading = ref(false)
const isGenerating = ref(false)
const showGenerateModal = ref(false)

// Generate quiz form
const generateForm = ref({
  topic: '',
  difficulty: 1,
})

const difficultyLevels = [
  { value: 1, label: 'Easy', color: 'text-green-500' },
  { value: 2, label: 'Medium', color: 'text-yellow-500' },
  { value: 3, label: 'Hard', color: 'text-red-500' },
]

const fetchQuizzes = async () => {
  isLoading.value = true
  try {
    const response = await quizzesApi.getAllQuizzes()
    quizzes.value = Array.isArray(response) ? response : response.data || response.quizzes || []
  } catch (e) {
    toast({
      title: 'Error',
      description: 'Failed to fetch quizzes',
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}

const handleGenerateQuiz = async () => {
  if (!generateForm.value.topic.trim()) {
    toast({
      title: 'Validation Error',
      description: 'Please enter a topic for the quiz',
      variant: 'destructive',
    })
    return
  }

  isGenerating.value = true
  try {
    const response = await quizzesApi.generateQuiz(
      generateForm.value.topic,
      generateForm.value.difficulty,
    )

    toast({
      title: 'Quiz Generated!',
      description: 'Your quiz is ready to take',
      variant: 'success',
    })

    showGenerateModal.value = false
    generateForm.value = { topic: '', difficulty: 1 }

    // If API returns the new quiz with an ID, navigate to it
    if (response.quiz?.id || response.id) {
      router.push(`/quiz/${response.quiz?.id || response.id}`)
    } else {
      await fetchQuizzes()
    }
  } catch (e) {
    toast({
      title: 'Generation Failed',
      description: e.response?.data?.message || 'Failed to generate quiz',
      variant: 'destructive',
    })
  } finally {
    isGenerating.value = false
  }
}

const startQuiz = (quizId) => {
  router.push(`/quiz/${quizId}`)
}

const getDifficultyLabel = (level) => {
  const diff = difficultyLevels.find((d) => d.value === level)
  return diff ? diff.label : 'Unknown'
}

const getDifficultyColor = (level) => {
  const diff = difficultyLevels.find((d) => d.value === level)
  return diff ? diff.color : 'text-muted-foreground'
}

onMounted(fetchQuizzes)
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden bg-background p-6 space-y-6">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Quizzes</h1>
        <p class="text-muted-foreground mt-1">
          Test your knowledge with AI-generated quizzes based on your learning materials.
        </p>
      </div>

      <Button
        @click="showGenerateModal = true"
        class="rounded-xl shadow-md transition-all hover:scale-[1.02]"
      >
        <Sparkles class="mr-2 h-4 w-4" />
        Generate Quiz
      </Button>
    </div>

    <!-- Quizzes Content Area -->
    <div class="flex-1 overflow-hidden min-h-0">
      <div
        v-if="isLoading && quizzes.length === 0"
        class="flex flex-col items-center justify-center h-64 space-y-4"
      >
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
        <p class="text-muted-foreground">Loading quizzes...</p>
      </div>

      <div
        v-else-if="quizzes.length === 0"
        class="flex flex-col items-center justify-center h-80 border-2 border-dashed rounded-3xl bg-muted/5 animate-in fade-in zoom-in duration-500"
      >
        <div class="bg-primary/5 p-6 rounded-full mb-4">
          <BookOpen class="h-12 w-12 text-primary/40" />
        </div>
        <h3 class="text-xl font-semibold">No quizzes yet</h3>
        <p class="text-muted-foreground max-w-xs text-center mt-2">
          Generate your first quiz to test your knowledge on any topic.
        </p>
        <Button variant="outline" class="mt-6 rounded-xl" @click="showGenerateModal = true">
          <Plus class="mr-2 h-4 w-4" />
          Create first quiz
        </Button>
      </div>

      <div v-else class="h-full overflow-y-auto pr-2 custom-scrollbar">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
          <Card
            v-for="quiz in quizzes"
            :key="quiz.id"
            class="group hover:shadow-lg transition-all duration-300 border-muted/50 overflow-hidden rounded-2xl cursor-pointer"
            @click="startQuiz(quiz.id)"
          >
            <CardHeader class="pb-3">
              <div class="flex items-start justify-between">
                <div
                  class="bg-primary/10 p-2.5 rounded-xl group-hover:bg-primary/20 transition-colors"
                >
                  <BookOpen class="h-5 w-5 text-primary" />
                </div>
                <span
                  class="text-xs font-medium px-2 py-1 rounded-full"
                  :class="[getDifficultyColor(quiz.difficulty), 'bg-muted/50']"
                >
                  {{ getDifficultyLabel(quiz.difficulty) }}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle class="text-[15px] line-clamp-2 mb-2">
                {{ quiz.topic || quiz.title || 'Untitled Quiz' }}
              </CardTitle>
              <CardDescription class="text-xs flex flex-col gap-2">
                <div class="flex items-center gap-4">
                  <span
                    v-if="quiz.questions_count || quiz.total_questions"
                    class="flex items-center gap-1"
                  >
                    <BookOpen class="h-3 w-3" />
                    {{ quiz.questions_count || quiz.total_questions }} questions
                  </span>
                  <span
                    v-if="quiz.score !== undefined && quiz.score !== null"
                    class="flex items-center gap-1"
                  >
                    <Trophy class="h-3 w-3 text-yellow-500" />
                    {{ quiz.score }}%
                  </span>
                </div>
                <span v-if="quiz.created_at" class="text-[10px] opacity-70">
                  {{ formatters.date(quiz.created_at, 'short') }}
                </span>
              </CardDescription>

              <div
                class="mt-4 flex items-center text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span>{{ quiz.score !== undefined ? 'Review' : 'Start Quiz' }}</span>
                <ChevronRight class="h-3 w-3 ml-1" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    <!-- Generate Quiz Modal -->
    <Teleport to="body">
      <div
        v-if="showGenerateModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        @click.self="showGenerateModal = false"
      >
        <div
          class="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in zoom-in-95 duration-200"
        >
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-3">
              <div class="bg-primary/10 p-2 rounded-xl">
                <Sparkles class="h-5 w-5 text-primary" />
              </div>
              <h2 class="text-xl font-semibold">Generate Quiz</h2>
            </div>
            <Button variant="ghost" size="icon" @click="showGenerateModal = false">
              <X class="h-4 w-4" />
            </Button>
          </div>

          <div class="space-y-4">
            <div class="space-y-2">
              <Label for="topic">Topic</Label>
              <Input
                id="topic"
                v-model="generateForm.topic"
                placeholder="e.g., Introduction to Machine Learning"
                class="rounded-xl"
              />
            </div>

            <div class="space-y-2">
              <Label>Difficulty</Label>
              <div class="flex gap-2">
                <Button
                  v-for="level in difficultyLevels"
                  :key="level.value"
                  :variant="generateForm.difficulty === level.value ? 'default' : 'outline'"
                  size="sm"
                  class="flex-1 rounded-xl"
                  @click="generateForm.difficulty = level.value"
                >
                  <span :class="generateForm.difficulty !== level.value ? level.color : ''">
                    {{ level.label }}
                  </span>
                </Button>
              </div>
            </div>

            <Button
              @click="handleGenerateQuiz"
              :disabled="isGenerating"
              class="w-full rounded-xl mt-6"
            >
              <template v-if="isGenerating">
                <Loader2 class="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </template>
              <template v-else>
                <Sparkles class="mr-2 h-4 w-4" />
                Generate Quiz
              </template>
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
</style>
