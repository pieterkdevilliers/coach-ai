// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2024-11-01',
	devtools: { enabled: true },
	modules: [
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt',
		'@nuxt/ui',
		'@nuxtjs/color-mode',
		'@nuxtjs/google-fonts',
		'@nuxtjs/tailwindcss',
	],
	colorMode: {
		preference: 'light', // default value of $colorMode.preference
	},
	googleFonts: {
		families: {
			Roboto: [300, 400, 500, 700, 900],
			'Roboto+Condensed': [300, 400, 500, 700],
		},
	},
	app: {
		head: {
			title: 'ExpertEcho',
			meta: [
				{
					name: 'description',
					content:
						'AI Chat Support for Small Businesses - Expertly Set Up and Optimized.',
				},
				{
					property: 'og:title',
					content: 'ExpertEcho',
				},
				{
					property: 'og:description',
					content:
						'AI Chat Support for Small Businesses - Expertly Set Up and Optimized.',
				},
				{
					property: 'og:type',
					content: 'website',
				},
				{
					property: 'og:url',
					content: 'https://expertecho.ai/',
				},
				{
					property: 'og:image',
					content:
						'https://expertecho.ai/expert-echo-preview.png?v=20260127',
				},
				{
					name: 'twitter:card',
					content: 'summary_large_image',
				},
				{
					name: 'twitter:title',
					content: 'ExpertEcho',
				},
				{
					name: 'twitter:description',
					content:
						'AI Chat Support for Small Businesses - Expertly Set Up and Optimized.',
				},
				{
					name: 'twitter:image',
					content:
						'https://expertecho.ai/expert-echo-preview.png?v=20260127',
				},
			],
			link: [{}],
			script: [
				{
					src: '/js/common.js',
					type: 'module',
					defer: true,
				},
				{
					src: 'https://checkanalytic.com/js/script.js',
					'data-host': 'https://checkanalytic.com',
					id: 'ZwSg9rf6GA',
					async: true,
					defer: true,
				},
			],
		},
	},
	runtimeConfig: {
		public: {
			apiBase:
				process.env.NUXT_PUBLIC_API_BASE_URL ||
				'https://fastapi-rag-2705cfd4c41a.herokuapp.com/api/v1',
		},
	},
	hooks: {
		'app:config': (appConfig) => {
			console.log('Loaded App Config:', appConfig);
		},
	},

	// --- ADD THIS BLOCK ---
	// This tells Vite to explicitly look for and correctly pre-bundle 'zod',
	// which is a dependency of @nuxt/ui and is causing the cache issue.
	vite: {
		optimizeDeps: {
			include: ['zod'],
		},
	},
	// ----------------------
});
