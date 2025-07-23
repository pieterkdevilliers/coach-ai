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
const config = useRuntimeConfig();
const authStore = useAuthStore();
const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

definePageMeta({
	middleware: 'auth',
	layout: 'user-access',
});

// This is the complete and corrected useFetch call.
const { data, pending, error } = useFetch(
	// The URL is wrapped in a getter `()` to make it reactive.
	() => `${config.public.apiBase}/get-dashboard-data/${uniqueAccountId}`,
	{
		method: 'GET',
		headers: {
			accept: 'application/json',

			Authorization: `Bearer ${apiAuthorizationToken}`,
		},

		// 'lazy: true' lets the page render instantly while data loads in the background.
		// This provides a much better user experience than a blank loading screen.
		lazy: true,
	}
);

// Optional: You can watch for errors to log them or show a notification.
watch(error, (newError) => {
	if (newError) {
		console.error('API Error:', newError.message);
	}
});
</script>
