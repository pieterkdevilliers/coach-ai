<template>
	<UCard>
		<!-- Display when scoreapp_account exists -->
		<div v-if="scoreapp_account && scoreapp_account.account.id">
			<p class="paragraph-label-text block">
				<strong class="paragraph-label-text__label"
					>Integrated ScoreApp Account Subdomain:</strong
				>
				<UTooltip
					:text="scoreapp_account.account.scoreapp_id"
					class="paragraph-label-text__text"
				>
					<span>
						{{ scoreapp_account.account.scoreapp_id }}
					</span>
				</UTooltip>
			</p>
			<p class="paragraph-label-text block">
				<strong class="paragraph-label-text__label"
					>Webhook Secret Key:</strong
				>
				<UTooltip
					:text="scoreapp_account.widget_key"
					class="paragraph-label-text__text"
				>
					<span>
						{{ scoreapp_account.widget_key }}
					</span>
				</UTooltip>
			</p>
		</div>
		
		<!-- Display when no scoreapp_account -->
		<div v-else class="text-center py-4">
			<p class="text-gray-500">No ScoreApp account configured</p>
			<p class="text-sm text-gray-400 mt-1">
				Set up your ScoreApp integration to get started
			</p>
		</div>

		<template #footer>
			<div v-if="scoreapp_account && scoreapp_account.account.scoreapp_id" class="flex gap-2">
				<UTooltip text="Edit ScoreApp Account Integration">
					<UButton
						icon="i-heroicons:pencil-square"
						@click="emitEditScoreAppSubdomain"
					/>
				</UTooltip>
			</div>
			<div v-else class="flex gap-2">
				<UTooltip text="Add ScoreApp Account Integration">
					<UButton
						icon="i-heroicons:plus"
						@click="emitAddScoreAppSubdomain"
					/>
				</UTooltip>
			</div>
		</template>
	</UCard>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { scoreapp_account } = defineProps<{
		scoreapp_account: {
			account: {
				account_unique_id: string;
				scoreapp_id: string;
				id: number;
			};
			widget_key: string
		};
}>();

const emit = defineEmits(['edit-scoreapp-account-clicked', 'add-scoreapp-account-clicked']);
console.log('ScoreApp Account: ', scoreapp_account);
const toast = useToast(); // For notifications
const authStore = useAuthStore();
const isModalOpen = ref(false);

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const emitEditScoreAppSubdomain = () => {
	emit('edit-scoreapp-account-clicked', scoreapp_account);
};

const emitAddScoreAppSubdomain = () => {
	emit('add-scoreapp-account-clicked', scoreapp_account);
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
