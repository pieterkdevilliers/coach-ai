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
						Add Product / CTA
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
				<UFormGroup label="Product Title" required>
					<UInput
						v-model="form.product_title"
						placeholder="Enter product title"
					/>
				</UFormGroup>

				<UFormGroup label="Product Description" required>
					<UTextarea
						v-model="form.product_description"
						placeholder="Enter product description"
						:rows="4"
					/>
				</UFormGroup>

				<UFormGroup label="Sale URL" required>
					<UInput
						v-model="form.product_sale_url"
						placeholder="https://example.com"
						type="url"
					/>
				</UFormGroup>

				<UFormGroup label="Who is this for?" required>
					<UInput
						v-model="form.who_is_this_for"
						placeholder="Target audience description"
					/>
				</UFormGroup>

				<UFormGroup label="Status">
					<UToggle
						v-model="form.is_active"
						:label="form.is_active ? 'Active' : 'Inactive'"
					/>
				</UFormGroup>
			</div>

			<template #footer>
				<div class="flex justify-end gap-2">
					<UButton type="button" variant="ghost" @click="close">
						Cancel
					</UButton>
					<UButton
						type="button"
						variant="solid"
						:loading="isSaving"
						:disabled="!isFormValid"
						@click="save"
					>
						Add Product
					</UButton>
				</div>
			</template>
		</UCard>
	</UModal>
</template>

<script setup lang="ts">
import { reactive, watch, ref, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

interface AccountProduct {
	id: number;
	product_title: string;
	product_description: string;
	product_sale_url: string;
	who_is_this_for: string;
	is_active: boolean;
	account_unique_id: string;
}

const props = defineProps<{
	isOpen: boolean;
}>();

const emit = defineEmits(['close', 'account-product-added']);

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toast = useToast();

const apiAuthorizationToken = authStore.access_token;
const uniqueAccountId = authStore.uniqueAccountId;

const isOpenInternal = ref(props.isOpen);
const isSaving = ref(false);

const handleClose = () => {
	emit('close');
};

// Form object with all editable fields
const form = reactive({
	product_title: '',
	product_description: '',
	product_sale_url: '',
	who_is_this_for: '',
	is_active: true,
});

// Form validation
const isFormValid = computed(() => {
	return form.product_title.trim() !== '' &&
		   form.product_description.trim() !== '' &&
		   form.product_sale_url.trim() !== '' &&
		   form.who_is_this_for.trim() !== '';
});

// Reset form when modal opens
watch(
	() => props.isOpen,
	(val) => {
		isOpenInternal.value = val;
		if (val) {
			form.product_title = '';
			form.product_description = '';
			form.product_sale_url = '';
			form.who_is_this_for = '';
			form.is_active = true;
		}
	},
	{ immediate: true }
);

const close = () => {
	// Reset form
	form.product_title = '';
	form.product_description = '';
	form.product_sale_url = '';
	form.who_is_this_for = '';
	form.is_active = true;
	emit('close');
};

// Submit form
const save = async () => {
	if (!isFormValid.value) return;

	try {
		console.log('Adding new account product with data:', form);
		isSaving.value = true;

		const created = await $fetch<AccountProduct>(
			`${config.public.apiBase}/user-products/${uniqueAccountId}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
				body: {
					product_title: form.product_title,
					product_description: form.product_description,
					product_sale_url: form.product_sale_url,
					who_is_this_for: form.who_is_this_for,
					is_active: form.is_active,
				},
			}
		);

		toast.add({
			title: 'Success',
			description: 'Account product added successfully.',
			color: 'green',
		});

		emit('account-product-added', created);
		close();
	} catch (err: any) {
		console.error('Error adding account product:', err);
		const errorMessage = err.data?.detail || err.message || 'Could not add account product.';
		toast.add({
			title: 'Error',
			description: errorMessage,
			color: 'red',
		});
	} finally {
		isSaving.value = false;
	}
};
</script>
