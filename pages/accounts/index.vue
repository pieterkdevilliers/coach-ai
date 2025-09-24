<template>
	<div class="account__page-layout">
		<AccountSidebar
			:active-section="activeSection"
			:is-account-owner="isAccountOwner"
			@section-changed="activeSection = $event"
		/>

		<main class="account-content">
			<!-- Account Prompts Section -->
			<section
				v-if="activeSection === 'prompts'"
				class="my-prompts container--default mx-auto"
			>
				<!-- Your existing prompts content -->
				<div class="page-header">
					<h2 class="heading heading--h2 page__title">
						Account Prompts
					</h2>
				</div>
				<div>
					<div v-if="account_prompt" class="card__outer">
						<AccountPromptCard
							:prompt="account_prompt"
							@edit-prompt-clicked="openEditPromptModal"
							@add-prompt-clicked="openAddPromptModal"
							@revert-prompt-clicked="openRevertPromptModal"
						/>
					</div>
				</div>
			</section>

			<!-- Webhooks Section -->
			<section
				v-if="activeSection === 'webhooks'"
				class="my-subscriptions container--default mx-auto"
			>
				<!-- Your existing webhooks content -->
				<div class="page-header">
					<h2 class="heading heading--h2 page__title">
						Integration Webhooks
					</h2>
				</div>
				<div class="subscription-grid card-grid">
					<div class="card__outer">
						<WebhookCard
							:webhook="webhook"
							@edit-webhook-clicked="openEditWebhookModal"
						/>
					</div>
					<div class="card__outer">
						<ScoreAppWebhookIntegration
							:scoreapp_account="scoreapp_account"
							@edit-scoreapp-account-clicked="
								openEditScoreAppAccountModal
							"
							@add-scoreapp-account-clicked="
								openAddScoreAppAccountModal
							"
							@delete-scoreapp-account-clicked="
								openDeleteConfirmation
							"
						/>
					</div>
				</div>
			</section>

			<!-- Products Section -->
			<section
				v-if="activeSection === 'products'"
				class="my-subscriptions container--default mx-auto"
			>
				<!-- Your existing products content -->
				<div class="page-header">
					<h2 class="heading heading--h2 page__title">
						Available Products - Under Construction
					</h2>
					<!-- Add Product button -->
					<UButton
						icon="i-heroicons:plus-circle-16-solid"
						variant="solid"
						label="Add Product"
						@click="isAddAccountProductModalOpen = true"
					/>
				</div>
				<div class="subscription-grid card-grid">
					<div
						v-for="account_product in account_products.user_products"
						class="card__outer"
					>
						<AccountProductCard
							:account_product="account_product"
							@edit-account-product-clicked="
								openEditAccountProductModal
							"
							@add-account-product-clicked="
								openAddAccountProductModal
							"
							@delete-account-product-clicked="
								openConfirmDeleteAccountProductModal
							"
						/>
					</div>
				</div>
			</section>

			<!-- Subscriptions Section -->
			<section
				v-if="activeSection === 'subscriptions'"
				class="my-subscriptions container--default mx-auto"
			>
				<!-- Your existing subscriptions content -->
				<div class="page-header">
					<h2 class="heading heading--h2 page__title">
						My Subscriptions
					</h2>
					<div v-if="!activeSubscription" class="text-center">
						<p>
							To subscribe to a plan, please click the button
							below.
						</p>
						<UButton
							label="Subscribe Now"
							icon="i-heroicons:plus-circle-16-solid"
							variant="solid"
							@click="openSubscriptionModal"
							class="mt-3"
						/>
					</div>
				</div>
				<div class="search-pagination-container"></div>
				<div class="subscription-grid card-grid">
					<div
						v-for="subscription in subscriptions?.subscriptions"
						:key="subscription.id"
						class="card__outer"
					>
						<SubscriptionCard
							:subscription="subscription"
							@subscription-canceled="handleSubscriptionCanceled"
						/>
					</div>
				</div>
			</section>

			<!-- Account Settings Section -->
			<section
				v-if="activeSection === 'account' && isAccountOwner"
				class="account-settings container--default mx-auto"
			>
				<div class="page-header">
					<h2 class="heading heading--h2 page__title">
						Account Settings
					</h2>
					<UButton
						icon="i-heroicons:exclamation-triangle-20-solid"
						label="Delete My Account"
						variant="solid"
						color="red"
						@click="openConfirmDeleteAccountModal"
					/>
				</div>
			</section>
		</main>

		<!-- All your existing modals remain the same -->
	</div>

	<SubscriptionModal v-model="isSubscriptionModalOpen" />

	<!-- Edit Webook Modal -->
	<EditWebhookModal
		:is-open="isEditWebhookModalOpen"
		:webhook="webhookToEdit"
		@close="closeEditWebhookModal"
		@webhook-updated="handleWebhookUpdated"
	/>

	<!-- Edit Prompt Modal -->
	<EditPromptModal
		:is-open="isEditPromptModalOpen"
		:prompt="promptToEdit"
		@close="closeEditPromptModal"
		@prompt-updated="handlePromptUpdated"
	/>

	<!-- Edit ScoreApp Account Modal -->
	<EditScoreAppAccountModal
		:is-open="isEditScoreAppAccountModalOpen"
		:scoreapp_account="scoreappAccountToEdit"
		@close="closeEditScoreAppAccountModal"
		@scoreapp_account-updated="handleScoreAppAccountUpdated"
	/>

	<!-- Add ScoreApp Account Modal -->
	<AddScoreAppAccountModal
		:is-open="isAddScoreAppAccountModalOpen"
		:scoreapp_account="scoreappAccountToAdd"
		@close="closeAddScoreAppAccountModal"
		@scoreapp-account-added="handleScoreAppAccountAdded"
	/>

	<!-- Delete ScoreApp Account Modal -->
	<ConfirmDeleteModal
		:is-open="isConfirmDeleteModalOpen"
		:item-name="
			scoreappAccountToDelete
				? scoreappAccountToDelete.account.scoreapp_id
				: ''
		"
		@update:is-open="isConfirmDeleteModalOpen = $event"
		@confirm="handleDeleteScoreAppAccountConfirmed"
		@cancel="closeConfirmDeleteModal"
		@close="closeConfirmDeleteModal"
	/>

	<!-- Add Prompt Modal -->
	<AddPromptModal
		:is-open="isAddPromptModalOpen"
		:prompt="promptToAdd"
		@close="closeAddPromptModal"
		@prompt-added="handlePromptAdded"
	/>

	<!-- Revert Prompt Modal -->
	<RevertPromptModal
		:is-open="isRevertPromptModalOpen"
		:prompt="promptToRevert"
		@close="closeRevertPromptModal"
		@prompt-reverted="handlePromptReverted"
	/>

	<!-- Delete Account Modals -->
	<ConfirmDeleteAccountModal
		:is-open="isConfirmDeleteAccountModalOpen"
		@update:is-open="isConfirmDeleteAccountModalOpen = $event"
		@confirm="openFinalDeleteAccountModal"
		@cancel="closeConfirmDeleteAccountModal"
		@close="closeConfirmDeleteAccountModal"
	/>

	<FinalDeleteAccountModal
		:is-open="isFinalDeleteAccountModalOpen"
		@update:is-open="isFinalDeleteAccountModalOpen = $event"
		@confirm="handleDeleteAccountConfirmed"
		@cancel="closeFinalDeleteAccountModal"
		@close="closeFinalDeleteAccountModal"
	/>

	<!-- Edit Account Product Modal -->
	<EditAccountProductModal
		:is-open="isEditAccountProductModalOpen"
		:account_product="accountProductToEdit"
		@close="closeEditAccountProductModal"
		@account-product-updated="handleAccountProductUpdated"
	/>

	<!-- Add Account Product Modal -->
	<AddAccountProductModal
		:is-open="isAddAccountProductModalOpen"
		:account_product="accountProductToAdd"
		@close="closeAddAccountProductModal"
		@account-product-added="handleAccountProductAdded"
	/>

	<!-- Delete Account Product Modal -->
	<ConfirmDeleteAccountProductModal
		:is-open="isConfirmDeleteAccountProductModalOpen"
		:item-name="
			accountProductToDelete ? accountProductToDelete.product_title : ''
		"
		@update:is-open="isConfirmDeleteAccountProductModalOpen = $event"
		@confirm="handleDeleteAccountProductConfirmed"
		@cancel="handleCancelDeleteAccountProduct"
		@close="closeConfirmDeleteAccountProductModal"
	/>

	<UNotifications />
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import SubscriptionCard from '~/components/SubscriptionCard.vue';
import SubscriptionModal from '~/components/SubscriptionModal.vue';
import WebhookCard from '~/components/WebhookCard.vue';
import ConfirmDeleteModal from '~/components/ConfirmDeleteModal.vue';
import ScoreAppWebhookIntegration from '~/components/ScoreAppWebhookIntegration.vue';
import AddScoreAppAccountModal from '~/components/AddScoreAppAccountModal.vue';
import AccountPromptCard from '~/components/AccountPromptCard.vue';
import AccountProductCard from '~/components/AccountProductCard.vue';
import EditWebhookModal from '~/components/EditWebhookModal.vue';
import EditPromptModal from '~/components/EditPromptModal.vue';
import EditAccountProductModal from '~/components/EditAccountProductModal.vue';
import EditScoreAppAccountModal from '~/components/EditScoreAppAccountModal.vue';
import AddPromptModal from '~/components/AddPromptModal.vue';
import AddAccountProductModal from '~/components/AddAccountProductModal.vue';
import RevertPromptModal from '~/components/RevertPromptModal.vue';
import ConfirmDeleteAccountModal from '~/components/ConfirmDeleteAccountModal.vue';
import FinalDeleteAccountModal from '~/components/FinalDeleteAccountModal.vue';
import AccountSidebar from '~/components/AccountSidebar.vue';
import { ref, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
	middleware: 'auth',
	layout: 'user-access',
});

const activeSection = ref('prompts'); // Default section

// Optional: Update URL to reflect current section
watch(activeSection, (newSection) => {
	// Update URL without page reload
	window.history.replaceState({}, '', `?section=${newSection}`);
});

// Optional: Read initial section from URL
onMounted(() => {
	const urlParams = new URLSearchParams(window.location.search);
	const section = urlParams.get('section');
	if (
		section &&
		[
			'prompts',
			'webhooks',
			'products',
			'subscriptions',
			'account',
		].includes(section)
	) {
		activeSection.value = section;
	}
});

const authStore = useAuthStore();
const toast = useToast(); // For notifications
const router = useRouter(); // For navigation after account deletion

const apiAuthorizationToken = authStore.access_token;
const uniqueAccountId = authStore.uniqueAccountId;
const activeSubscription = computed(() => authStore.subs_status);
const isAccountOwner = computed(() => authStore.is_account_owner);
console.log('isAccountOwner: ', isAccountOwner);
const accountOrganisation = ref('');

const isSubscriptionModalOpen = ref(false);

const openSubscriptionModal = () => {
	isSubscriptionModalOpen.value = true;
};

const closeSubscriptionModal = () => {
	isSubscriptionModalOpen.value = false;
};

interface Subscription {
	id: number;
	stripe_subscription_id: string;
	stripe_customer_id: string;
	status: string;
	current_period_end: Date;
	type: string; // 'monthly' or 'yearly'
	trial_start: Date | null;
	trial_end: Date | null;
	subscription_start: Date | null;
	stripe_account_url: string | null;
	related_product_title: string | null;
}

// [NEW METHOD]
// This handler receives the `canceledId` from the emit.
const handleSubscriptionCanceled = (canceledId: number) => {
	// Ensure we have data to work with
	if (!subscriptions.value || !subscriptions.value.subscriptions) {
		return;
	}

	// Find the specific subscription in our local array
	const subToUpdate = subscriptions.value.subscriptions.find(
		(sub) => sub.id === canceledId
	);

	// If found, update its status. Vue's reactivity will do the rest!
	if (subToUpdate) {
		subToUpdate.status = 'canceled';
		console.log(`Updated subscription ${canceledId} status locally.`);
	}
};

const {
	data: subscriptions,
	error,
	refresh,
} = await useFetch(
	`${config.public.apiBase}/stripe-subscriptions/${uniqueAccountId}`,
	{
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiAuthorizationToken}`,
		},
		cache: 'no-cache',
	}
);

if (error.value) {
	console.error('Error fetching subscriptions:', error.value);
} else {
	console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
}

watch(
	subscriptions,
	(newSubscriptionsValue) => {
		if (newSubscriptionsValue) {
			authStore.setSubsStatus(newSubscriptionsValue.active_subscription);
			console.log(
				'Auth store status updated to:',
				newSubscriptionsValue.active_subscription
			);
		}
	},
	{ immediate: true }
);

interface Webhook {
	id: number;
	webhook_url: string;
}

const {
	data: webhook,
	error: webhookError,
	refresh: refreshWebhook,
} = await useFetch(`${config.public.apiBase}/accounts/${uniqueAccountId}`, {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiAuthorizationToken}`,
	},
});

if (error.value) {
	console.error('Error fetching users:', webhookError.value);
} else {
	console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
}

interface ScoreAppAccount {
	id: number;
	scoreapp_id: string;
	account_unique_id: string;
}

const {
	data: scoreapp_account,
	error: scoreappAccountError,
	refresh: refreshScoreAppAccount,
} = await useFetch(
	`${config.public.apiBase}/score-app-account/${uniqueAccountId}`,
	{
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiAuthorizationToken}`,
		},
	}
);

if (error.value) {
	console.error(
		'Error fetching scoreapp account:',
		scoreappAccountError.value
	);
} else {
	console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
}

// --- State for Edit Webhook Modal ---
const isEditWebhookModalOpen = ref(false);
const webhookToEdit = ref<Webhook | null>(null);

// --- State for Edit ScoreApp Account Modal ---
const isEditScoreAppAccountModalOpen = ref(false);
const scoreappAccountToEdit = ref<ScoreAppAccount | null>(null);
const isAddScoreAppAccountModalOpen = ref(false);
const scoreappAccountToAdd = ref<ScoreAppAccount | null>(null);
const isConfirmDeleteModalOpen = ref(false);
const scoreappAccountToDelete = ref<ScoreAppAccount | null>(null);
const isDeletingInProgress = ref(false);

const openEditWebhookModal = (webhook: Webhook) => {
	webhookToEdit.value = webhook;
	isEditWebhookModalOpen.value = true;
};

const closeEditWebhookModal = () => {
	isEditWebhookModalOpen.value = false;
	webhookToEdit.value = null;
};

const handleWebhookUpdated = async (updatedWebhook: Webhook) => {
	await refreshWebhook();
};

const openEditScoreAppAccountModal = (scoreapp_account: ScoreAppAccount) => {
	scoreappAccountToEdit.value = scoreapp_account;
	isEditScoreAppAccountModalOpen.value = true;
};

const closeEditScoreAppAccountModal = () => {
	isEditScoreAppAccountModalOpen.value = false;
	scoreappAccountToEdit.value = null;
};

const handleScoreAppAccountUpdated = async (
	updatedScoreAppAccount: ScoreAppAccount
) => {
	await refreshScoreAppAccount();
};

const openAddScoreAppAccountModal = (scoreapp_account: ScoreAppAccount) => {
	scoreappAccountToAdd.value = scoreapp_account;
	isAddScoreAppAccountModalOpen.value = true;
	console.log('Opening add modal with scoreapp_account:', scoreapp_account);
};

const closeAddScoreAppAccountModal = () => {
	isAddScoreAppAccountModalOpen.value = false;
	scoreappAccountToAdd.value = null;
};

const handleScoreAppAccountAdded = async (
	scoreapp_account: ScoreAppAccount
) => {
	await refreshScoreAppAccount();
};

// --- State for Delete File Modal ---
const openDeleteConfirmation = (scoreapp_account: ScoreAppAccount) => {
	scoreappAccountToDelete.value = scoreapp_account;
	isConfirmDeleteModalOpen.value = true;
};

const closeConfirmDeleteModal = () => {
	isConfirmDeleteModalOpen.value = false;
	scoreappAccountToDelete.value = null;
};

const handleDeleteScoreAppAccountConfirmed = async () => {
	if (!scoreappAccountToDelete.value) return;

	isDeletingInProgress.value = true; // You can use this for a global loading indicator or pass to modal
	const scoreappAccountBeingDeleted = scoreapp_account.value; // Keep a reference

	// Close modal optimistically, or wait for API response
	closeConfirmDeleteModal();

	try {
		const response = await $fetch(
			`${config.public.apiBase}/score-app-account/${scoreappAccountBeingDeleted.account.scoreapp_id}`,
			{
				method: 'DELETE',
				headers: {
					// 'Content-Type': 'application/x-www-form-urlencoded', // DELETE often doesn't need Content-Type for body
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
			}
		);

		toast.add({
			title: 'ScoreApp Integration Deleted',
			description: `ScoreApp Account Integration "${scoreappAccountBeingDeleted.account.scoreapp_id}" has been deleted.`,
			color: 'green',
		});
		await refreshScoreAppAccount(); // Refresh the list from the server
	} catch (err: any) {
		console.error('Error deleting ScoreApp Integration:', err);
		const errorMessage =
			err.data?.detail ||
			err.message ||
			'Could not delete ScoreApp Integration.';
		toast.add({ title: 'Error', description: errorMessage, color: 'red' });
	} finally {
		isDeletingInProgress.value = false;
	}
};

const {
	data: account_prompt,
	error: accountPromptError,
	refresh: refreshAccountPrompt,
} = await useFetch(
	`${config.public.apiBase}/most-recent-prompt/${uniqueAccountId}`,
	{
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiAuthorizationToken}`,
		},
		cache: 'no-cache',
	}
);

if (error.value) {
	console.error('Error fetching account prompts:', accountPromptError.value);
} else {
	console.log('Account Prompts:', account_prompt.value);
}

interface Prompt {
	id: number;
	prompt_key: string;
	prompt_text: string;
	created_at: string;
}

// --- State for Edit Prompt Modal ---
const isEditPromptModalOpen = ref(false);
const promptToEdit = ref<Prompt | null>(null);

const openEditPromptModal = (prompt: Prompt) => {
	promptToEdit.value = prompt;
	isEditPromptModalOpen.value = true;
	console.log('Opening edit modal with prompt:', prompt);
};

const closeEditPromptModal = () => {
	isEditPromptModalOpen.value = false;
	promptToEdit.value = null;
};

const handlePromptUpdated = async (updatedPrompt: Prompt) => {
	await refreshAccountPrompt();
};

// --- State for Add Prompt Modal ---
const isAddPromptModalOpen = ref(false);
const promptToAdd = ref<Prompt | null>(null);

const openAddPromptModal = (prompt: Prompt) => {
	promptToAdd.value = prompt;
	isAddPromptModalOpen.value = true;
	console.log('Openingadd modal with prompt:', prompt);
};

const closeAddPromptModal = () => {
	isAddPromptModalOpen.value = false;
	promptToAdd.value = null;
};

const handlePromptAdded = async (addedPrompt: Prompt) => {
	await refreshAccountPrompt();
};

// --- State for Revert Prompt Modal ---
const isRevertPromptModalOpen = ref(false);
const promptToRevert = ref<Prompt | null>(null);

const openRevertPromptModal = (prompt: Prompt) => {
	promptToRevert.value = prompt;
	isRevertPromptModalOpen.value = true;
	console.log('Opening Revert modal with prompt:', prompt);
};

const closeRevertPromptModal = () => {
	isRevertPromptModalOpen.value = false;
	promptToRevert.value = null;
};

const handlePromptReverted = async (revertedPrompt: Prompt) => {
	await refreshAccountPrompt();
};

// --- State for Delete Account Modals ---
const isConfirmDeleteAccountModalOpen = ref(false);
const isFinalDeleteAccountModalOpen = ref(false);

const openConfirmDeleteAccountModal = () => {
	isConfirmDeleteAccountModalOpen.value = true;
};

const closeConfirmDeleteAccountModal = () => {
	isConfirmDeleteAccountModalOpen.value = false;
};

const openFinalDeleteAccountModal = () => {
	isConfirmDeleteAccountModalOpen.value = false;
	isFinalDeleteAccountModalOpen.value = true;
};

const closeFinalDeleteAccountModal = () => {
	isFinalDeleteAccountModalOpen.value = false;
};

const handleDeleteAccountConfirmed = async () => {
	try {
		const response = await $fetch(
			`${config.public.apiBase}/accounts/${uniqueAccountId}`,
			{
				method: 'DELETE',
				headers: {
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
			}
		);

		// Close the modal
		isFinalDeleteAccountModalOpen.value = false;

		// Show success toast
		toast.add({
			title: 'Account Deleted',
			description: 'Your account has been permanently deleted.',
			color: 'green',
		});

		router.push('/');
	} catch (err: any) {
		console.error('Error deleting account:', err);
		const errorMessage =
			err.data?.detail || err.message || 'Could not delete account.';

		toast.add({
			title: 'Error',
			description: errorMessage,
			color: 'red',
		});

		// Keep modal open on error so user can retry
	}
};

interface AccountProduct {
	id: number;
	product_title: string;
	product_description: string;
	product_sale_url: string;
	who_is_this_for: string;
	is_active: boolean;
	account_unique_id: string;
}

const {
	data: account_products,
	error: accountProductError,
	refresh: refreshAccountProducts,
} = await useFetch(
	`${config.public.apiBase}/user-products/${uniqueAccountId}`,
	{
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiAuthorizationToken}`,
		},
	}
);
console.log('Account Products in index file: ', account_products.value);

if (error.value) {
	console.error(
		'Error fetching scoreapp account:',
		accountProductError.value
	);
} else {
	console.log('Stored Unique Account ID:', authStore.uniqueAccountId);
}

// --- State for Edit AccountProduct Modal ---
const isEditAccountProductModalOpen = ref(false);
const accountProductToEdit = ref<AccountProduct | null>(null);

const openEditAccountProductModal = (account_product: AccountProduct) => {
	accountProductToEdit.value = account_product;
	isEditAccountProductModalOpen.value = true;
	console.log('Opening edit modal with account_product:', account_product);
};

const closeEditAccountProductModal = () => {
	isEditAccountProductModalOpen.value = false;
	accountProductToEdit.value = null;
};

const handleAccountProductUpdated = async (account_product: AccountProduct) => {
	await refreshAccountProducts();
};

// --- State for Add AccountProduct Modal ---
const isAddAccountProductModalOpen = ref(false);
const accountProductToAdd = ref<AccountProduct | null>(null);

const openAddAccountProductModal = (account_product: AccountProduct) => {
	accountProductToAdd.value = account_product;
	isAddAccountProductModalOpen.value = true;
	console.log('Opening add modal with account_product:', account_product);
};

const closeAddAccountProductModal = () => {
	isAddAccountProductModalOpen.value = false;
	accountProductToAdd.value = null;
};

const handleAccountProductAdded = async (
	addedAccountProduct: AccountProduct
) => {
	await refreshAccountProducts();
};

// --- State for Delete Account Modals ---

const accountProductToDelete = ref<AccountProduct | null>(null);
const isConfirmDeleteAccountProductModalOpen = ref(false);

const openConfirmDeleteAccountProductModal = (
	account_product: AccountProduct
) => {
	accountProductToDelete.value = account_product;
	isConfirmDeleteAccountProductModalOpen.value = true;
};

const closeConfirmDeleteAccountProductModal = () => {
	isConfirmDeleteAccountModalOpen.value = false;
	accountProductToDelete.value = null;
};

const handleCancelDeleteAccountProduct = () => {
	isConfirmDeleteAccountProductModalOpen.value = false;
	accountProductToDelete.value = null;
};

const handleDeleteAccountProductConfirmed = async () => {
	try {
		const response = await $fetch(
			`${config.public.apiBase}/user-products/${uniqueAccountId}/${accountProductToDelete.value?.id}`,
			{
				method: 'DELETE',
				headers: {
					accept: 'application/json',
					Authorization: `Bearer ${apiAuthorizationToken}`,
				},
			}
		);

		// Close the modal
		isConfirmDeleteAccountProductModalOpen.value = false;

		await refreshAccountProducts();

		// Show success toast
		toast.add({
			title: 'Product Deleted',
			description: 'Product successfully deleted.',
			color: 'green',
		});
	} catch (err: any) {
		console.error('Error deleting product:', err);
		const errorMessage =
			err.data?.detail || err.message || 'Could not delete product.';

		toast.add({
			title: 'Error',
			description: errorMessage,
			color: 'red',
		});

		// Keep modal open on error so user can retry
	}
};
</script>

<style scoped>
.account-page-layout {
	display: flex;
	min-height: 100vh;
}

.account-sidebar {
	width: 250px;
	background: #f8f9fa;
	border-right: 1px solid #dee2e6;
	padding: 1rem;
}

/* .account-content {
	flex: 1;
	padding: 2rem;
	overflow-y: auto;
} */

.account-sidebar nav ul {
	list-style: none;
	padding: 0;
}

.account-sidebar nav li {
	margin-bottom: 0.5rem;
}

.account-sidebar nav button {
	width: 100%;
	text-align: left;
	padding: 0.75rem 1rem;
	border: none;
	background: transparent;
	border-radius: 0.375rem;
	cursor: pointer;
	transition: background-color 0.2s;
}

.account-sidebar nav button:hover,
.account-sidebar nav button.active {
	background-color: #e9ecef;
}
</style>
