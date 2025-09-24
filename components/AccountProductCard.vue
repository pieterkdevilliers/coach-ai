<template>
	<UCard>
		<div>
			<p class="paragraph-label-text block">
				<strong class="paragraph-label-text__label"
					>Title:</strong
				>
				<UTooltip
					:text="props.account_product.product_title"
					class="paragraph-label-text__text"
				>
					<span>
						{{ props.account_product.product_title }}
					</span>
				</UTooltip>
			</p>
			<p class="paragraph-label-text block">
				<strong class="paragraph-label-text__label"
					>Description:</strong
				>
				<UTooltip
					:text="props.account_product.product_description"
					class="paragraph-label-text__text"
				>
					<span>
						{{ props.account_product.product_description }}
					</span>
				</UTooltip>
			</p>
			<p class="paragraph-label-text block">
				<strong class="paragraph-label-text__label"
					>Access URL:</strong
				>
				<UTooltip
					:text="props.account_product.product_sale_url"
					class="paragraph-label-text__text"
				>
					<span>
						{{ props.account_product.product_sale_url }}
					</span>
				</UTooltip>
			</p>
			<p class="paragraph-label-text block">
				<strong class="paragraph-label-text__label"
					>Who is it for?:</strong
				>
				<UTooltip
					:text="props.account_product.who_is_this_for"
					class="paragraph-label-text__text"
				>
					<span>
						{{ props.account_product.who_is_this_for }}
					</span>
				</UTooltip>
			</p>
			<p class="paragraph-label-text block">
				<strong class="paragraph-label-text__label"
					>Active Status:</strong
				>
				<UTooltip
					:bool="props.account_product.is_active"
					class="paragraph-label-text__text"
				>
					<span>
						{{ props.account_product.is_active }}
					</span>
				</UTooltip>
			</p>
		</div>

		<template #footer>
			<div class="flex gap-2">
				<UTooltip text="Edit Account Product">
					<UButton
						icon="i-heroicons:pencil-square"
						@click="emitEditAccountProduct"
					/>
				</UTooltip>
				<UTooltip text="Delete Account Product">
					<UButton
						icon="i-heroicons:trash"
						@click="emitDeleteAccountProduct"
					/>
				</UTooltip>
			</div>
		</template>
	</UCard>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const props = defineProps<{
  account_product: {
    id: number;
    product_title: string;
    product_description: string;
    product_sale_url: string;
    who_is_this_for: string;
    is_active: boolean;
    account_unique_id: string;
  };
}>();

const emit = defineEmits(['edit-account-product-clicked', 'add-account-product-clicked', 'delete-account-product-clicked']);
console.log('AccountProducts in CardComponent: ',props.account_product);
const toast = useToast(); // For notifications
const authStore = useAuthStore();
const isModalOpen = ref(false);

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const emitEditAccountProduct = () => {
	emit('edit-account-product-clicked', props.account_product);
};

const emitAddAccountProduct = () => {
	emit('add-account-product-clicked', props.account_product);
};

const emitDeleteAccountProduct = () => {
	emit('delete-account-product-clicked', props.account_product);
};
</script>

<style scoped>
/*
	<UTooltip> adds inline-flex, which breaks the truncation ellipsis.
	Adding block to tailwind.css still gets overridden by <UTooltip>.
 */
.paragraph-label-text__text {
	display: block;
}
</style>
