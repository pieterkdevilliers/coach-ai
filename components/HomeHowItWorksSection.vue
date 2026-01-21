<template>
	<div class="how-it-works-section container--default mx-auto">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="text-gradient heading heading--2">How It Works
				<span class="heading__span--block"
							>From Business Docs to Optimised Support in 3 Steps</span
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
		title: 'Expert-Led Setup',
		description:
			'We collaborate to upload your docs (.pdf, .doc, etc.), structure them for best results, optimise your main prompt, and configure the account - all with 30 days of guidance.',
	},
	{
		number: 2,
		title: 'Embed & Launch',
		description:
			'Generate your secure widget code (like Google Tag Manager) and add it to your site. Customise appearance to match your brand.',
	},
	{
		number: 3,
		title: 'Support & Insights',
		description:
			'Customers chat; ExpertEcho responds accurately from your database, links sources, and stores anonymised sessions for review. Use insights to refine your content and operations.',
	},
]);
</script>

<style scoped>
/* The .step-item class in the template now carries the primary box styling.
   The internal layout (flex flex-col items-center...) remains to position
   the number bubble and text within this box. */
</style>
