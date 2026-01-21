<template>
	<iframe
		class="yt-embed"
		width="560"
		height="315"
		src="https://d31env5c5sjhq3.cloudfront.net/static/welcome_to_expertecho.mp4"
		title="YouTube video player"
		frameborder="0"
		allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
		referrerpolicy="strict-origin-when-cross-origin"
		allowfullscreen
	></iframe>
</template>

<style scoped>
/* Optional: make it responsive */
:global(.yt-embed) {
	aspect-ratio: 16 / 9;
	width: 100%;
	background: #000;
	border-radius: 0.5em;
}
</style>

