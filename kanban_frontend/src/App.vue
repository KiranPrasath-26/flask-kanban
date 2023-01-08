<script setup>
import { RouterView } from 'vue-router';
// import { useAlertStore } from '@/stores/AlertStore';
import { useAuthStore } from '@/stores/AuthStore';
import { onBeforeUnmount } from 'vue';

// const AlertStore = useAlertStore();
// AlertStore.getTheme();

const AuthStore = useAuthStore();
AuthStore.authFromSessionStorage();

onBeforeUnmount(() => {
  AuthStore.logout();
})

</script>

<template>
  <RouterView />
</template>