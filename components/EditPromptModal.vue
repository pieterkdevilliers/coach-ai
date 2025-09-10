<template>
  <UModal v-model="isOpenInternal">
    <UCard>
      <template #header>
        <h2 class="text-lg font-bold">Edit Prompt</h2>
      </template>

      <div class="space-y-4">
        <UTextarea
          v-model="form.prompt_text"
          label="Prompt Text"
          rows="6"
        />
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton type="button" variant="ghost" @click="close">Cancel</UButton>
          <UButton type="button" variant="solid" :loading="isSaving" @click="save">
            Save
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'
import { useAuthStore } from '~/stores/auth'

interface Prompt {
  id: number
  prompt_key: string
  prompt_text: string
  created_at: string
}

const props = defineProps<{
  isOpen: boolean
  prompt: { most_recent_prompt: Prompt } | null
}>()

const emit = defineEmits(['close', 'prompt-updated'])

const config = useRuntimeConfig()
const authStore = useAuthStore()

const apiAuthorizationToken = authStore.access_token
const uniqueAccountId = authStore.uniqueAccountId

const isOpenInternal = ref(props.isOpen)
const isSaving = ref(false)

// The "form" object holds **only the editable field** for submission
const form = reactive({
  prompt_text: ''
})
let currentPromptId: number | null = null
let currentPromptKey: string | null = null

// Initialize form when modal opens
watch(
  () => props.isOpen,
  (val) => {
    isOpenInternal.value = val
    if (val && props.prompt?.most_recent_prompt) {
      form.prompt_text = props.prompt.most_recent_prompt.prompt_text
      currentPromptId = props.prompt.most_recent_prompt.id
      currentPromptKey = props.prompt.most_recent_prompt.prompt_key
    }
  },
  { immediate: true }
)

const close = () => {
  emit('close')
}

// Submit form
const save = async () => {
  if (!form.prompt_text || !currentPromptId || !currentPromptKey) return

  try {
    console.log('Saving prompt with text:', form.prompt_text)
    isSaving.value = true
    const updated = await $fetch<Prompt>(
      `${config.public.apiBase}/update-account-prompt/${uniqueAccountId}/${currentPromptId}`,
      {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiAuthorizationToken}`,
        },
        body: {
          prompt_key: currentPromptKey,
          prompt_text: form.prompt_text // <-- only this is submitted
        }
      }
    )

    emit('prompt-updated', {
      ...props.prompt,
      most_recent_prompt: updated
    })
    close()
  } catch (err) {
    console.error('Error saving prompt:', err)
  } finally {
    isSaving.value = false
  }
}
</script>
