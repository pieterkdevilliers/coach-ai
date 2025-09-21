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
						Edit ScoreApp Account Subdomain
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
				<UFormGroup label="ScoreApp Account Subdomain" name="ScoreApp Account Subdomain">
					<UInput v-model="state.scoreapp_id" />
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
		scoreapp_account: {
			account: {
				account_unique_id: string;
				scoreapp_id: string;
				id: number;
			}
		};
}>();

const emit = defineEmits(['close', 'scoreapp_account-updated']);

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
	scoreapp_id: z.string(),
});

type Schema = z.output<typeof schema>;

// Form state
const state = reactive<Schema>({
	scoreapp_id: '',
});

watch(
	() => props.scoreapp_account,
	(newScoreAppAccount) => {
		if (newScoreAppAccount && newScoreAppAccount.account.scoreapp_id) {
			// Update the form state with the current value
			state.scoreapp_id = newScoreAppAccount.account.scoreapp_id;
		} else {
			// Reset the form when the modal is closed
			state.scoreapp_id = '';
		}
	}
);

const submitForm = async (event: FormSubmitEvent<Schema>) => {
	if (!props.scoreapp_account) return;

	isLoading.value = true;
	try {
		const updatedScoreAppAccountData = await $fetch(
			`${config.public.apiBase}/score-app-account/${props.scoreapp_account.account.id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
				body: {
					scoreapp_id: event.data.scoreapp_id,
				},
			}
		);

		toast.add({
			title: 'ScoreApp Account Updated',
			description: `ScoreApp Subdomain has been updated.`,
			color: 'green',
		});
		emit('scoreapp_account-updated', updatedScoreAppAccountData);
		handleClose(); // Close the modal
	} catch (error: any) {
		console.error('Error updating subdomain:', error);
		const errorMessage =
			error.data?.detail || error.message || 'Could not update subdomain.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
	} finally {
		isLoading.value = false;
	}
};
</script>
