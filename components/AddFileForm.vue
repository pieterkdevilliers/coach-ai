<template>
	<div class="max-w-md mx-auto p-4">
		<h2 class="heading heading--h3 text-gradient">Add New Files</h2>
		<p id="file_input_help" class="text-base">
			Select one or more files to upload.
		</p>
		<UForm :state="state" @submit="handleAddFiles" class="modal__from">
			<UFormGroup label="Select Files" name="files" class="mt-3 mb-6">
				<!-- Standard HTML file input for multiple files -->
				<input
					type="file"
					multiple
					@change="handleFileSelection"
					ref="fileInputRef"
					accept=".pdf,.docx,.doc,.md,.txt,.xls,.xlsx"
					class="block w-full text-sm text-gray-900 cursor-pointer focus:outline-none"
					aria-describedby="file_input_help"
				/>
				<p class="mt-1 text-sm text-slate-700" id="file_input_help">
					<strong>File Types:</strong> .pdf, .docx, .doc, .md, .txt,
					.xls, .xlsx
				</p>
			</UFormGroup>

			<!-- Display selected file names (optional) -->
			<div v-if="state.selectedFiles.length > 0" class="mb-4">
				<p
					class="text-sm font-medium text-purple-800 font-roboto-condensed"
				>
					Selected files:
				</p>
				<ul class="list-disc list-inside text-sm text-slate-700">
					<li v-for="file in state.selectedFiles" :key="file.name">
						{{ file.name }}
					</li>
				</ul>
			</div>

			<UButton
				type="submit"
				icon="i-heroicons-document-plus"
				label="Upload Selected Files"
				:loading="isUploading"
				:disabled="state.selectedFiles.length === 0 || isUploading"
				block
				class="mt-6"
			/>
		</UForm>
		<p v-if="errorMessage" class="text-red-500 mt-4 text-center">
			{{ errorMessage }}
		</p>
		<p v-if="successMessage" class="text-green-500 mt-4 text-center">
			{{ successMessage }}
		</p>
	</div>
</template>

<script setup lang="ts">
const ALLOWED_EXTENSIONS = [
	'.pdf',
	'.docx',
	'.doc',
	'.md',
	'.txt',
	'.xls',
	'.xlsx',
];

const config = useRuntimeConfig();
import { ref, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
const toast = useToast();

const emit = defineEmits(['close', 'itemAdded']);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const fileInputRef = ref<HTMLInputElement | null>(null); // Ref for the file input element
const isUploading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

interface FormState {
	selectedFiles: File[];
}

const state = reactive<FormState>({
	selectedFiles: [],
});

// --- Get Folder ID from route ---
const paramName = 'id'; // Make sure this matches your route parameter for folder ID
let folder_id: string | string[] | undefined = route.params[paramName];
if (Array.isArray(folder_id)) {
	folder_id = folder_id[0]; // Take the first if it's an array
}
if (!folder_id) {
	errorMessage.value = 'Folder ID not found in URL.';
	console.error('Folder ID is missing from the route parameters.');
	// Potentially disable the form or redirect
}
// --- End Get Folder ID ---

const uniqueAccountId = authStore.uniqueAccountId;
const apiAuthorizationToken = authStore.access_token;

const handleFileSelection = (event: Event) => {
	const target = event.target as HTMLInputElement;
	if (!target.files) return;

	// Clear previous messages
	errorMessage.value = '';
	successMessage.value = '';

	const allSelectedFiles = Array.from(target.files);
	const validFiles: File[] = [];
	const invalidFiles: File[] = [];

	for (const file of allSelectedFiles) {
		const extension = file.name
			.slice(file.name.lastIndexOf('.'))
			.toLowerCase();
		if (ALLOWED_EXTENSIONS.includes(extension)) {
			validFiles.push(file);
		} else {
			invalidFiles.push(file);
		}
	}

	// Update the state with only the valid files
	state.selectedFiles = validFiles;

	// If there were any invalid files, show a specific error message
	if (invalidFiles.length > 0) {
		const invalidFileNames = invalidFiles
			.map((file) => file.name)
			.join(', ');
		errorMessage.value = `Unsupported file type(s) were ignored: ${invalidFileNames}.`;
		toast.add({
			title: 'Unsupported Files',
			description: `The following files were not added because their type is not supported: ${invalidFileNames}`,
			color: 'orange',
			icon: 'i-heroicons-exclamation-triangle',
		});
	}
};

const handleAddFiles = async () => {
	// Changed event type to any or FormSubmitEvent for UForm
	if (state.selectedFiles.length === 0) {
		errorMessage.value = 'Please select at least one file to upload.';
		return;
	}
	if (!folder_id) {
		errorMessage.value = 'Cannot upload: Folder ID is missing.';
		return;
	}

	isUploading.value = true;
	errorMessage.value = '';
	successMessage.value = '';

	const formData = new FormData();
	state.selectedFiles.forEach((file) => {
		// The key 'files' here MUST match the parameter name in your FastAPI endpoint (files: list[UploadFile] = File(...))
		formData.append('files', file);
	});

	try {
		// Use $fetch for Nuxt 3 for automatic JSON parsing and error handling
		const responseData = await $fetch<{
			response: string;
			uploaded_files: any[];
			new_docs_count: number;
		}>(`${config.public.apiBase}/files/${uniqueAccountId}/${folder_id}`, {
			method: 'POST',
			headers: {
				// 'Content-Type': 'multipart/form-data' is set automatically by the browser when using FormData
				// Do NOT set 'Content-Type': 'application/json' or 'application/x-www-form-urlencoded'
				accept: 'application/json',
				Authorization: `Bearer ${apiAuthorizationToken}`,
			},
			body: formData,
		});

		authStore.setDocsCount(responseData.new_docs_count);
		successMessage.value = `${responseData.uploaded_files.length} file(s) accepted for processing!`;

		// Clear selected files and reset file input
		state.selectedFiles = [];
		if (fileInputRef.value) {
			fileInputRef.value.value = ''; // Resets the file input
		}

		emit('itemAdded');
		// Wait a bit for the user to see the message, then emit close
		setTimeout(() => {
			emit('close'); // Tell the parent to close the modal
			successMessage.value = ''; // Clear the success message if it's inline
		}, 2000); // Adjust delay as needed (2 seconds)

		toast.add({
			title: 'Files Uploaded',
			description: successMessage.value,
			color: 'green',
		});
	} catch (error: any) {
		console.error('Error uploading files:', error);
		if (error.data && error.data.detail) {
			errorMessage.value = `Upload failed: ${error.data.detail}`;
		} else {
			errorMessage.value = 'Unable to upload files. Please try again.';
		}
	} finally {
		isUploading.value = false;
	}
};
</script>

<style scoped>
/* Add any additional Tailwind CSS or custom styles here if needed */
</style>
