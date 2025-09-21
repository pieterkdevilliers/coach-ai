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
		</div>
		
		<!-- Display when no scoreapp_account -->
		<div v-else class="text-center py-4">
			<p class="text-gray-500">No ScoreApp account configured</p>
			<p class="text-sm text-gray-400 mt-1">
				Set up your ScoreApp integration to get started
			</p>
		</div>

		<!-- Footer slot - only show when scoreapp_account exists -->
		<template v-if="scoreapp_account && scoreapp_account.account" #footer>
			<div class="flex gap-2">
				<UTooltip text="Edit ScoreApp Account Subdomain">
					<UButton
						icon="i-heroicons:pencil-square"
						@click="emitEditScoreAppSubdomain"
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
			}
		};
}>();

const emit = defineEmits(['emitEditScoreAppSubdomainClicked']);
console.log('ScoreApp Account: ', scoreapp_account);
const toast = useToast(); // For notifications
const authStore = useAuthStore();
const isModalOpen = ref(false);

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const emitEditScoreAppSubdomain = () => {
	emit('emitEditScoreAppSubdomainClicked', scoreapp_account);
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
