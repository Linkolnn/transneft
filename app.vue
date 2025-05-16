<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

// Initialize auth store
const authStore = useAuthStore();

// Check for stored authentication on app load
onMounted(() => {
  authStore.initAuth();
});
</script>
