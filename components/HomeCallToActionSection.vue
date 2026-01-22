<template>
	<!-- This outer div is the single root element -->
	<div class="home-cta-section container--default">
		<div class="text-center">
			<h2 class="heading heading__h2">
				Stop juggling support - start delivering seamless customer
				experiences.
			</h2>
			<h2 class="heading__h2">
				With ExpertEcho's expert setup and AI power, your business
				supports visitors effortlessly.
			</h2>
			<LetsChatButton
				icon="i-heroicons:calendar-days-20-solid"
				size="xl"
				class="bg-purple-800 max-w-lg mt-10 mb-12 text-sm md:text-xl lg:text-2xl"
				>Book Your Setup Consultation Today</LetsChatButton
			>
		</div>
		<div class="form-container">
			<SignupForm />
		</div>
	</div>
</template>

<script setup lang="ts">
import SignupForm from './SignupForm.vue'; // Import the SignupForm component
import LetsChatButton from './LetsChatButton.vue';
</script>

<style scoped>
/* Add component-specific styles here if needed */
</style>
