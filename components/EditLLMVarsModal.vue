<template>
	<UModal :model-value="isOpen" @update:model-value="handleClose">
		<UCard
			:ui="{
				ring: '',
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
			}"
		>
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="heading heading--h3 text-gradient">
						Edit LLM Vars
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

			<UForm
				:schema="schema"
				:state="state"
				class="space-y-4 p-4"
				@submit="submitForm"
			>
				<UFormGroup label="Relevance Score" name="Relevance Score">
					<UInput v-model="state.relevance_score" />
				</UFormGroup>
				<UFormGroup label="Temperature" name="Temperature">
					<UInput v-model="state.temperature" />
				</UFormGroup>
				<UFormGroup label="K-Value" name="K-Value">
					<UInput v-model="state.k_value" />
				</UFormGroup>
				<UFormGroup label="Number of Sources Returned" name="Number of Sources Returned">
					<UInput v-model="state.sources_returned" />
				</UFormGroup>
				<UFormGroup label="Chunk Size" name="Chunk Size">
					<UInput v-model="state.chunk_size" />
				</UFormGroup>
				<UFormGroup label="Chunk Overlap" name="Chunk Overlap">
					<UInput v-model="state.chunk_overlap" />
				</UFormGroup>

				<div class="flex justify-end gap-2 pt-4">
					<UButton
						variant="outline"
						@click="handleClose"
						class="modal__cancel-button"
					>
						Cancel
					</UButton>
					<UButton type="submit" :loading="isLoading">
						Save Changes
					</UButton>
				</div>
			</UForm>
		</UCard>
	</UModal>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref, watch, reactive } from 'vue';
import { z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const props = defineProps<{
	isOpen: boolean;
	llm_vars: {
		// The object passed from the parent has an 'account' key
		account: {
			id: number;
			relevance_score: number;
			temperature: number;
			k_value: number;
			sources_returned: number;
			chunk_size: number;
			chunk_overlap: number;
		};
	};
}>();

const emit = defineEmits(['close', 'llmvars-updated']);


const toast = useToast();
const authStore = useAuthStore();
const account_unique_id = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const isLoading = ref(false);

const handleClose = () => {
	emit('close'); // Emit close to parent
};

// Zod schema for validation
const schema = z.object({
  relevance_score: z.coerce.number(),
  temperature: z.coerce.number(),
  k_value: z.coerce.number(),
  sources_returned: z.coerce.number(),
  chunk_size: z.coerce.number(),
  chunk_overlap: z.coerce.number(),
});

type Schema = z.output<typeof schema>;

// Form state
const state = reactive<Schema>({
	relevance_score: 0,
	temperature: 0,
	k_value: 0,
	sources_returned: 0,
	chunk_size: 0,
	chunk_overlap: 0,
});

watch(
	() => props.llm_vars,
	(newLLMVars) => {
		if (newLLMVars && newLLMVars.account) {
			// Update the form state with the current value
			state.relevance_score = newLLMVars.account.relevance_score;
			state.temperature = newLLMVars.account.temperature;
			state.k_value = newLLMVars.account.k_value;
			state.sources_returned = newLLMVars.account.sources_returned;
			state.chunk_size = newLLMVars.account.chunk_size;
			state.chunk_overlap = newLLMVars.account.chunk_overlap;
		} else {
			// Reset the form when the modal is closed
			state.relevance_score = 0;
			state.temperature = 0;
			state.k_value = 0;
			state.sources_returned = 0;
			state.chunk_size = 0;
			state.chunk_overlap = 0;
		}
	}
);

const submitForm = async (event: FormSubmitEvent<Schema>) => {
	if (!props.llm_vars) return; // Should not happen if modal is open with a webhook

	isLoading.value = true;
	try {
		const updatedLLMVarsData = await $fetch(
			`${config.public.apiBase}/accounts/${account_unique_id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json', // Usually for PUT with JSON body
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
				body: {
					...event.data,
				},
			}
		);

		toast.add({
			title: 'LLM Vars Updated',
			description: `LLM Vars have been updated.`,
			color: 'green',
		});
		emit('llmvars-updated', updatedLLMVarsData); // Emit event with the updated user data from API
		handleClose(); // Close the modal
	} catch (error: any) {
		console.error('Error updating LLM Vars:', error);
		const errorMessage =
			error.data?.detail || error.message || 'Could not update LLM Vars.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
	} finally {
		isLoading.value = false;
	}
};
</script>
