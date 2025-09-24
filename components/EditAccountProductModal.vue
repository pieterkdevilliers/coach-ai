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
						Edit Product / CTA
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
						Save Changes
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
	account_product: AccountProduct | null;
}>();

const emit = defineEmits(['close', 'account-product-updated']);

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

let currentAccountProductId: number | null = null;

// Form validation
const isFormValid = computed(() => {
	return form.product_title.trim() !== '' &&
		   form.product_description.trim() !== '' &&
		   form.product_sale_url.trim() !== '' &&
		   form.who_is_this_for.trim() !== '';
});

// Initialize form when modal opens
watch(
	() => props.isOpen,
	(val) => {
		isOpenInternal.value = val;
		if (val && props.account_product) {
			// Populate form with existing data
			form.product_title = props.account_product.product_title;
			form.product_description = props.account_product.product_description;
			form.product_sale_url = props.account_product.product_sale_url;
			form.who_is_this_for = props.account_product.who_is_this_for;
			form.is_active = props.account_product.is_active;
			currentAccountProductId = props.account_product.id;
		}
	},
	{ immediate: true }
);

// Watch for prop changes
watch(
	() => props.account_product,
	(newProduct) => {
		if (newProduct) {
			form.product_title = newProduct.product_title;
			form.product_description = newProduct.product_description;
			form.product_sale_url = newProduct.product_sale_url;
			form.who_is_this_for = newProduct.who_is_this_for;
			form.is_active = newProduct.is_active;
			currentAccountProductId = newProduct.id;
		}
	}
);

const close = () => {
	// Reset form
	form.product_title = '';
	form.product_description = '';
	form.product_sale_url = '';
	form.who_is_this_for = '';
	form.is_active = true;
	currentAccountProductId = null;
	emit('close');
};

// Submit form
const save = async () => {
	if (!isFormValid.value || !currentAccountProductId) return;

	try {
		console.log('Saving account product with data:', form);
		isSaving.value = true;
		
		const updated = await $fetch<AccountProduct>(
			`${config.public.apiBase}/user-products/${uniqueAccountId}/${currentAccountProductId}`,
			{
				method: 'PUT',
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
			description: 'Account product updated successfully.',
			color: 'green',
		});

		emit('account-product-updated', updated);
		close();
	} catch (err: any) {
		console.error('Error saving account product:', err);
		const errorMessage = err.data?.detail || err.message || 'Could not update account product.';
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