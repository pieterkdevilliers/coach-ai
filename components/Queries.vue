<template>
	<div class="query-form__container" v-if="authStore.processed_docs_count > 0">
		<div class="query-form__inner">
			<h2 class="heading heading--h2">
				Test your AI chat assistant
			</h2>
			
			<!-- Chat Messages Container -->
			<div class="chat-messages-container" ref="messagesContainer">
				<div
					v-for="(message, index) in chatMessages"
					:key="index"
					:class="['chat-message', message.type]"
				>
					<div v-if="message.type === 'bot' && message.text">
						<p v-for="(sentence, sentenceIndex) in splitIntoSentences(message.text)" 
						   :key="sentenceIndex" 
						   class="message-paragraph">
							{{ sentence }}
						</p>
					</div>
					<div v-else class="message-paragraph">
						{{ message.text }}
					</div>
					
					<!-- Sources display for bot messages -->
					<div v-if="message.type === 'bot' && message.sources && message.sources.length > 0" 
						 class="message-sources">
						<strong>Sources - For more information, click on the source links below:</strong>
						<ul>
							<li v-for="source in message.sources" :key="source.fileIdentifier">
								<UButton
									variant="link"
									:label="source.displayName"
									@click.prevent="prepareToOpenDocument(source.fileIdentifier)"
									class="source-link"
								/>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Chat Input Area -->
			<div class="chat-input-area">
				<UInput
					v-model="currentMessage"
					type="text"
					placeholder="Type your message..."
					autocomplete="off"
					class="chat-input"
					@keypress="handleKeyPress"
					:disabled="loading"
				/>
				<UButton
					@click="handleSendMessage"
					icon="i-heroicons:paper-airplane"
					label="Send"
					class="send-button"
					:disabled="loading || !currentMessage.trim()"
				/>
			</div>

			<!-- Loading/Error Messages -->
			<div v-if="errorMessage" class="error-message">
				{{ errorMessage }}
			</div>
		</div>

		<!-- Document Viewer Modal -->
		<DocumentViewerModal
			:is-open="isDocumentModalOpen"
			:file-identifier="selectedFileToView"
			:account-unique-id="account_unique_id"
			@close="closeDocumentModal"
			@update:is-open="isDocumentModalOpen = $event"
			:pdf-src="documentSrc"
			:pdf-url="documentUrl"
		/>
		<UNotifications />
	</div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
import { ref, computed, onMounted, nextTick } from 'vue';
import { useAuthStore } from '~/stores/auth';

interface ChatMessage {
	text: string;
	type: 'user' | 'bot' | 'loading' | 'error';
	sources?: ProcessedSource[];
}

interface ProcessedSource {
	displayName: string;
	fileIdentifier: string;
	viewUrl: string;
}

const authStore = useAuthStore();
const currentMessage = ref('');
const errorMessage = ref('');
const loading = ref(false);
const account_unique_id = authStore.uniqueAccountId;
const isDocumentModalOpen = ref(false);
const selectedFileToView = ref<string | null>(null);
const messagesContainer = ref<HTMLElement>();
const apiAuthorizationToken = authStore.access_token;
const uniqueAccountId = authStore.uniqueAccountId;

// Chat state
const chatMessages = ref<ChatMessage[]>([]);
const sessionId = ref<string>('');
const visitorUuid = ref<string>('');
const email = ref(''); // For the account owner testing

// Initialize session
onMounted(() => {
	sessionId.value = new Date().getTime().toString();
	visitorUuid.value = `test-visitor-${sessionId.value}`;
	email.value = 'test@example.com'; 
	
	// Add welcome message
	addMessage('Welcome! How can I help you today?', 'bot');
});

const addMessage = (text: string, type: 'user' | 'bot' | 'loading' | 'error', sources?: ProcessedSource[]) => {
	chatMessages.value.push({
		text,
		type,
		sources: sources || []
	});
	
	nextTick(() => {
		scrollToBottom();
	});
};

const scrollToBottom = () => {
	if (messagesContainer.value) {
		messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
	}
};

const splitIntoSentences = (text: string): string[] => {
	if (!text) return [];
	return text.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);
};

const processSourcesForDisplay = (rawSourcesArray: string[]): ProcessedSource[] => {
	if (!rawSourcesArray || !Array.isArray(rawSourcesArray)) {
		return [];
	}
	
	return rawSourcesArray.map((sourceString) => {
		let fileIdentifier = sourceString.split('/').pop() || sourceString;
		const originalFileIdentifier = fileIdentifier;
		const lastUnderscoreIndex = fileIdentifier.lastIndexOf('_');
		let displayNameWithoutId = fileIdentifier;
		
		if (lastUnderscoreIndex !== -1) {
			const partAfterUnderscore = fileIdentifier.substring(lastUnderscoreIndex + 1);
			if (/[a-f0-9]+\.(pdf|txt|docx|md)$/i.test(partAfterUnderscore)) {
				displayNameWithoutId = fileIdentifier.substring(0, lastUnderscoreIndex);
			}
		}
		
		displayNameWithoutId = displayNameWithoutId.replace(/\.(pdf|txt|docx|md)$/i, '');
		
		let cleanedName = displayNameWithoutId
			.replace(/_/g, ' ')
			.replace(/-/g, ' ');
		
		let displayName = cleanedName
			.trim()
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
		
		const viewUrl = `/files/view/${account_unique_id}/${encodeURIComponent(originalFileIdentifier)}`;
		
		return {
			displayName: displayName.trim() || originalFileIdentifier,
			fileIdentifier: originalFileIdentifier,
			viewUrl: viewUrl,
		};
	});
};

const handleKeyPress = (e: KeyboardEvent) => {
	if (e.key === 'Enter' && !e.shiftKey) {
		e.preventDefault();
		handleSendMessage();
	}
};

const handleSendMessage = async () => {
  const question = currentMessage.value.trim();
  if (!question || loading.value) return;

  // Add user message
  addMessage(question, 'user');
  currentMessage.value = '';
  loading.value = true;
  errorMessage.value = '';

  // Add loading message and store its index correctly
  addMessage('Thinking...', 'loading');
  const loadingMessageIndex = chatMessages.value.length - 1;

  try {
    // Send user message to internal API
    await fetch(`${config.public.apiBase}/internal/widget/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiAuthorizationToken}`,
      },
      body: JSON.stringify({
        message_text: question,
        sender_type: 'user',
        chat_session_id: sessionId.value, // send as string
        visitor_uuid: visitorUuid.value,
        email: email.value,
        sources: [],
      }),
    });

    // Get AI response from internal query endpoint
    const response = await fetch(`${config.public.apiBase}/internal/widget/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiAuthorizationToken}`,
      },
      body: JSON.stringify({
        query: question,
        chat_session_id: sessionId.value,
        visitor_uuid: visitorUuid.value,
        email: email.value,
      }),
    });

    // Remove loading message
    if (chatMessages.value[loadingMessageIndex]?.type === 'loading') {
      chatMessages.value.splice(loadingMessageIndex, 1);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: 'Server returned an unparsable error.',
      }));
      throw new Error(errorData.detail || `API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data?.response?.response_text) {
      // Process sources consistently
      const rawSources = data.response.sources || [];
      const displayableSources = processSourcesForDisplay(rawSources);

      // Add bot response
      addMessage(data.response.response_text, 'bot', displayableSources);

      // Send bot message to internal messages API
      await fetch(`${config.public.apiBase}/internal/widget/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiAuthorizationToken}`,
        },
        body: JSON.stringify({
          message_text: data.response.response_text,
          sender_type: 'bot',
          chat_session_id: sessionId.value,
          visitor_uuid: visitorUuid.value,
          sources: displayableSources.map(s => s.fileIdentifier),
        }),
      });
    } else {
      addMessage('Sorry, I received an unexpected response from the server.', 'error');
    }
  } catch (error: any) {
    console.error('Chat API Error:', error);
    addMessage(`Error: ${error.message}`, 'error');
    errorMessage.value = error.message;

    // Remove loading message if still present
    if (chatMessages.value[loadingMessageIndex]?.type === 'loading') {
      chatMessages.value.splice(loadingMessageIndex, 1);
    }
  } finally {
    loading.value = false;
    await nextTick();
    scrollToBottom();
  }
};


// Document modal methods
const prepareToOpenDocument = (fileIdentifierFromSource: string) => {
	console.log('Opening document modal for file:', fileIdentifierFromSource);
	selectedFileToView.value = fileIdentifierFromSource;
	isDocumentModalOpen.value = true;
};

const closeDocumentModal = () => {
	console.log('Closing document modal');
	isDocumentModalOpen.value = false;
	selectedFileToView.value = null;
};
</script>

<style scoped>
.chat-messages-container {
	height: 400px;
	overflow-y: auto;
	border: 1px solid #e5e7eb;
	border-radius: 8px;
	padding: 16px;
	margin: 16px 0;
	display: flex;
	flex-direction: column;
	gap: 12px;
	background-color: #fafafa;
}

.chat-message {
	padding: 12px 16px;
	border-radius: 18px;
	max-width: 80%;
	word-wrap: break-word;
	line-height: 1.4;
}

.chat-message.user {
	background-color: #db2777;
	color: white;
	align-self: flex-end;
	border-bottom-right-radius: 4px;
}

.chat-message.bot {
	background-color: #f0f0f0;
	color: #333;
	align-self: flex-start;
	border-bottom-left-radius: 4px;
}

.chat-message.error {
	background-color: #fee2e2;
	color: #dc2626;
	border: 1px solid #fca5a5;
	align-self: flex-start;
}

.chat-message.loading {
	background-color: #f0f0f0;
	color: #777;
	font-style: italic;
	align-self: flex-start;
}

.message-paragraph {
	margin: 0 0 8px 0;
}

.message-paragraph:last-child {
	margin-bottom: 0;
}

.message-sources {
	margin-top: 12px;
	font-size: 0.9em;
	color: #555;
}

.message-sources strong {
	display: block;
	margin-bottom: 6px;
}

.message-sources ul {
	list-style-type: disc;
	margin-left: 20px;
	padding-left: 0;
	margin-top: 4px;
	margin-bottom: 0;
}

.message-sources li {
	margin-bottom: 4px;
}

.source-link {
	color: #db2777 !important;
	text-decoration: underline;
	padding: 0 !important;
}

.chat-input-area {
	display: flex;
	gap: 12px;
	align-items: flex-end;
}

.chat-input {
	flex-grow: 1;
}

.send-button {
	flex-shrink: 0;
}

.error-message {
	color: #dc2626;
	background-color: #fee2e2;
	border: 1px solid #fca5a5;
	padding: 8px 12px;
	border-radius: 4px;
	margin-top: 8px;
}
</style>