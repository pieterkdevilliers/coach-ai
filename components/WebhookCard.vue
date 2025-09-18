<template>
	<UCard>
		<p class="paragraph-label-text block">
			<strong class="paragraph-label-text__label"
				>Contact Us Webhook Destination URL:</strong
			>
			<UTooltip
				:text="webhook.account.webhook_url"
				class="paragraph-label-text__text"
			>
				<span>
					{{ webhook.account.webhook_url }}
				</span>
			</UTooltip>
		</p>
		<p class="paragraph-label-text block">
			<strong class="paragraph-label-text__label"
				>Opt-in Webhook Destination URL:</strong
			>
			<UTooltip
				:text="webhook.account.opt_in_webhook_url"
				class="paragraph-label-text__text"
			>
				<span>
					{{ webhook.account.opt_in_webhook_url }}
				</span>
			</UTooltip>
		</p>
		<template #footer>
			<div class="flex gap-2">
				<UTooltip text="Edit Webhook Destination URL">
					<UButton
						icon="i-heroicons:pencil-square"
						@click="emitEditWebhook"
					/>
				</UTooltip>
			</div>
		</template>
	</UCard>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { webhook } = defineProps<{
	webhook: {
		// The object passed from the parent has an 'account' key
		account: {
			webhook_url: string;
			opt_in_webhook_url: string
		};
	};
}>();

const emit = defineEmits(['editWebhookClicked']);
console.log('Card Webhook: ', webhook);
const toast = useToast(); // For notifications
const authStore = useAuthStore();
const isModalOpen = ref(false);

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const emitEditWebhook = () => {
	emit('editWebhookClicked', webhook); // Emit the webhook object
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
