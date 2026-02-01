<script setup>
import { ref, watch } from 'vue'
import { Send, Paperclip, X, FileText } from 'lucide-vue-next'
import { Button } from '@/presentation/components/common/ui'

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: 'Type a message...',
  },
})

const emit = defineEmits(['send'])

const message = ref('')
const fileInput = ref(null)
const selectedFile = ref(null)

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSend = () => {
  if (!message.value.trim() && !selectedFile.value) return

  emit('send', {
    query: message.value.trim(),
    file: selectedFile.value,
  })

  // Clear input
  message.value = ''
  removeFile()
}

const onKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}
</script>

<template>
  <div class="p-4 bg-background border-t">
    <div class="container mx-auto max-w-4xl relative">
      <!-- File Preview Chip -->
      <div
        v-if="selectedFile"
        class="absolute -top-12 left-0 flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full border shadow-sm animate-in fade-in slide-in-from-bottom-2"
      >
        <FileText class="h-4 w-4 text-primary" />
        <span class="text-xs truncate max-w-[150px]">{{ selectedFile.name }}</span>
        <button @click="removeFile" class="hover:text-destructive transition-colors ml-1">
          <X class="h-3.5 w-3.5" />
        </button>
      </div>

      <div
        class="relative flex items-end gap-2 bg-muted/30 rounded-2xl border p-2 focus-within:ring-1 focus-within:ring-primary/30 transition-shadow"
      >
        <!-- Attachment Button -->
        <button
          @click="fileInput.click()"
          class="p-2 text-muted-foreground hover:text-primary transition-colors rounded-xl hover:bg-muted"
          type="button"
          :disabled="isLoading"
        >
          <Paperclip class="h-5 w-5" />
          <input
            ref="fileInput"
            type="file"
            class="hidden"
            accept=".pdf,.doc,.docx"
            @change="handleFileSelect"
          />
        </button>

        <!-- Textarea -->
        <textarea
          v-model="message"
          rows="1"
          class="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2 px-1 text-sm max-h-32 text-foreground placeholder:text-muted-foreground"
          :placeholder="placeholder"
          @keydown="onKeyDown"
          ref="textarea"
          :disabled="isLoading"
        ></textarea>

        <!-- Send Button -->
        <Button
          @click="handleSend"
          size="icon"
          class="shrink-0 h-9 w-9 rounded-xl transition-all"
          :disabled="isLoading || (!message.trim() && !selectedFile)"
        >
          <Send v-if="!isLoading" class="h-4 w-4" />
          <div
            v-else
            class="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"
          ></div>
        </Button>
      </div>

      <p class="text-[10px] text-center mt-2 text-muted-foreground">
        AI can make mistakes. Check important info.
      </p>
    </div>
  </div>
</template>

<style scoped>
textarea {
  scrollbar-width: none;
}
textarea::-webkit-scrollbar {
  display: none;
}
</style>
