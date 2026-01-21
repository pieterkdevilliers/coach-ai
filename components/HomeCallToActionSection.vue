<template>
	<!-- This outer div is the single root element -->
	<div class="home-cta-section container--default">
		<div class="text-center">
			<h2 class="heading heading__h2 mb-6">Stop juggling support - start delivering seamless customer experiences.
				<span class="heading__span--block font-extrabold"
					>With ExpertEcho's expert setup and AI power, your business supports visitors effortlessly.</span
				>
				<span class="heading__span--block"
					><strong><em>Book Your Setup Consultation Today</em></strong></span
				>
			</h2>
		</div>
		<div class="form-container">
			<SignupForm />
		</div>
	</div>
</template>

<script setup lang="ts">
import SignupForm from './SignupForm.vue'; // Import the SignupForm component
</script>

<style scoped>
/* Add component-specific styles here if needed */
</style>
