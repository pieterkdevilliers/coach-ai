<template>
  <aside class="account-sidebar">
    <nav>
      <ul>
        <li>
          <button 
            @click="$emit('section-changed', 'prompts')"
            :class="{ active: activeSection === 'prompts' }"
          >
            Account Prompts
          </button>
        </li>
        <li>
          <button 
            @click="$emit('section-changed', 'webhooks')"
            :class="{ active: activeSection === 'webhooks' }"
          >
            Integration Webhooks
          </button>
        </li>
        <li>
          <button 
            @click="$emit('section-changed', 'products')"
            :class="{ active: activeSection === 'products' }"
          >
            Products and CTAs
          </button>
        </li>
        <li>
          <button 
            @click="$emit('section-changed', 'subscriptions')"
            :class="{ active: activeSection === 'subscriptions' }"
          >
            My Subscriptions
          </button>
        </li>
        <li v-if="isAccountOwner">
          <button 
            @click="$emit('section-changed', 'account')"
            :class="{ active: activeSection === 'account' }"
          >
            Account Settings
          </button>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// Define props
defineProps<{
  activeSection: string;
  isAccountOwner: boolean;
}>();

// Define emits
defineEmits<{
  'section-changed': [section: string];
}>();
</script>