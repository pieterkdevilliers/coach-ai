<template>
	<UButton
		icon="i-heroicons:chat-bubble-left-right-20-solid"
		to="https://calendar.app.google/TiRKaEo3UiVdPJM19"
		target="_blank"
		rel="noopener noreferrer"
		variant="solid"
		class="lets-chat-button px-4 py-2 rounded-full flex mx-auto justify-center text-xl font-medium transition-all shadow-xl hover:shadow-none border-2"
	>
		<slot> {{ label || "Let's Chat" }}</slot>
	</UButton>
</template>
<script setup lang="ts">
defineProps<{
	label?: string;
}>();
</script>
