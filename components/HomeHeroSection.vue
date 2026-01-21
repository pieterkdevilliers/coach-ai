<template>
	<!-- This outer div is the single root element -->
	<div class="container--default container--full container__hero-section">
		<div class="container__inner">
			<div
				class="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-16 items-center md:px-8"
			>
				<div
					class="text-block text-block--left text-block--wide order-2 md:order-none"
				>
					<h1 class="heading heading--h1">
						<span class="heading__span--block font-extrabold"
							>ExpertEcho</span
						>
						<span class="heading__span--block"
							>AI Chat Support for Small Businesses - Expertly Set
							Up and Optimized.</span
						>
					</h1>
					<p>
						Transform your website into a 24/7 customer support
						powerhouse. Our experts handle the setup, prompt
						optimisation and website integration seamlessly. You
						enjoy ongoing AI-powered customer support chats,
						answering queries from your knowledge base to boost
						satisfaction and sales.
					</p>
				</div>
				<div class="video-container order-1 md:order-2">
					<HomeHeroVideo />
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import HomeHeroVideo from './HomeHeroVideo.vue';
</script>

<style scoped>
/* Add component-specific styles here if needed */
</style>
