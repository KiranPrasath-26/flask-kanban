<script>
import { useDataStore } from '@/stores/DataStore';
import { useAlertStore } from '@/stores/AlertStore';
import carddash from '@/components/carddash.vue';
import listdash from '@/components/listdash.vue';
export default {
    setup() {
        const DataStore = useDataStore();
        return { DataStore };
    },
    computed: {
        lists() {
            return this.DataStore.lists;
        }
    },
    components: { listdash }
}
</script>


<template>
    <div>
        <div>
        <h1>Dashboard</h1>
        </div>
        <div v-if="lists.length === 0" class="flex flex-row align-middle justify-center">
            <div class="text-3xl">There are no Lists!</div>
        </div>
        <div class="grid grid-cols-4 gap-4 h-96">
            <listdash v-for="list in lists" :list="list" />
        </div>
    </div>
</template>