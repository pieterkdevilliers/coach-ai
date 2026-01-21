<template>
	<section class="access-page pt-24">
		<div class="container--default">
			<div class="container__inner">
				<div class="form-container">
					<LoginForm />
				</div>
			</div>
			<div class="container__inner">
				<h3 class="text-center text-white mt-12">
					Don't have an account yet?
				</h3>
				<div class="form-container signup">
					<SignupForm />
				</div>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth';
import SignupForm from '~/components/SignupForm.vue';
const authStore = useAuthStore();

authStore.clearUniqueAccountId();
authStore.clearAuthToken();
</script>

<style scoped>
.form-container.signup {
	@apply mt-3 p-0 shadow-lg;
}
</style>
