<template>
	<!-- Show a loader while fetching -->
	<div v-if="pending">Loading Word Cloud...</div>

	<!-- Show the image only if we have the URL from the response -->
	<img
		v-else-if="data && data.wordcloud_url"
		:src="data.wordcloud_url"
		alt="Word Cloud"
		class="block mx-auto max-w-full h-auto"
	/>
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const account_unique_id = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;
const config = useRuntimeConfig();
const apiBaseUrl = config.public.apiBase;

// 1. Build the API endpoint URL
// Note: Check if your FastAPI route needs the trailing slash or not.
const apiUrl = `${apiBaseUrl}/reporting/wordcloud/${account_unique_id}`;

// 2. Execute the fetch
// We destructure 'data' (the JSON response), 'pending', and 'error'
const { data, pending, error } = await useFetch(apiUrl, {
	server: false,
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: `Bearer ${apiAuthorizationToken}`,
	},
});

// Debugging: See what the backend actually returned
watchEffect(() => {
	if (data.value) {
		console.log('API Response Data:', data.value);
	}
	if (error.value) {
		console.error('Fetch Error:', error.value);
	}
});
</script>
