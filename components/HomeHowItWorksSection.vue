<template>
	<div class="how-it-works-section container--default mx-auto">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="text-gradient heading heading--2">How It Works
				<span class="heading__span--block"
							>From Your Content to Real Conversions in 3 Steps</span
						>
			</h2>
		</div>
		<div class="grid md:grid-cols-3 gap-12 lg:gap-16">
			<div
				v-for="(step, index) in steps"
				:key="index"
				class="step-item border-box border-box--center border-box--purple"
			>
				<!-- Number Bubble - its styling remains distinct -->
				<div class="icon__number">
					{{ step.number }}
				</div>
				<!-- Text Content -->
				<div>
					<!-- Removed md:mt-4 as p-6 on parent and mb-6 on bubble handle spacing -->
					<h3 class="text-xl mb-2">
						{{ step.title }}
					</h3>
					<p class="text-base" v-html="step.description"></p>
				</div>
				<i class="step-arrow">&rarr;</i>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Step {
	number: number;
	title: string;
	description: string;
}

const steps = ref<Step[]>([
	{
		number: 1,
		title: 'Upload Your Expert Content',
		description:
			'Share your books, programs, transcripts, blog posts—anything that defines your authority.',
	},
	{
		number: 2,
		title: 'Brand & Embed',
		description:
			'Seamlessly match InfiniteYou to your site’s look and feel. Place it wherever prospects engage most.',
	},
	{
		number: 3,
		title: 'Engage & Convert ',
		description:
			'People ask. InfiniteYou answers — always with your voice, guiding them toward what matters next.',
	},
]);
</script>

<style scoped>
/* The .step-item class in the template now carries the primary box styling.
   The internal layout (flex flex-col items-center...) remains to position
   the number bubble and text within this box. */
</style>
