<template>
	<UCard>
		<h2>Only edit these if you understand what you are doing.</h2>
		<p class="paragraph-label-text block">
			<strong class="paragraph-label-text__label"
				>Relevancy Score: {{ llm_vars.account.relevance_score }}</strong
			>
		</p>
		<p>Threshold for how closely a retrieved document must match the query to be considered.
		Higher values mean only highly relevant documents are used, lower values allow more lenient matches.</p>
		<p class="paragraph-label-text block">
			<strong class="paragraph-label-text__label"
				>Temperature: {{ llm_vars.account.temperature }}</strong
			>
		</p>
		<p>Controls the randomness of the LLM’s output when generating text.
		Lower values (e.g., 0.2) produce more deterministic, focused responses; higher values (e.g., 0.8) produce more creative or varied outputs.</p>
		<p class="paragraph-label-text block">
			<strong class="paragraph-label-text__label"
				>K-Value: {{ llm_vars.account.k_value }}</strong
			>
		</p>
		<p>The maximum number of documents retrieved from the vector store for a given query.
		Even if more relevant documents exist, only the top k are fetched for context.</p>
		<p class="paragraph-label-text block">
			<strong class="paragraph-label-text__label"
				>Number of Sources Returned: {{ llm_vars.account.sources_returned }}</strong
			>
		</p>
		<p>How many of the retrieved sources (documents) are actually sent back to the user alongside the LLM response.
		This can be fewer than K-Value to avoid overwhelming the user while still using all documents for context internally.</p>
		<p class="paragraph-label-text block">
			<strong class="paragraph-label-text__label"
				>Chunk Size: {{ llm_vars.account.chunk_size }}</strong
			>
		</p>
		<p>Size of each document fragment when splitting large texts for embedding and retrieval.
		Smaller chunks can improve retrieval granularity but increase the number of embeddings.</p>
		<p class="paragraph-label-text block">
			<strong class="paragraph-label-text__label"
				>Chunk Overlap: {{ llm_vars.account.chunk_overlap }}</strong
			>
		</p>
		<p>Number of overlapping tokens/words between consecutive chunks.
		Helps maintain context across chunks so information isn’t lost at boundaries.</p>
		<template #footer>
			<div class="flex items-center gap-2">
				

				<UTooltip text="Edit Your LLM Settings">
				<UButton
					icon="i-heroicons:pencil-square"
					@click="emitEditLLMVars"
				/>
				</UTooltip>
				<UButton
				color="gray"
				variant="outline"
				class="ml-auto"
				@click="resetLLMVars"
				>
				Reset LLM Settings to Defaults
				</UButton>
			</div>
		</template>

	</UCard>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const DEFAULT_LLM_VARS = {
  relevance_score: 0.7,
  temperature: 0.2,
  k_value: 7,
  sources_returned: 3,
  chunk_size: 1000,
  chunk_overlap: 200,
};

const { llm_vars } = defineProps<{
	llm_vars: {
		// The object passed from the parent has an 'account' key
		account: {
			id: number;
			relevance_score: number;
			temperature: number;
			k_value: number;
			sources_returned: number;
			chunk_size: number;
			chunk_overlap: number;
		};
	};
}>();

const emit = defineEmits(['edit-llmvars-clicked']);
console.log('Card llm_vars: ', llm_vars);
const toast = useToast(); // For notifications
const authStore = useAuthStore();
const isModalOpen = ref(false);

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const emitEditLLMVars = () => {
	emit('edit-llmvars-clicked', llm_vars);
};

const resetLLMVars = () => {
  emit('edit-llmvars-clicked', {
    account: { ...DEFAULT_LLM_VARS, id: llm_vars.account.id },
  });
  toast.add({
    title: 'LLM Vars Reset',
    description: 'LLM variables have been reset to defaults.',
    color: 'green',
  });
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
