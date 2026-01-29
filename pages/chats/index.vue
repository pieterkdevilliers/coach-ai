<template>
	<section class="folders container--default mx-auto">
		<div class="page-header">
			<h2 class="heading heading--h2 text-gradient">Chat Sessions</h2>
		</div>
		<div class="search-pagination-container">
			<!-- Search Input -->
			<div class="search-input__container">
				<UInput v-model="q" placeholder="Filter chat sessions..." />
			</div>
			<!-- Pagination Controls -->
			<div class="pagination pagination--top">
				<UPagination
					v-model="page"
					:page-count="totalPages.value"
					:total="filteredRows.length"
				/>
			</div>
		</div>

		<UTable
			:rows="paginatedRows"
			:columns="columns"
			:loading="!chatSessions"
			:loading-text="'Loading chat sessions...'"
			:sticky="true"
			class="content-table chat-sessions__table"
		>
			<template #visitor_uuid-data="{ row }">
				<UTooltip :text="row.visitor_uuid">
					<span class="restricted-width">
						{{ row.visitor_uuid }}
					</span>
				</UTooltip>
			</template>
			<template #visitor_email-data="{ row }">
				<UTooltip :text="row.visitor_email">
					<span class="restricted-width">
						{{ row.visitor_email }}
					</span>
				</UTooltip>
			</template>
			<template #file_name-data="{ row }">
				<span>{{ row.file_name }}</span>
			</template>
			<template #start_time-data="{ row }">
				<UTooltip :text="formatDateTime(row.start_time)">
					<span class="restricted-width">{{
						formatDateTime(row.start_time)
					}}</span>
				</UTooltip>
			</template>

			<template #end_time-data="{ row }">
				<UTooltip :text="formatDateTime(row.end_time)">
					<span class="restricted-width">{{
						formatDateTime(row.end_time)
					}}</span>
				</UTooltip>
			</template>
			<template #view-data="{ row }">
				<UTooltip text="View Chat Session">
					<UButton
						variant="ghost"
						icon="i-heroicons-eye-20-solid"
						@click="openViewChatModal(row)"
					/>
				</UTooltip>
			</template>
			<template #sentiment_analysis-data="{ row }">
				<div class="flex items-center justify-center gap-4 w-full">
					<!-- --- ITEM 1: INITIAL QUERY --- -->
					<!-- Case A: Data exists -> Show Popover -->
					<UPopover
						v-if="row.initial_query_sentiment_explanation"
						:mode="isMobile ? 'click' : 'hover'"
						:open-delay="100"
						:close-delay="100"
						:popper="{ placement: 'top', strategy: 'fixed' }"
					>
						<UButton
							variant="ghost"
							icon="i-heroicons-question-mark-circle-solid"
							class="popover-trigger cursor-pointer"
							:class="[
								row.initial_query_sentiment === 'positive'
									? 'sentiment-positive'
									: '',
								row.initial_query_sentiment === 'neutral'
									? 'sentiment-neutral'
									: '',
								row.initial_query_sentiment === 'negative'
									? 'sentiment-negative'
									: '',
							]"
						/>
						<template #panel>
							<div
								class="p-4 max-w-xs text-sm leading-relaxed bg-white dark:bg-gray-900 shadow-xl rounded-lg popover-content"
							>
								<h4
									:class="{
										'text-green-700':
											row.initial_query_sentiment ===
											'positive',
										'text-yellow-500':
											row.initial_query_sentiment ===
											'neutral',
										'text-red-700':
											row.initial_query_sentiment ===
											'negative',
										'text-purple-800':
											!row.initial_query_sentiment,
									}"
								>
									Initial Query -
									{{ row.initial_query_sentiment }}
								</h4>
								<p>
									{{
										row.initial_query_sentiment_explanation
									}}
								</p>
							</div>
						</template>
					</UPopover>

					<!-- Case B: No Data -> Show Tooltip -->
					<UTooltip v-else text="No sentiment available">
						<UButton
							variant="ghost"
							icon="i-heroicons-question-mark-circle-solid"
							class="text-slate-400 opacity-50 cursor-default p-1"
						/>
					</UTooltip>

					<!-- --- ITEM 2: CONVERSATION --- -->
					<!-- Case A: Data exists -> Show Popover -->
					<UPopover
						v-if="row.conversation_sentiment_explanation"
						:mode="isMobile ? 'click' : 'hover'"
						:open-delay="100"
						:close-delay="500"
						:popper="{ placement: 'top', strategy: 'fixed' }"
					>
						<UButton
							variant="ghost"
							icon="i-heroicons-chat-bubble-left-right-solid"
							class="popover-trigger cursor-pointer"
							:class="[
								row.conversation_sentiment === 'positive'
									? 'sentiment-positive'
									: '',
								row.conversation_sentiment === 'neutral'
									? 'sentiment-neutral'
									: '',
								row.conversation_sentiment === 'negative'
									? 'sentiment-negative'
									: '',
							]"
						/>
						<template #panel>
							<div
								class="p-4 max-w-xs text-sm leading-relaxed bg-white dark:bg-gray-900 shadow-xl rounded-lg popover-content"
							>
								<h4
									:class="{
										'text-green-700':
											row.conversation_sentiment ===
											'positive',
										'text-yellow-500':
											row.conversation_sentiment ===
											'neutral',
										'text-red-700':
											row.conversation_sentiment ===
											'negative',
									}"
								>
									Full Conversation -
									{{ row.conversation_sentiment }}
								</h4>
								<p>
									{{ row.conversation_sentiment_explanation }}
								</p>
							</div>
						</template>
					</UPopover>

					<!-- Case B: No Data -> Show Tooltip -->
					<UTooltip v-else text="No sentiment available">
						<UButton
							variant="ghost"
							icon="i-heroicons-chat-bubble-left-right-solid"
							class="text-slate-400 opacity-50 cursor-default p-1"
						/>
					</UTooltip>
				</div>
			</template>
		</UTable>

		<!-- Pagination Controls -->
		<div class="pagination pagination--bottom">
			<UPagination
				v-model="page"
				:page-count="totalPages.value"
				:total="filteredRows.length"
			/>
		</div>
	</section>

	<!-- View Chat Modal -->
	<UModal v-model="isViewChatModalOpen" class="modal--wide">
		<div class="p-5">
			<ViewChatModal
				@close="closeViewChatModal"
				v-if="selectedSessionId"
				:session-id="selectedSessionId"
			/>
		</div>
	</UModal>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { useAuthStore } from '~/stores/auth';
import { computed, ref, stop, watch, onMounted, onUnmounted } from 'vue';
import { format, parseISO } from 'date-fns';
const { request } = useApi();

// mobile detection

const isMobile = ref(false);

// Function to update the state
const updateBreakpoint = () => {
	if (import.meta.client) {
		isMobile.value = window.innerWidth < 768;
	}
};

onMounted(() => {
	updateBreakpoint();
	window.addEventListener('resize', updateBreakpoint);
});

onUnmounted(() => {
	window.removeEventListener('resize', updateBreakpoint);
});

// Helper function
function formatDateTime(isoString: string | null | undefined): string {
	if (!isoString) return 'N/A';
	return format(parseISO(isoString), 'd MMMM yyyy - HH:mm');
}

definePageMeta({
	middleware: 'auth',
	layout: 'user-access',
});

// Interfaces
interface ChatSession {
	id: number;
	visitor_uuid: string;
	start_time: string;
	end_time: string;
	account_unique_id: string;
	visitor_name: string;
	visitor_email: string;
	initial_query_sentiment: 'positive' | 'neutral' | 'negative' | null;
	initial_query_sentiment_explanation: string | null;
	conversation_sentiment: 'positive' | 'neutral' | 'negative' | null;
	conversation_sentiment_explanation: string | null;
}

const toast = useToast();
const authStore = useAuthStore();
const selectedSessionId = ref<number | null>(null);
const isViewChatModalOpen = ref(false);
const account_unique_id = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

// Data Fetching (unchanged)
const { data: rawData, error } = request(
	`${config.public.apiBase}/chat-sessions/${account_unique_id}`,
	{
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${apiAuthorizationToken}`,
		},
		default: () => null, // initially null
	}
);

// 2️⃣ Extract the array into a computed ref
const chatSessions = computed<ChatSession[]>(() => {
	// If no data yet, return empty array
	if (!rawData.value) return [];

	// API response might have chat_sessions array
	const sessions = rawData.value?.chat_sessions ?? [];
	return Array.isArray(sessions) ? sessions : [];
});
console.log('Fetched Chat Sessions:', chatSessions);
console.log('Fetched Chat Sessions:', chatSessions.value);

if (error.value) {
	console.error('Error fetching chat sessions:', error.value);
	toast.add({
		title: 'Error',
		description: `Could not fetch chat sessions: ${
			error.value.message || 'Unknown error'
		}`,
		color: 'red',
	});
}

const columns = [
	{ key: 'id', label: 'ID' },
	{ key: 'visitor_name', label: 'Name' },
	{ key: 'visitor_email', label: 'Email' },
	{ key: 'visitor_uuid', label: 'Visitor ID' },
	{ key: 'start_time', label: 'Start Time' },
	{ key: 'end_time', label: 'End Time' },
	{ key: 'view', label: 'View Chat' },
	{
		key: 'sentiment_analysis', // Changed key to reflect combined content
		label: 'Sentiment',
	},
];

// --- Pagination and Filtering Logic ---

// Pagination setup
const page = ref(1);
const itemsPerPage = 10;

// State for filtering
const q = ref('');

// Filtered rows (unchanged, but now feeds into pagination)
const filteredRows = computed(() => {
	if (!chatSessions.value || !Array.isArray(chatSessions.value)) return [];

	if (!q.value) return chatSessions.value;

	return chatSessions.value.filter((session) => {
		return Object.values(session).some((value) =>
			String(value).toLowerCase().includes(q.value.toLowerCase())
		);
	});
});
console.log('Filtered Rows:', filteredRows.value);

// Total number of pages (computed dynamically)
const totalPages = computed(() => {
	if (!filteredRows.value.length) return 1;
	return Math.ceil(filteredRows.value.length / itemsPerPage);
});

// [!code-start++]
// 2. Reset page to 1 when filter changes
watch(q, () => {
	page.value = 1;
});

// 3. New computed property to get the rows for the current page
const paginatedRows = computed(() => {
	const startIndex = (page.value - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	return filteredRows.value.slice(startIndex, endIndex);
});
// [!code-end++]

// --- Modal and Actions Logic (unchanged) ---
const openViewChatModal = (row: ChatSession) => {
	selectedSessionId.value = row.id;
	isViewChatModalOpen.value = true;
};
const closeViewChatModal = () => {
	isViewChatModalOpen.value = false;
	selectedSessionId.value = null;
};
</script>

<style scoped>
.restricted-width {
	max-width: 150px;
	display: inline-block;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.popover-trigger {
	@apply transition-colors duration-200;
}

.sentiment-positive {
	@apply text-green-600 hover:text-green-700 hover:bg-green-50;
}
.sentiment-neutral {
	@apply text-yellow-400 hover:text-yellow-700 hover:bg-yellow-50;
}
.sentiment-negative {
	@apply text-red-600 hover:text-red-700 hover:bg-red-50;
}

.popover-content h4 {
	@apply font-bold text-lg border-b pb-1 mb-2 capitalize;
}
.popover-content.query h4 {
	@apply text-purple-800;
}
.popover-content p {
	@apply max-w-full whitespace-normal;
}
</style>
