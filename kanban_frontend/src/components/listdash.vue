<script>
import { useDataStore } from '@/stores/DataStore';
import carddash from '@/components/carddash.vue';
export default {
    setup() {
      const DataStore = useDataStore();
      return { DataStore }
    },
    props: {
        list: {
            default: {}
        }
    },
    computed: {
      Cards() {
        return this.DataStore.getCardsByListId(this.list.list_id);
      }
    }
}
</script>

<template>
<div class="card bg-base-100 cool-shadow">
  <div class="card-body p-5">
    <h2 class="card-title">{{ list.list_name }}</h2>
    <!-- <div class="px-1 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">No. of Cards</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">{{ numberOfCards }}</dd>
    </div> -->
    <!-- <div class="px-1 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">Total Score</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2">{{ list.total_score }}</dd>
    </div> -->
    <div class="card-actions justify-center grid grid-cols-2 grid-rows-2">
      <!-- <router-link :to="'/lists/'+list.list_id" class="btn btn-xs btn-primary">Cards</router-link> -->
      <!-- <router-link :to="'/review/'+list.list_id" class="btn btn-xs btn-info">Review</router-link> -->
      <!-- <button class="btn btn-xs btn-warning" @click="DataStore.exportlist(list.list_id,list.list_name)">Export</button> -->
      <carddash v-for="card in cards" :card="card"/>
      <button class="btn btn-xs btn-error" @click="DataStore.deleteList(list.list_id)">Delete</button>
    </div>
  </div>
</div>
</template>