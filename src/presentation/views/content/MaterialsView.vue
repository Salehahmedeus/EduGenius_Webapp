<script setup>
import { ref, onMounted, computed } from 'vue'
import { Plus, Search, FileText, Trash2, Loader2, UploadCloud } from 'lucide-vue-next'
import { contentApi } from '@/infrastructure/api/contentApi'
import { Button, Input } from '@/presentation/components/common/ui'
import { useToast } from '@/presentation/composables/useToast'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/common/ui/card'

const { toast } = useToast()
const materials = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const isUploading = ref(false)
const uploadProgress = ref(0)
const fileInput = ref(null)

const fetchMaterials = async () => {
  isLoading.value = true
  try {
    const response = await contentApi.getMaterials()
    // Based on common API patterns in this project (data or direct array)
    materials.value = Array.isArray(response) ? response : response.data || []
  } catch (e) {
    toast({
      title: 'Error',
      description: 'Failed to fetch materials',
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    return fetchMaterials()
  }

  isLoading.value = true
  try {
    const response = await contentApi.searchMaterials(searchQuery.value)
    materials.value = Array.isArray(response) ? response : response.data || []
  } catch (e) {
    toast({
      title: 'Search Error',
      description: 'Failed to search materials',
      variant: 'destructive',
    })
  } finally {
    isLoading.value = false
  }
}

const triggerUpload = () => {
  fileInput.value.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  isUploading.value = true
  uploadProgress.value = 0

  try {
    await contentApi.uploadMaterial(file, (progress) => {
      uploadProgress.value = progress
    })

    toast({
      title: 'Success',
      description: 'Material uploaded successfully',
      variant: 'success',
    })

    await fetchMaterials()
  } catch (e) {
    toast({
      title: 'Upload Failed',
      description: e.response?.data?.message || 'Failed to upload file',
      variant: 'destructive',
    })
  } finally {
    isUploading.value = false
    uploadProgress.value = 0
    if (fileInput.value) fileInput.value.value = ''
  }
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this material?')) return

  try {
    await contentApi.deleteMaterial(id)
    toast({
      title: 'Deleted',
      description: 'Material removed successfully',
      variant: 'success',
    })
    // Remove from local list to avoid extra fetch
    materials.value = materials.value.filter((m) => m.id !== id)
  } catch (e) {
    toast({
      title: 'Error',
      description: 'Failed to delete material',
      variant: 'destructive',
    })
  }
}

onMounted(fetchMaterials)

const filteredMaterials = computed(() => {
  // If we want local filtering as well
  return materials.value.filter((m) =>
    (m.name || m.title || '').toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})
</script>

<template>
  <div class="h-full flex flex-col overflow-hidden bg-background p-6 space-y-6">
    <!-- Header Area -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Educational Materials</h1>
        <p class="text-muted-foreground mt-1">
          Upload and manage your learning resources for AI-powered assistance.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <input
          type="file"
          ref="fileInput"
          class="hidden"
          @change="handleFileUpload"
          accept=".pdf,.doc,.docx,.txt"
        />
        <Button
          @click="triggerUpload"
          :disabled="isUploading"
          class="rounded-xl shadow-md transition-all hover:scale-[1.02]"
        >
          <template v-if="isUploading">
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
            Uploading {{ uploadProgress }}%
          </template>
          <template v-else>
            <Plus class="mr-2 h-4 w-4" />
            Upload Material
          </template>
        </Button>
      </div>
    </div>

    <!-- Search & Filter Area -->
    <div class="relative max-w-md w-full">
      <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        v-model="searchQuery"
        placeholder="Search materials..."
        class="pl-10 h-11 bg-muted/30 border-none focus-visible:ring-1 rounded-xl"
        @keyup.enter="handleSearch"
      />
    </div>

    <!-- Materials Content Area -->
    <div class="flex-1 overflow-hidden min-h-0">
      <div
        v-if="isLoading && materials.length === 0"
        class="flex flex-col items-center justify-center h-64 space-y-4"
      >
        <Loader2 class="h-8 w-8 animate-spin text-primary" />
        <p class="text-muted-foreground">Loading materials...</p>
      </div>

      <div
        v-else-if="materials.length === 0"
        class="flex flex-col items-center justify-center h-80 border-2 border-dashed rounded-3xl bg-muted/5 animate-in fade-in zoom-in duration-500"
      >
        <div class="bg-primary/5 p-6 rounded-full mb-4">
          <UploadCloud class="h-12 w-12 text-primary/40" />
        </div>
        <h3 class="text-xl font-semibold">No materials yet</h3>
        <p class="text-muted-foreground max-w-xs text-center mt-2">
          Start by uploading your course documents, PDFs, or notes to get AI-powered insights.
        </p>
        <Button variant="outline" class="mt-6 rounded-xl" @click="triggerUpload">
          Upload first document
        </Button>
      </div>

      <div v-else class="h-full overflow-y-auto pr-2 custom-scrollbar">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8">
          <Card
            v-for="material in filteredMaterials"
            :key="material.id"
            class="group hover:shadow-lg transition-all duration-300 border-muted/50 overflow-hidden rounded-2xl cursor-default"
          >
            <CardHeader class="pb-3 flex flex-row items-start justify-between space-y-0">
              <div
                class="bg-primary/10 p-2.5 rounded-xl group-hover:bg-primary/20 transition-colors"
              >
                <FileText class="h-5 w-5 text-primary" />
              </div>
              <Button
                variant="ghost"
                size="icon"
                class="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                @click="handleDelete(material.id)"
              >
                <Trash2 class="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <CardTitle class="text-[15px] line-clamp-1 mb-1">{{
                material.name || material.title || 'Untitled'
              }}</CardTitle>
              <CardDescription class="text-xs flex flex-col gap-1">
                <span
                  >{{ material.file_type || 'Document' }} • {{ material.file_size || '---' }}</span
                >
                <span v-if="material.created_at" class="text-[10px] opacity-70"
                  >Added on {{ new Date(material.created_at).toLocaleDateString() }}</span
                >
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
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

@keyframes zoom-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
