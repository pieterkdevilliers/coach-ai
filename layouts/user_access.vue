<template>
	<div class="layout layout--user_access">
		<header class="main-header">
			<div
				class="container mx-auto px-4 py-2 flex justify-between items-center"
			>
				<ClientOnly>
					<h1
						class="font-normal text-xl text-slate-50 font-roboto-condensed"
					>
						<span v-if="account_organisation">
							{{ account_organisation }}
						</span>
						<div v-else class="logo">
							<img src="../assets/images/logo-w100.png" alt="" />
							<span><strong>Expert</strong>Echo</span>
						</div>
					</h1>
					<template #fallback>
						<!-- Optional: A placeholder that shows while waiting for client render -->
						<h1 class="font-bold text-xl text-primary">
							<span>ExpertEcho</span>
						</h1>
					</template>
				</ClientOnly>
				<Navbar />
			</div>
		</header>
		<div class="container mx-auto p-4">
			<slot />
			<div
				v-if="isDashboardPage"
				class="container container--default word-cloud__section"
			>
				<LazyWordCloud />
			</div>
			<div class="container container--default mt-6">
				<Queries />
			</div>
		</div>
		<Footer />

		<!-- Add UNotifications here -->
		<UNotifications />
	</div>
</template>

<script setup lang="ts">
import { driver, type DriveStep, type PopoverDOM } from 'driver.js';
import 'driver.js/dist/driver.css';
import { ref, computed, watchEffect, onMounted } from 'vue';
import Queries from '~/components/Queries.vue';
import { useAuthStore } from '~/stores/auth';
import { useHead, useRoute } from '#imports';
import Navbar from '~/components/Navbar.vue';
import Footer from '~/components/Footer.vue';

type TourStep = DriveStep & {
	customWidth?: string;
};

const config = useRuntimeConfig();
const authStore = useAuthStore();

// Make `account_unique_id` reactive by deriving it from the store
const account_unique_id = computed(() => authStore.uniqueAccountId || null);
const account_organisation = ref('');
const showTour = computed(() => authStore.docs_count === 0);
const route = useRoute();

const isDashboardPage = computed(() => {
	return route.path === '/dashboards' || route.path === '/dashboards/';
});
console.log(`Is Dashboard Page: ${isDashboardPage.value}`);

// Watch for changes in `account_unique_id` and fetch details
watchEffect(async () => {
	if (account_unique_id.value) {
		try {
			const apiAuthorizationToken = authStore.access_token;
			const { data: account, error } = await useFetch(
				`${config.public.apiBase}/accounts/${account_unique_id.value}`,
				{
					method: 'GET',
					headers: {
						accept: 'application/json',
						Authorization: `Bearer ${apiAuthorizationToken}`,
					},
				}
			);
			if (account.value?.account) {
				account_organisation.value =
					account.value.account.account_organisation;
			} else {
				console.error('Failed to fetch account details:', error.value);
			}
		} catch (error) {
			console.error('Error fetching account details:', error);
		}
	} else {
		account_organisation.value = '';
	}
});

// This will be used to determine if the tour should be shown
onMounted(() => {
	setTimeout(() => {
		// const showTour = ref(true);
		if (showTour.value) {
			const tourSteps: TourStep[] = [
				{
					element: '#nav-link-chats',
					popover: {
						title: 'Chats',
						description:
							'View chat history including questions and answers.',
					},
				},
				{
					element: '#nav-link-users',
					popover: {
						title: 'Users',
						description: 'Add or remove users from your account.',
					},
				},
				{
					element: '#nav-link-documents',
					popover: {
						title: 'Documents',
						description:
							'Add folder and documents, and process the files into your AI Database when ready.',
					},
				},
				{
					element: '#nav-link-web-widgets',
					popover: {
						title: 'Web Widgets',
						description:
							'Generate your API Key and Web-Widget, to add to your website, for your visitors to use.',
					},
				},
				{
					element: '#nav-link-accounts',
					popover: {
						title: 'Your Account',
						description: 'View and manage your subscription.',
					},
				},
				{
					customWidth: '600px',
					popover: {
						title: 'Getting Started',
						description: `
							<div>
								<p>How to add your documents and run test queries</p>
								<iframe
									width="560"
									height="315"
									src="https://www.youtube.com/embed/StrHAhf3wIY?si=LSh5j122Vg4WNZKS"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen>
								</iframe>
							</div>
						`,
					},
				},
			];

			const driverObj = driver({
				popoverClass: 'tour-popover',
				showProgress: true,
				// --- THIS IS THE CORRECT IMPLEMENTATION ---
				onPopoverRender: (popover: PopoverDOM, { state }) => {
					// The correct property for the main popover element is `wrapper`
					const popoverWrapper = popover.wrapper;

					// A safety check is always a good idea
					if (!popoverWrapper) {
						return;
					}

					const activeStep = state.activeStep as DriveStep & {
						customWidth?: string;
					};
					const customWidth = activeStep?.customWidth;

					if (customWidth) {
						// Apply styles to the wrapper element
						popoverWrapper.style.width = customWidth;
						popoverWrapper.style.maxWidth = 'none';
					} else {
						// IMPORTANT: Reset styles for all other steps
						popoverWrapper.style.width = '';
						popoverWrapper.style.maxWidth = '';
					}
				},
				steps: tourSteps,
			});

			driverObj.drive();
		}
	}, 100);
});

// Add current page as a class to the body ta

// This computed property will generate a class name like:
// - /         -> 'page-home'
// - /about    -> 'page-about'
// - /user/id  -> 'page-user-id'
const bodyClass = computed(() => {
	if (route.path === '/') {
		return 'page-home';
	}
	// Takes the path, removes the leading '/', and replaces other '/' with '-'
	return `page-${route.path.slice(1).replace(/\//g, '-')}`;
});

useHead({
	bodyAttrs: {
		// Use the reactive computed property here
		class: bodyClass,
	},
});
</script>

<style scoped>
/* Apply styles when the link is active
  :deep(.router-link-exact-active) {
    @apply bg-white text-[#08bfb3] px-3 py-2 rounded-md text-sm;
  } */
</style>
