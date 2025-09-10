<template>
	<UCard>
		<p class="paragraph-label-text block">
			<strong class="paragraph-label-text__label">
				Active Main Prompt - {{ formatDateTime(props.prompt.most_recent_prompt.created_at) }}
			</strong>
			
			<!-- Remove ellipsis and allow wrapping -->
			<UTooltip
				:text="props.prompt.most_recent_prompt.prompt_text"
				class="paragraph-label-text__text"
			>
				<span class="whitespace-pre-wrap break-words">
					{{ props.prompt.most_recent_prompt.prompt_text }}
				</span>
			</UTooltip>
		</p>

		<template #footer>
			<div class="flex gap-2">
				<UTooltip text="Edit Prompt">
					<UButton
						icon="i-heroicons:pencil-square"
						@click="emitEditPrompt"
					/>
				</UTooltip>
				<UTooltip text="Add New Main Prompt">
					<UButton
						icon="i-heroicons:plus"
						@click="emitAddPrompt"
					/>
				</UTooltip>
				<UTooltip text="Roll Back Prompt">
					<UButton
						icon="i-heroicons:arrow-uturn-left"
						@click="emitRevertPrompt"
					/>
				</UTooltip>
			</div>
		</template>
	</UCard>
</template>


<script setup lang="ts">
import { format, parseISO } from 'date-fns';

const config = useRuntimeConfig();
const props = defineProps<{
  prompt: {
    most_recent_prompt: {
      prompt_key: string;
      prompt_text: string;
      created_at: string;
      id: number;
    };
  };
}>();

const emit = defineEmits(['editPromptClicked', 'addPromptClicked', 'revertPromptClicked']);

const emitEditPrompt = () => {
  emit('editPromptClicked', props.prompt);
};

const emitAddPrompt = () => {
  emit('addPromptClicked', props.prompt);
};

const emitRevertPrompt = () => {
  emit('revertPromptClicked', props.prompt);
};

const toast = useToast(); // For notifications
const authStore = useAuthStore();
const isModalOpen = ref(false);

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

function formatDateTime(isoString: string | null | undefined): string {
	if (!isoString) {
		return 'N/A';
	}
	return format(parseISO(isoString), 'd MMMM yyyy');
}
</script>

<style scoped>

.paragraph-label-text__text {
	display: block;
}
</style>
