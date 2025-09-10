<template>
	<section class="my-prompts container--default mx-auto">
	<h2 class="heading heading--h2 page__title">Account Prompts</h2>
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
	<section class="my-subscriptions container--default mx-auto">
		<h2 class="heading heading--h2 page__title">Notification Webhook</h2>
		<div class="card-grid">
			<div class="card__outer">
				<WebhookCard
					:webhook="webhook"
					@edit-webhook-clicked="openEditWebhookModal"
				/>
			</div>
		</div>
	</section>
	<section class="my-subscriptions container--default mx-auto">
		<div class="page-header">
			<h2 class="heading heading--h2 page__title">My Subscriptions</h2>
			<div v-if="!activeSubscription" class="text-center">
				<p>To subscribe to a plan, please click the button below.</p>
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

	<!-- Add Prompt Modal -->
	<AddPromptModal
		:is-open="isAddPromptModalOpen"
		:prompt="promptToAdd"
		@close="closeAddPromptModal"
		@prompt-added="handlePromptAdded"
	/>


	<!-- Add Prompt Modal -->
	<RevertPromptModal
		:is-open="isRevertPromptModalOpen"
		:prompt="promptToRevert"
		@close="closeRevertPromptModal"
		@prompt-reverted="handlePromptReverted"
	/>
	<UNotifications />
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import SubscriptionCard from '~/components/SubscriptionCard.vue';
import SubscriptionModal from '~/components/SubscriptionModal.vue';
import WebhookCard from '~/components/WebhookCard.vue';
import AccountPromptCard from '~/components/AccountPromptCard.vue';
import EditWebhookModal from '~/components/EditWebhookModal.vue';
import EditPromptModal from '~/components/EditPromptModal.vue';
import AddPromptModal from '~/components/AddPromptModal.vue';
import RevertPromptModal from '~/components/RevertPromptModal.vue';
import { ref, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({
	middleware: 'auth',
	layout: 'user-access',
});

const authStore = useAuthStore();
const toast = useToast(); // For notifications

const apiAuthorizationToken = authStore.access_token;
const uniqueAccountId = authStore.uniqueAccountId;
const activeSubscription = computed(() => authStore.subs_status);
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

const refreshWebhooks = async () => {
	console.log('Refreshing webhooks...');
	await refresh();
};

// --- State for Edit Webhook Modal ---
const isEditWebhookModalOpen = ref(false);
const webhookToEdit = ref<Webhook | null>(null);

const openEditWebhookModal = (webhook: Webhook) => {
	webhookToEdit.value = webhook;
	isEditWebhookModalOpen.value = true;
};

const closeEditWebhookModal = () => {
	isEditWebhookModalOpen.value = false;
	webhookToEdit.value = null; // Clear the selected user
};

const handleWebhookUpdated = async (updatedWebhook: Webhook) => {
	await refreshWebhook();
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
</script>
