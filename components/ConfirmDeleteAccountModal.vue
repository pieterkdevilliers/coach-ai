<template>
	<UModal :model-value="isOpen" @update:model-value="$emit('update:is-open', $event)" :ui="{ width: 'w-full sm:max-w-md' }">
		<UCard>
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
						Delete Account
					</h3>
					<UButton
						color="gray"
						variant="ghost"
						icon="i-heroicons-x-mark-20-solid"
						class="-my-1"
						@click="handleCancel"
					/>
				</div>
			</template>

			<div class="space-y-4">
				<div class="flex items-center space-x-3">
					<div class="flex-shrink-0">
						<UIcon name="i-heroicons-exclamation-triangle" class="h-6 w-6 text-red-500" />
					</div>
					<div class="flex-1">
						<p class="text-sm text-gray-700 dark:text-gray-300">
							This action cannot be undone. This will permanently delete your account and all associated data.
						</p>
					</div>
				</div>
				
				<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
					<p class="text-sm text-red-700 dark:text-red-300 font-medium">
						Warning: All your data including subscriptions, prompts, and integrations will be permanently deleted.
					</p>
				</div>
			</div>

			<template #footer>
				<div class="flex justify-end space-x-3">
					<UButton
						color="gray"
						variant="outline"
						@click="handleCancel"
					>
						Cancel
					</UButton>
					<UButton
						color="red"
						@click="handleConfirm"
					>
						Continue to Delete
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>

<script setup lang="ts">
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

const handleCancel = () => {
	emit('update:is-open', false);
	emit('cancel');
	emit('close');
};

const handleConfirm = () => {
	emit('update:is-open', false);
	emit('confirm');
};
</script>