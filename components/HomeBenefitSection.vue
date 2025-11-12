<template>
	<div class="benefits-section container--default mx-auto">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="text-gradient heading heading__h2">
				For Coaches, Consultants & Authors
				<span class="heading__span--block"
							>Convert curiosity into clients - without typing a word.</span
						>
			</h2>
		</div>

		<div
			class="grid grid-cols-1 gap-8 md:gap-14 md:grid-cols-2 lg:grid-cols-3"
		>
			<PlainCard
				v-for="(benefit, index) in benefits"
				:key="index"
				:class="['card--plain']"
			>
				<template #header>
					<component
						:is="benefit.icon"
						v-if="benefit.icon"
						class="card__icon icon--bg icon--purple size--8 md:size--10"
						aria-hidden="true"
					/>
					<div
						v-else
						class="h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center"
					>
						<!-- Fallback visual if no specific icon -->
						<span
							class="text-primary-600 dark:text-primary-400 text-lg"
							>✓</span
						>
					</div>
					<h3 class="card__title">{{ benefit.title }}</h3>
				</template>
				<div v-html="benefit.description"></div>
			</PlainCard>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef, type Component } from 'vue';
import {
	ClockIcon,
	ArrowPathIcon,
	CursorArrowRippleIcon,
	CursorArrowRaysIcon,
	CheckCircleIcon,
	SparklesIcon,
	TicketIcon,
} from '@heroicons/vue/24/outline';
import PlainCard from '~/components/PlainCard.vue';

interface Benefit {
	icon?: Component; // Make icon optional or provide a default
	title: string;
	description: string;
}

const benefits = ref<Benefit[]>([
	{
		icon: shallowRef(ClockIcon),
		title: 'Pre-Sales Assistant',
		description:
			'Let ExpertEcho qualify leads, answer objections, and pitch your services - on autopilot.',
	},
	{
		icon: shallowRef(ArrowPathIcon),
		title: 'Authority at Scale',
		description:
			'Your expertise works harder - while you coach, write, or consult.',
	},
	{
		icon: shallowRef(CursorArrowRaysIcon),
		title: 'Closer to Clients',
		description:
			'Instantly give prospects the clarity they need (and deserve), when they need it.',
	},
]);
</script>

<style scoped>
/* Component-specific styles can go here */

/* Ensure primary color is defined or use a default Tailwind color */
/* e.g., in your tailwind.config.js or replace .text-primary-600 with .text-indigo-600 etc. */
.text-primary-600 {
	color: #4f46e5; /* Example: Indigo 600 */
}
.dark .text-primary-400 {
	color: #818cf8; /* Example: Indigo 400 */
}
.bg-primary-100 {
	background-color: #e0e7ff; /* Example: Indigo 100 */
}
.dark .bg-primary-900 {
	background-color: #3730a3; /* Example: Indigo 900 */
}
</style>
