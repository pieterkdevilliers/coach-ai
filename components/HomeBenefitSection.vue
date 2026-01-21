<template>
	<div class="benefits-section container--default mx-auto">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="text-gradient heading heading__h2">
				For Small and Medium Businesses
				<span class="heading__span--block md:max-w-lg mx-auto"
					>Handle customer queries efficiently - without expanding
					your team.</span
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
	ArrowTrendingUpIcon,
	UserGroupIcon,
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
		title: '24/7 Support Assistant',
		description:
			'Our setup service configures ExpertEcho to resolve common inquiries, escalate complex ones via email, and provide source-linked answers - all automated for your business.',
	},
	{
		icon: shallowRef(ArrowTrendingUpIcon),
		title: 'Efficiency at Scale',
		description:
			'Your business knowledge works round-the-clock - freeing you to focus on operations, growth, and serving customers.',
	},
	{
		icon: shallowRef(UserGroupIcon),
		title: 'Closer to Customers',
		description:
			'Deliver instant, accurate responses to keep visitors engaged and convert more inquiries into sales.',
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
