<template>
	<UModal :model-value="isOpen" @update:model-value="$emit('update:is-open', $event)" :ui="{ width: 'w-full sm:max-w-md' }" prevent-close>
		<UCard>
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
						Final Confirmation
					</h3>
				</div>
			</template>

			<div class="space-y-4">
				<div class="flex items-center space-x-3">
					<div class="flex-shrink-0">
						<UIcon name="i-heroicons-exclamation-triangle" class="h-6 w-6 text-red-500" />
					</div>
					<div class="flex-1">
						<p class="text-sm text-gray-700 dark:text-gray-300 font-medium">
							This is your final chance to reconsider.
						</p>
					</div>
				</div>
				
				<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
					<p class="text-sm text-red-700 dark:text-red-300 mb-3">
						To confirm account deletion, please type <strong class="font-bold">DELETE ACCOUNT</strong> in the field below:
					</p>
					
					<UInput
						v-model="confirmationText"
						placeholder="Type DELETE ACCOUNT to confirm"
						:class="{ 
							'border-red-300 focus:border-red-500 focus:ring-red-500': confirmationText && !isConfirmationValid,
							'border-green-300 focus:border-green-500 focus:ring-green-500': isConfirmationValid
						}"
						@input="validateConfirmation"
					/>
				</div>
				
				<p class="text-xs text-gray-500 dark:text-gray-400">
					This action is irreversible and will immediately delete all your data.
				</p>
			</div>

			<template #footer>
				<div class="flex justify-end space-x-3">
					<UButton
						color="gray"
						variant="outline"
						@click="handleCancel"
						:disabled="isDeleting"
					>
						Cancel
					</UButton>
					<UButton
						color="red"
						@click="handleConfirm"
						:disabled="!isConfirmationValid || isDeleting"
						:loading="isDeleting"
					>
						{{ isDeleting ? 'Deleting Account...' : 'Delete Account' }}
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

interface Props {
	isOpen: boolean;
}

interface Emits {
	(e: 'update:is-open', value: boolean): void;
	(e: 'confirm'): void;
	(e: 'cancel'): void;
	(e: 'close'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const confirmationText = ref('');
const isDeleting = ref(false);
const requiredText = 'DELETE ACCOUNT';

const isConfirmationValid = computed(() => {
	return confirmationText.value.trim() === requiredText;
});

const validateConfirmation = () => {
	// This method can be used for additional validation if needed
	// The computed property handles the main validation
};

const handleCancel = () => {
	if (isDeleting.value) return; // Prevent closing while deleting
	
	confirmationText.value = '';
	emit('update:is-open', false);
	emit('cancel');
	emit('close');
};

const handleConfirm = async () => {
	if (!isConfirmationValid.value || isDeleting.value) return;
	
	isDeleting.value = true;
	
	try {
		emit('confirm');
		// The parent component will handle closing the modal after successful deletion
	} catch (error) {
		// If there's an error, re-enable the form
		isDeleting.value = false;
	}
};

// Reset form when modal opens/closes
watch(() => props.isOpen, (newValue) => {
	if (!newValue) {
		confirmationText.value = '';
		isDeleting.value = false;
	}
});
</script>