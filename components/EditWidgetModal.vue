<template>
	<UModal :model-value="isOpen" @update:model-value="handleClose">
		<UCard
			:class="['modal']"
			:ui="{
				ring: '',
				divide: 'divide-y divide-gray-100 dark:divide-gray-800',
			}"
		>
			<template #header>
				<div class="flex items-center justify-between">
					<h3 class="heading heading--h3 text-gradient">
						<span class="heading__span--block"
							>Update Details for Widget:</span
						>
						<span class="heading__span--block">{{
							widget ? widget.name : 'New Widget'
						}}</span>
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
				class="space-y-4 p-4 modal__form"
				@submit="submitForm"
			>
				<UFormGroup
					label="Add allowed origins as a comma-separated list"
					name="allowed_origins"
					required
					class="form__label-fields"
				>
					<UTextarea v-model="state.allowed_origins" />
				</UFormGroup>
				<UFormGroup
					label="Text for the button opening the widget"
					name="button_text"
					class="form__label-fields"
				>
					<UInput v-model="state.button_text" />
				</UFormGroup>
				<UFormGroup
					label="Title for the widget, when the widget is open"
					name="widget_title"
					class="form__label-fields"
				>
					<UInput v-model="state.widget_title" />
				</UFormGroup>
				<UFormGroup
					label="The welcome message, which the AI will send to the user on first opening the widget."
					name="welcome_message"
					class="form__label-fields"
				>
					<UInput v-model="state.welcome_message" />
				</UFormGroup>
				<UFormGroup
					label="Require user opt-in before starting conversation?"
					name="opt_in_required"
					class="form__label-fields"
				>
					<UCheckbox v-model="state.opt_in_required" />
				</UFormGroup>

				<div class="flex justify-end gap-2 pt-4">
					<UButton color="gray" variant="ghost" @click="handleClose">
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
import { Schema, z } from 'zod';
import type { FormSubmitEvent } from '#ui/types';

const props = defineProps<{
	isOpen: boolean;
	widget: {
		id: number;
		name: string;
		display_prefix: string;
		created_at: string;
		last_used_at: string | null;
		is_active: boolean;
		allowed_origins: string[];
		widget_config: {
			theme_colour: string | null;
			button_text: string;
			widget_title: string;
			welcome_message: string;
			opt_in_required: boolean;
			widget_id: number;
			account_unique_id: string;
		} | null;
	} | null;
}>();

const emit = defineEmits(['update:isOpen', 'widgetUpdated', 'close']);

const toast = useToast();
const authStore = useAuthStore();
const account_unique_id = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const isLoading = ref(false);

const schema = z.object({
	allowed_origins: z
		.string()
		.min(1, 'Allowed origins are required')
		.max(500, 'Allowed origins must be less than 500 characters'),
	button_text: z
		.string(),
	widget_title: z
		.string(),
	welcome_message: z
		.string(),
	opt_in_required: z
		.boolean(),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
	allowed_origins: props.widget
		? props.widget.allowed_origins.join(', ')
		: '',
	button_text: props.widget?.widget_config?.button_text ?? '',
	widget_title: props.widget?.widget_config?.widget_title ?? '',
	welcome_message: props.widget?.widget_config?.welcome_message ?? '',
	opt_in_required: props.widget?.widget_config?.opt_in_required ?? false,
});

watch(
	() => props.widget,
	(newWidget) => {
		if (newWidget) {
			state.allowed_origins = newWidget.allowed_origins.join(', ');
			state.button_text = newWidget.widget_config?.button_text ?? '';
			state.widget_title = newWidget.widget_config?.widget_title ?? '';
			state.welcome_message = newWidget.widget_config?.welcome_message ?? '';
			state.opt_in_required = newWidget.widget_config?.opt_in_required ?? false;
		} else {
			// Reset all fields if no widget is selected
			state.allowed_origins = '';
			state.button_text = '';
			state.widget_title = '';
			state.welcome_message = '';
			state.opt_in_required = false;
		}
	}
);

const handleClose = () => {
	emit('close'); // Emit close to parent
};

const submitForm = async (event: FormSubmitEvent<Schema>) => {
	if (!props.widget) return; // Should not happen if modal is open with a widget

	isLoading.value = true;
	try {
		const updatedWidgetData = await $fetch(
			`${config.public.apiBase}/update-api-key/${account_unique_id}/${props.widget.id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json', // Usually for PUT with JSON body
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
				body: {
					allowed_origins: event.data.allowed_origins
						.split(',')
						.map((item) => item.trim()), // Convert string back to array
					button_text: event.data.button_text,
					widget_title: event.data.widget_title,
					welcome_message: event.data.welcome_message,
					opt_in_required: event.data.opt_in_required,
				},
			}
		);

		toast.add({
			title: 'Widget Updated',
			description: `Widget has been updated.`,
			color: 'green',
		});
		emit('widgetUpdated', updatedWidgetData); // Emit event with the updated widget data from API
		handleClose(); // Close the modal
	} catch (error: any) {
		console.error('Error updating widget:', error);
		const errorMessage =
			error.data?.detail || error.message || 'Could not update widget.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
	} finally {
		isLoading.value = false;
	}
};
</script>
