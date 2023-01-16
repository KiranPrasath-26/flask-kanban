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
    components: {
      carddash
    },
    computed: {
      Cards() {
        return this.DataStore.getCardsByListId(this.list.list_id);
      }
    }
}
</script>

<template>
<div class="card bg-base-100 cool-shadow shadow-lg">
  <div class="card-body p-5">
    <h2 class="card-title">{{ list.list_name }}</h2>
    <div class="card-actions justify-center grid grid-cols-2 grid-rows-2">
      <carddash v-for="card in Cards" :card="card"/>
      <button class="btn btn-xs btn-error" @click="DataStore.deleteList(list.list_id)">Delete</button>
    </div>
  </div>
</div>
</template>