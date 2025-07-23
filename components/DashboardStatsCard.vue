<template>
	<UCard>
		<template #header>
			<h3 class="heading heading--h3 card__title">
				<slot name="title">{{ title }}</slot>
			</h3>
			<h3
				v-if="slots.subtitle || subtitle"
				class="heading heading--h3 card__subtitle"
			>
				<slot name="subtitle">{{ subtitle }}</slot>
			</h3>
		</template>

		<!-- Show a skeleton while the value is loading -->
		<div v-if="loading" class="flex justify-center py-4">
			<USkeleton class="h-24 w-24" :ui="{ rounded: 'rounded-full' }" />
		</div>

		<!-- Show the data once loaded -->
		<div v-else class="card__body">
			<div class="stat-count__container">
				<!-- Use a prop for the value -->
				<span class="stat-count__value">{{ value }}</span>
			</div>
		</div>
	</UCard>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';
const slots = useSlots();
defineProps({
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
		required: false,
	},
	value: {
		type: Number,
		required: true,
	},
	loading: {
		type: Boolean,
		default: false,
	},
});
</script>
