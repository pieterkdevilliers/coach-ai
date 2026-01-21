<template>
	<div class="why-sourceproof-section container--default mx-auto">
		<div class="text-center mb-10 md:mb-12">
			<h2 class="text-gradient heading heading--2">
				Why ExpertEcho?
				<span class="heading__span--block"
							>Scale your support. Automate answers. Grow your business.</span
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
		title: 'Available 24/7',
		description:
			'ExpertEcho handles queries anytime, reducing after-hours work and keeping customers satisfied.',
	},
	{
		icon: shallowRef(DocumentCheckIcon),
		title: 'Conversational Efficiency',
		description: 'Turn your docs into interactive support chats that resolve issues fast, with email escalations for the rest.',
	},
	{
		icon: shallowRef(SparklesIcon),
		title: 'Accurate & Secure',
		description: 'PUses only your uploaded content - no external data or risks - ensuring GDPR compliance and brand consistency.',
	},
	{
		icon: shallowRef(ClockIcon),
		title: 'Hands-On Setup',
		description: "Our setup and consulting makes it effortless: we optimise everything so you're live and effective from day one, no tech expertise required.",
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
