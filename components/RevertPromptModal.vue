<template>
  <UModal v-model="isOpenInternal" class="w-full  mx-auto">
    <UCard class="max-h-[90vh] overflow-y-auto">
      <template #header>
        <h2 class="text-lg font-bold">Revert Prompt</h2>
      </template>

        <div class="space-y-4 overflow-y-auto">
          <div v-if="prompts.length === 0" class="text-center text-gray-500">
            Loading prompts...
          </div>

          <div v-else class="flex flex-col gap-2">
            <div
              v-for="prompt in prompts"
              :key="prompt.id"
              :class="[
                'border p-3 rounded cursor-pointer',
                selectedPrompt?.id === prompt.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              ]"
              @click="selectPrompt(prompt)"
            >
              <div class="font-semibold">{{ prompt.prompt_key }}</div>
              <div class="text-xs text-gray-400 mt-1">
                {{ new Date(prompt.created_at).toLocaleString() }}
              </div>
              <div class="text-sm text-gray-700 break-words whitespace-pre-wrap">
                {{ prompt.prompt_text }}
              </div>
            </div>
          </div>
        </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="close">Cancel</UButton>
          <UButton
            variant="solid"
            :loading="isSaving"
            :disabled="!selectedPrompt"
            @click="save"
          >
            Revert
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'

interface Prompt {
  id: number
  prompt_key: string
  prompt_text: string
  created_at: string
}

const props = defineProps<{
  isOpen: boolean
  prompt: Prompt | null
}>()

const emit = defineEmits(['close', 'prompt-reverted'])

const config = useRuntimeConfig()
const authStore = useAuthStore()
const apiAuthorizationToken = authStore.access_token
const uniqueAccountId = authStore.uniqueAccountId

const isOpenInternal = ref(props.isOpen)
const isSaving = ref(false)
const prompts = ref<Prompt[]>([])
const selectedPrompt = ref<Prompt | null>(null)

// Keep modal state in sync with parent
watch(
  () => props.isOpen,
  async (val) => {
    isOpenInternal.value = val
    if (val) {
      await fetchRecentPrompts()
    }
  },
  { immediate: true }
)

const close = () => {
  emit('close')
}

const fetchRecentPrompts = async () => {
  try {
    const res: Prompt[] = await $fetch(
      `${config.public.apiBase}/list-account-prompts/${uniqueAccountId}`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiAuthorizationToken}`,
        },
      }
    )
    // Sort descending by created_at and take top 10
    prompts.value = res.prompts
      .sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 10)

    // Default selected is the most recent
    selectedPrompt.value = prompts.value[0] || null
    console.log('Fetched prompts:', res)
  } catch (err) {
    console.error('Error fetching recent prompts:', err)
    prompts.value = []
  }
}

const selectPrompt = (prompt: Prompt) => {
  selectedPrompt.value = prompt
}

const save = async () => {
  if (!selectedPrompt.value) return

  try {
    isSaving.value = true

    // Create a new prompt using the selected one
    const newPrompt = await $fetch<Prompt>(
      `${config.public.apiBase}/create-account-prompt/${uniqueAccountId}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${apiAuthorizationToken}`,
        },
        body: {
          prompt_key: selectedPrompt.value.prompt_key,
          prompt_text: selectedPrompt.value.prompt_text,
        },
      }
    )

    emit('prompt-reverted', newPrompt)
    close()
  } catch (err) {
    console.error('Error creating new prompt:', err)
  } finally {
    isSaving.value = false
  }
}
</script>
