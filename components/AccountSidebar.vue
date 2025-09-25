<template>
	<aside class="account__sidebar">
		<UVerticalNavigation :links="sideBarItems" />
	</aside>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
	activeSection: {
		type: String,
		required: true,
	},
	isAccountOwner: {
		type: Boolean,
		required: true,
	},
});

const emit = defineEmits(['section-changed']);

const sideBarItems = computed(() => {
	const links = [
		{
			label: 'Prompts',
			icon: 'i-heroicons:sparkles',
			to: '#prompts',
			click: () => emit('section-changed', 'prompts'),
			active: props.activeSection === 'prompts',
		},
		{
			label: 'Webhooks',
			icon: 'i-heroicons:code-bracket',
			to: '#webhooks',
			click: () => emit('section-changed', 'webhooks'),
			active: props.activeSection === 'webhooks',
		},
		{
			label: 'Products',
			icon: 'i-heroicons:cube',
			to: '#products',
			click: () => emit('section-changed', 'products'),
			active: props.activeSection === 'products',
		},
		{
			label: 'Subscriptions',
			icon: 'i-heroicons:credit-card',
			to: '#subscriptions',
			click: () => emit('section-changed', 'subscriptions'),
			active: props.activeSection === 'subscriptions',
		},
	];

	if (props.isAccountOwner) {
		links.push({
			label: 'Account Settings',
			icon: 'i-heroicons:cog-6-tooth',
			to: '#account',
			click: () => emit('section-changed', 'account'),
			active: props.activeSection === 'account',
		});
	}
	return links;
});
</script>
