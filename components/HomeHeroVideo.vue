<template>
	<iframe
		class="yt-embed"
		width="560"
		height="315"
		src="https://www.youtube.com/embed/pp3B2S-QI0k?si=KEaH0ChcghDZXFN0"
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
