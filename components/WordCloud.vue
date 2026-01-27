<template>
	<h3>Word Cloud Component</h3>
	<h4>Account Unique ID: {{ account_unique_id }}</h4>
</template>
<script setup lang="ts">
console.log('Wordcloud component loaded');

const authStore = useAuthStore();
const account_unique_id = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;
</script>
