<template>
  <video
    class="yt-embed"
    controls
    playsinline
	controlsList="nodownload"      
    preload="metadata" 
    width="560"
    height="315"
  >
    <source
      src="https://d31env5c5sjhq3.cloudfront.net/static/welcome_to_expertecho.mp4"
      type="video/mp4"
    >
    Your browser does not support the video tag.
  </video>
</template>

<style scoped>
.yt-embed {
  aspect-ratio: 16 / 9;
  width: 100%;
  max-width: 560px;
  background: #000;
  border-radius: 0.5em;
}
</style>
