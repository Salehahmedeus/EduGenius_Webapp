<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus,
  Loader2,
  BookOpen,
  Trophy,
  ChevronRight,
  Sparkles,
  X,
  FileText,
  Check,
} from 'lucide-vue-next'
import { quizzesApi } from '@/infrastructure/api/quizzesApi'
import { contentApi } from '@/infrastructure/api/contentApi'
import { Button, Label } from '@/presentation/components/common/ui'
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
const materials = ref([])
const isLoading = ref(false)
const isLoadingMaterials = ref(false)
const isGenerating = ref(false)
const showGenerateModal = ref(false)

// Generate quiz form
const generateForm = ref({
  selectedMaterialIds: [],
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

const fetchMaterials = async () => {
  isLoadingMaterials.value = true
  try {
    const response = await contentApi.getMaterials()
    materials.value = Array.isArray(response) ? response : response.data || response.materials || []
  } catch (e) {
    console.error('Failed to fetch materials', e)
  } finally {
    isLoadingMaterials.value = false
  }
}

const openGenerateModal = async () => {
  showGenerateModal.value = true
  generateForm.value = { selectedMaterialIds: [], difficulty: 1 }
  if (materials.value.length === 0) {
    await fetchMaterials()
  }
}

const toggleMaterialSelection = (materialId) => {
  const index = generateForm.value.selectedMaterialIds.indexOf(materialId)
  if (index === -1) {
    generateForm.value.selectedMaterialIds.push(materialId)
  } else {
    generateForm.value.selectedMaterialIds.splice(index, 1)
  }
}

const isMaterialSelected = (materialId) => {
  return generateForm.value.selectedMaterialIds.includes(materialId)
}

const handleGenerateQuiz = async () => {
  if (generateForm.value.selectedMaterialIds.length === 0) {
    toast({
      title: 'Validation Error',
      description: 'Please select at least one material for the quiz',
      variant: 'destructive',
    })
    return
  }

  isGenerating.value = true
  try {
    const response = await quizzesApi.generateQuiz(
      generateForm.value.selectedMaterialIds,
      generateForm.value.difficulty,
    )

    // Extract quiz ID from various possible response structures
    const quizId = response.quiz?.id || response.id || response.data?.id || response.data?.quiz?.id

    showGenerateModal.value = false
    generateForm.value = { selectedMaterialIds: [], difficulty: 1 }

    if (quizId) {
      toast({
        title: 'Quiz Generated!',
        description: 'Opening your quiz now...',
        variant: 'success',
      })
      // Navigate directly to the generated quiz
      router.push(`/quiz/${quizId}`)
    } else {
      toast({
        title: 'Quiz Generated!',
        description: 'Your quiz is ready to take',
        variant: 'success',
      })
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
        @click="openGenerateModal"
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
          Generate your first quiz from your uploaded materials.
        </p>
        <Button variant="outline" class="mt-6 rounded-xl" @click="openGenerateModal">
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
                    v-if="quiz.questions_count || quiz.total_questions || quiz.questions?.length"
                    class="flex items-center gap-1"
                  >
                    <BookOpen class="h-3 w-3" />
                    {{ quiz.questions_count || quiz.total_questions || quiz.questions?.length }}
                    questions
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
                <span>{{ quiz.is_completed ? 'Review' : 'Start Quiz' }}</span>
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
          class="bg-background rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-in zoom-in-95 duration-200 max-h-[80vh] flex flex-col"
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

          <div class="space-y-4 flex-1 overflow-hidden flex flex-col">
            <!-- Material Selection -->
            <div class="space-y-2 flex-1 overflow-hidden flex flex-col">
              <Label>Select Materials</Label>
              <p class="text-xs text-muted-foreground">
                Choose one or more materials to generate quiz questions from.
              </p>

              <div v-if="isLoadingMaterials" class="flex items-center justify-center py-8">
                <Loader2 class="h-6 w-6 animate-spin text-primary" />
              </div>

              <div
                v-else-if="materials.length === 0"
                class="flex flex-col items-center justify-center py-8 text-center"
              >
                <FileText class="h-8 w-8 text-muted-foreground/50 mb-2" />
                <p class="text-sm text-muted-foreground">No materials uploaded yet</p>
                <Button variant="link" size="sm" @click="router.push('/materials')" class="mt-2">
                  Upload materials first
                </Button>
              </div>

              <div v-else class="flex-1 overflow-y-auto space-y-2 pr-1 max-h-48 custom-scrollbar">
                <button
                  v-for="material in materials"
                  :key="material.id"
                  @click="toggleMaterialSelection(material.id)"
                  class="w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left"
                  :class="
                    isMaterialSelected(material.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:border-primary/50'
                  "
                >
                  <div
                    class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0"
                    :class="
                      isMaterialSelected(material.id)
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground/30'
                    "
                  >
                    <Check
                      v-if="isMaterialSelected(material.id)"
                      class="h-3 w-3 text-primary-foreground"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium truncate">
                      {{ material.file_name || material.name || 'Untitled' }}
                    </p>
                    <p class="text-[10px] text-muted-foreground">
                      {{ formatters.fileSize(material.file_size) }}
                    </p>
                  </div>
                  <FileText class="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
              </div>

              <p v-if="generateForm.selectedMaterialIds.length > 0" class="text-xs text-primary">
                {{ generateForm.selectedMaterialIds.length }} material(s) selected
              </p>
            </div>

            <!-- Difficulty Selection -->
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
              :disabled="isGenerating || generateForm.selectedMaterialIds.length === 0"
              class="w-full rounded-xl mt-4"
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
