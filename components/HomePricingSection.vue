<template>
	<div class="how-it-works-section container--default mx-auto">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="text-gradient heading heading--2">What It Costs</h2>
		</div>
		<div class="grid md:grid-cols-3 gap-6 lg:gap-8">
			<div
				v-for="(step, index) in steps"
				:key="index"
				class="step-item shadow-box"
			>
				<!-- Number Bubble - its styling remains distinct -->
				<div class="icon icon__number">
					<component
						:is="step.icon"
						v-if="step.icon"
						class="icon--white size--8"
						aria-hidden="true"
					/>
				</div>
				<!-- Text Content -->
				<div>
					<!-- Removed md:mt-4 as p-6 on parent and mb-6 on bubble handle spacing -->
					<h3 class="text-xl mb-2">
						{{ step.title }}
					</h3>
					<h3 class="text-lg mb-2">
						{{ step.subtitle }}
					</h3>
					<p class="text-base" v-html="step.description"></p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef, type Component } from 'vue';
import {
	BeakerIcon,
	CurrencyDollarIcon,
	ArchiveBoxXMarkIcon,
	SparklesIcon,
	CreditCardIcon,
} from '@heroicons/vue/24/outline';

interface Step {
	icon?: Component;
	title: string;
	subtitle: string;
	description: string;
}

const steps = ref<Step[]>([
	{
		icon: shallowRef(SparklesIcon),
		title: 'Expert Setup',
		subtitle: '£499 One-Time Fee',
		description:
			'Our consulting team handles everything: document uploads, prompt optimisation for 30 days, and widget integration - getting you to value fast.',
	},
	{
		icon: shallowRef(CreditCardIcon),
		title: 'Ongoing Subscription',
		subtitle: '£59/month or £590/year',
		description:
			'Access the AI chat platform, unlimited queries, chat storage, and basic support. Save with annual billing.',
	},
	{
		icon: shallowRef(ArchiveBoxXMarkIcon),
		title: 'Cancel anytime',
		subtitle: 'No Lock-In',
		description: "No contracts - if it's not a fit, walk away hassle-free.",
	},
]);
</script>

<style scoped>
/* The .step-item class in the template now carries the primary box styling.
   The internal layout (flex flex-col items-center...) remains to position
   the number bubble and text within this box. */
</style>
