<!-- This example requires Tailwind CSS v2.0+ -->
<script setup>
import { useDataStore } from '@/stores/DataStore';

const DataStore = useDataStore();

</script>

<template>
  <div class="bg-white shadow overflow-hidden sm:rounded-lg">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg leading-6 font-medium text-gray-900">User Information</h3>
      <p class="mt-1 max-w-2xl text-sm text-gray-500">details about the user</p>
    </div>
    <div class="border-t border-gray-200">
      <dl>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">User ID</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ DataStore.user.id }}</dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Username</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ DataStore.user.username }}</dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Email address</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ DataStore.user.email }}</dd>
        </div>
        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Number of Lists</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ DataStore.lists.length }}</dd>
        </div>
        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">Number of Cards</dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ DataStore.cards.length }}</dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>

export default {
}
</script>