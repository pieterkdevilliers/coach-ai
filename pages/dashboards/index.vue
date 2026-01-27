<template>
	<section class="dashboard container--default mx-auto">
		<div class="page-header">
			<h2 class="heading heading--h2 page__title">Dashboard Data</h2>
		</div>

		<!-- Show a global error if the fetch fails -->
		<div v-if="!pending && error" class="text-center p-8 text-red-500">
			Error loading data: {{ error.message }}
		</div>

		<!-- The grid now uses our new reusable component -->
		<div class="card-grid">
			<div class="card__outer">
				<DashboardStatsCard
					title="Chat Sessions"
					subtitle="Last 30 Days"
					:loading="pending"
					:value="data?.chat_session_count ?? 0"
					class="card__inner dashboard-stats-card"
				/>
			</div>

			<div class="card__outer">
				<DashboardStatsCard
					title="Questions Answered"
					subtitle="Last 30 Days"
					:loading="pending"
					:value="data?.questions_answered_count ?? 0"
					class="card__inner dashboard-stats-card"
				/>
			</div>

			<div class="card__outer">
				<DashboardStatsCard
					title="Email Messages"
					subtitle="Last 30 Days"
					:loading="pending"
					:value="data?.email_message_count ?? 0"
					class="card__inner dashboard-stats-card"
				/>
			</div>

			<div class="card__outer">
				<DashboardStatsCard
					title="Source Documents"
					subtitle="In AI Database"
					:loading="pending"
					:value="data?.processed_docs_count ?? 0"
					class="card__inner dashboard-stats-card"
				/>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
const { request } = useApi();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

definePageMeta({
	middleware: 'auth',
	layout: 'user-access',
});

// This is the complete and corrected useFetch call.
const url = `${config.public.apiBase}/get-dashboard-data/${uniqueAccountId}`;

const { data, error, pending } = request(url, {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiAuthorizationToken}`,
	},
	transform: (res) => res, // unwrap the response
	lazy: false, // fetch immediately
});
console.log('Dashboard data:', data, error, pending);

// Optional: You can watch for errors to log them or show a notification.
watch(error, (newError) => {
	if (newError) {
		console.error('API Error:', newError.message);
	}
});
</script>
