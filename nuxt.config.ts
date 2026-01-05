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
						'For Coaches, Consultants & Authors - Convert curiosity into clients - without typing a word.',
				},
				{
					property: 'og:title',
					content: 'ExpertEcho',
				},
				{
					property: 'og:description',
					content:
						'For Coaches, Consultants & Authors - Convert curiosity into clients - without typing a word.',
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
					content: 'https://expertecho.ai/expert-echo-preview.png',
				},
				{
					property: 'twitter:card',
					content: 'summary_large_image',
				},
				{
					property: 'twitter:title',
					content: 'ExpertEcho',
				},
				{
					property: 'twitter:description',
					content:
						'For Coaches, Consultants & Authors - Convert curiosity into clients - without typing a word.',
				},
				{
					property: 'twitter:image',
					content: 'https://expertecho.ai/expert-echo-preview.png',
				},
			],
			link: [{}],
			script: [
				{
					src: '/js/common.js',
					type: 'module',
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
