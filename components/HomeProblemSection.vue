<template>
	<div class="problem-section overflow-container">
		<div class="container__inner">
			<h2 class="mb-8">
				<span class="text-gradient heading__span--block"
					>Is Your Business Losing Customers to Unanswered Questions?</span
				>
			</h2>
		</div>
		<div class="overflow-content">
			<div
				class="grid sm:grid-cols-2 lg:grid-cols-4 justify-center gap-6"
			>
				<div
					v-for="(problem, index) in problems"
					:key="index"
					class="problem-box"
				>
					<div class="flex flex-col items-center">
						<component
							:is="problem.icon"
							v-if="problem.icon"
							class="icon--purple size--10"
							aria-hidden="true"
						/>
						<p class="problem-box__description">
							{{ problem.description }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef, type Component } from 'vue';
import {
	QuestionMarkCircleIcon,
	DocumentMagnifyingGlassIcon,
	ClockIcon,
	BanknotesIcon,
	InformationCircleIcon,
} from '@heroicons/vue/24/outline';

interface Problem {
	icon?: Component; // Make icon optional or provide a default
	description: string;
}

const problems = ref<Problem[]>([
	{
		icon: shallowRef(DocumentMagnifyingGlassIcon),
		description:
			"Visitors abandon your site when they can't get quick answers to their queries.",
	},
	{
		icon: shallowRef(ClockIcon),
		description:
			'Your team wastes time on repetitive support emails and calls, pulling focus from core operations.',
	},
	{
		icon: shallowRef(BanknotesIcon),
		description:
			"Opportunities slip away when potential customers need info outside business hours.",
	},
	{
		icon: shallowRef(InformationCircleIcon),
		description: 'Scaling support typically requires more hires or expensive tools - until now.',
	},
]);
</script>

<style scoped></style>
