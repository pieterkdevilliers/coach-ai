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
						Add ScoreApp Webhook Integration
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

			<div class="p-4">
				<form @submit.prevent="handleAddScoreAppAccount">
					<div class="mb-4">
						<label
							class="block text-sm font-medium text-gray-700 mb-2"
							for="scoreapp_id"
						>
							ScoreApp Subdomain
						</label>
						<UInput
							v-model="scoreapp_id"
							id="scoreapp_id"
							type="text"
							placeholder="Enter your ScoreApp Account Subdomain"
							autocomplete="off"
						/>
					</div>
					
					<div class="flex justify-end gap-2 pt-4">
						<UButton
							variant="outline"
							@click="handleClose"
							class="modal__cancel-button"
						>
							Cancel
						</UButton>
						<UButton
							type="submit"
							icon="i-heroicons:code-bracket"
							:loading="isLoading"
						>
							Connect ScoreApp Integration
						</UButton>
					</div>
				</form>
				<p v-if="errorMessage" class="text-red-600 mt-4">{{ errorMessage }}</p>
			</div>
		</UCard>
	</UModal>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const props = defineProps<{
	isOpen: boolean;
	scoreapp_account?: any; // You can make this more specific if needed
}>();

const emit = defineEmits(['close', 'scoreapp-account-added']);
const authStore = useAuthStore();
const toast = useToast();

const scoreapp_id = ref('');
const errorMessage = ref('');
const isLoading = ref(false);
const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const handleClose = () => {
	// Reset form when closing
	scoreapp_id.value = '';
	errorMessage.value = '';
	emit('close');
};

const handleAddScoreAppAccount = async () => {
	if (!scoreapp_id.value.trim()) {
		errorMessage.value = 'Please enter a ScoreApp subdomain';
		return;
	}

	isLoading.value = true;
	errorMessage.value = '';

	const currentScoreAppPayload = {
		scoreapp_id: scoreapp_id.value,
	};
	
	console.log('ScoreApp Payload:', currentScoreAppPayload);
	
	try {
		const response = await fetch(
			`${config.public.apiBase}/create-score-app-account/${uniqueAccountId}/${scoreapp_id.value}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
				body: JSON.stringify(currentScoreAppPayload),
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			console.error('ScoreApp Integration creation error:', errorData);
			throw new Error(errorData.detail || 'Failed to create ScoreApp Integration');
		}

		const responseData = await response.json();
		
		toast.add({
			title: 'ScoreApp Integration Added',
			description: `ScoreApp integration has been successfully created.`,
			color: 'green',
		});

		emit('scoreapp-account-added', responseData);
		handleClose();
		
	} catch (error) {
		console.error('Error:', error);
		errorMessage.value = error.message || 'Unable to add ScoreApp Integration. Please check your credentials.';
	} finally {
		isLoading.value = false;
	}
};
</script>