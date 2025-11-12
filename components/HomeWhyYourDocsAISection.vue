<template>
	<div class="why-sourceproof-section container--default mx-auto">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="text-gradient heading heading--2">
				Why ExpertEcho?
				<span class="heading__span--block"
							>Scale your authority. Automate your expertise. Convert more.</span
						>
			</h2>
		</div>
		<div class="reason-grid">
			<div
				v-for="(reason, index) in reasons"
				:key="index"
				class="reason-item min-h-40"
			>
				<PlainCard>
					<template #header>
						<component
							:is="reason.icon"
							class="icon--bg icon--purple size--8 md:size--10"
							aria-hidden="true"
						/>
						<h3 class="card__title">
							{{ reason.title }}
						</h3>
					</template>
					<div v-html="reason.description"></div>
				</PlainCard>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, shallowRef, type Component } from 'vue';
import {
	FolderIcon,
	DocumentCheckIcon,
	SparklesIcon,
	ClockIcon,
	CheckBadgeIcon,
} from '@heroicons/vue/24/outline';
import PlainCard from './PlainCard.vue';

interface Reason {
	icon?: Component;
	title: string;
	description: string;
}

const reasons = ref<Reason[]>([
	{
		icon: shallowRef(FolderIcon),
		title: 'Be Everywhere at Once',
		description:
			'ExpertEcho turns your content into a living digital replica of your expertise - engaging prospects while you sleep.',
	},
	{
		icon: shallowRef(DocumentCheckIcon),
		title: 'Sell Through Conversation',
		description: 'Transform static documents into dynamic, personalized sales conversations, not just FAQ responses.',
	},
	{
		icon: shallowRef(SparklesIcon),
		title: 'Always on Brand, Always Accurate',
		description: 'Powered exclusively by your books, courses, and IP. No fluff, no hallucinations - just your knowledge.',
	},
	{
		icon: shallowRef(ClockIcon),
		title: 'Effortless Setup',
		description: "Upload, embed, and you're live - no coding or developers needed.",
	},
]);

// Handle odd number of cards
onMounted(() => {
	const reasonsCount = ref(reasons.value.length);
	const reasonsCountOdd = ref(reasonsCount.value % 2 === 1);
	const reasonCard = document.querySelectorAll('.reason-card');

	if (reasonsCountOdd.value) {
		reasonCard.forEach((card) => {
			card.classList.add('count--odd');
		});
	}
});
</script>

<style scoped></style>
