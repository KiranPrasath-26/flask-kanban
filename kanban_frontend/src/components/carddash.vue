<script>
import { useDataStore } from '@/stores/DataStore';

export default {
    setup() {
      const DataStore = useDataStore();
      return { DataStore }
    },
    data() {
      return {
        errors: []
      }
    },
    props: {
        card: {
            default: {}
        },
    }
}
</script>

<template>

  
    <div class="px-1 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">Title</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 break-all">{{ card.title }}</dd>
    </div>
    <div class="px-1 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">Content</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 break-all">{{ card.content }}</dd>
    </div>
    <div class="px-1 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">Created Time</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 break-all">{{ card.created_time }}</dd>
    </div>
    <div class="px-1 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">Deadline</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 break-all">{{ card.deadline }}</dd>
    </div>
    <div class="px-1 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">Completed On</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 break-all">{{ card.completed_on }}</dd>
    </div>
    <div class="card-actions justify-start">
      <button class="btn btn-xs btn-error" @click="DataStore.deleteCard(card.card_id)">Delete</button>
    </div>
    <div class="card-actions justify-start">
      <router-link :to="'/card/'+card.card_id" class="btn btn-xs btn-primary">Update</router-link>
    </div>
    <div v-for="error of errors">{{ error }}</div>
</template>