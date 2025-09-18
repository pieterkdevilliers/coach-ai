<!-- components/AddPromptModal.vue -->
<template>
	<UModal
		v-model="isOpenInternal"
		class="modal--wide"
		@update:model-value="handleClose"
	>
		<UCard>
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="heading heading--h3 text-gradient">
						Add Prompt
					</h3>
					<UButton
						color="gray"
						variant="ghost"
						icon="i-heroicons-x-mark-20-solid"
						class="-my-1"
						@click="handleClose"
					/>
				</div>
			</template>

			<div class="space-y-4">
				<UTextarea
					v-model="localPromptText"
					label="Prompt Text"
					:rows="20"
				/>
			</div>

			<template #footer>
				<div class="flex justify-end gap-2">
					<UButton variant="ghost" @click="close">Cancel</UButton>
					<UButton variant="solid" :loading="isSaving" @click="save"
						>Save</UButton
					>
				</div>
			</template>
		</UCard>
	</UModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

interface Prompt {
	id: number;
	prompt_key: string;
	prompt_text: string;
	created_at: string;
}

const props = defineProps<{
	isOpen: boolean;
	prompt: Prompt | null;
}>();

const emit = defineEmits(['close', 'prompt-added']);

const config = useRuntimeConfig();
const authStore = useAuthStore();
const apiAuthorizationToken = authStore.access_token;
const uniqueAccountId = authStore.uniqueAccountId;

const isOpenInternal = ref(props.isOpen);
const localPromptText = ref('');
const isSaving = ref(false);

const handleClose = () => {
	emit('close'); // Emit close to parent
};

// keep modal state in sync with parent
watch(
	() => props.isOpen,
	(val) => {
		isOpenInternal.value = val;
		if (val && props.prompt) {
			localPromptText.value = props.prompt.prompt_text;
		}
	},
	{ immediate: true }
);

const close = () => {
	emit('close');
};

const save = async () => {
	if (!localPromptText.value) return;

	try {
		isSaving.value = true;

		// Call API to create a new prompt (versioned)
		const newPrompt = await $fetch<Prompt>(
			`${config.public.apiBase}/create-account-prompt/${uniqueAccountId}`,
			{
				method: 'POST',
				headers: {
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
				body: {
					prompt_key: props.prompt?.prompt_key || 'Main Prompt',
					prompt_text: localPromptText.value,
				},
			}
		);

		emit('prompt-added', newPrompt);
		close();
	} catch (err) {
		console.error('Error creating new prompt:', err);
	} finally {
		isSaving.value = false;
	}
};
</script>
