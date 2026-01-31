import { ref } from 'vue'

const toasts = ref([])
let toastIdCounter = 0

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 5000

function toast({ title, description, variant = 'default', duration = TOAST_REMOVE_DELAY }) {
  const id = toastIdCounter++

  const newToast = {
    id,
    title,
    description,
    variant,
    open: true,
  }

  toasts.value = [newToast, ...toasts.value].slice(0, TOAST_LIMIT)

  if (duration > 0) {
    setTimeout(() => {
      dismiss(id)
    }, duration)
  }

  return { id, dismiss: () => dismiss(id) }
}

function dismiss(toastId) {
  const index = toasts.value.findIndex((t) => t.id === toastId)
  if (index !== -1) {
    toasts.value[index].open = false
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== toastId)
    }, 300)
  }
}

export function useToast() {
  return {
    toasts,
    toast,
    dismiss,
  }
}
