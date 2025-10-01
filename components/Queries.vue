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
				<!-- Bot message with Markdown -->
				<div v-if="message.type === 'bot' && message.text" class="message-paragraph" v-html="renderMarkdown(message.text)">
				</div>

				<!-- User message or other types -->
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

import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  linkify: true,
  breaks: true,
});

// Add default Tailwind classes to links
md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
  const aIndex = tokens[idx].attrIndex('class');

  const classes = 'text-blue-700 underline font-semibold hover:opacity-80';

  if (aIndex < 0) {
    tokens[idx].attrPush(['class', classes]);
  } else {
    tokens[idx].attrs![aIndex][1] += ' ' + classes;
  }

  // Open in new tab
  const targetIndex = tokens[idx].attrIndex('target');
  if (targetIndex < 0) {
    tokens[idx].attrPush(['target', '_blank']);
  } else {
    tokens[idx].attrs![targetIndex][1] = '_blank';
  }

  return self.renderToken(tokens, idx, options);
};


const renderMarkdown = (text: string) => {
  if (!text) return '';
  return md.render(text); // Converts Markdown/URLs into HTML
};

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
	addMessage('Welcome! You can run test queries here and see how you might want to improve your main prompt.', 'bot');
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

  // Add placeholder bot message
  addMessage('', 'bot');
  const botMessageIndex = chatMessages.value.length - 1;

  try {
    const response = await fetch(`${config.public.apiBase}/internal/widget/agent-query`, {
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

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('No readable stream available from server');

    let decoder = new TextDecoder();
    let botText = '';
    let tempSources: ProcessedSource[] = []; // store sources temporarily

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunkStr = decoder.decode(value, { stream: true });

      const lines = chunkStr.split('\n');
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const jsonStr = line.replace(/^data:\s*/, '');
        if (!jsonStr.trim()) continue;

        const eventData = JSON.parse(jsonStr);

        switch (eventData.type) {
          case 'chunk':
            for (const char of eventData.content) {
              botText += char;
              chatMessages.value[botMessageIndex].text = botText;
              await nextTick();
              scrollToBottom();
              await new Promise(resolve => setTimeout(resolve, 5));
            }
            break;

          case 'sources':
            // store temporarily, do NOT display yet
            tempSources = processSourcesForDisplay(eventData.content || []);
            break;

          case 'error':
            chatMessages.value[botMessageIndex].type = 'error';
            chatMessages.value[botMessageIndex].text = eventData.content;
            break;

          case 'done':
            // Assign sources **after typing finished**
            chatMessages.value[botMessageIndex].sources = tempSources;
            break;
        }
      }
    }
  } catch (error: any) {
    console.error('Chat API Error:', error);
    chatMessages.value[botMessageIndex].type = 'error';
    chatMessages.value[botMessageIndex].text = `Error: ${error.message}`;
    errorMessage.value = error.message;
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

.chat-message.bot a {
	color: #1d4ed8;          /* blue color for links */
	text-decoration: underline; /* always underlined */
	cursor: pointer;
}

.chat-message.bot a:hover {
	text-decoration: underline;
	opacity: 0.8;             /* optional hover effect */
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