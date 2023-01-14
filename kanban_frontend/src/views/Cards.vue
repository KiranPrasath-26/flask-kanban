<script>
import { useDataStore } from "@/stores/DataStore";
import CardItem from '@/components/CardItem.vue';

export default {
    setup() {
        const DataStore = useDataStore();
        return { DataStore };
    },
    computed: {
        cards() {
            console.log("list_id", this.$route.params.id);
            return this.DataStore.getCardsByListId(this.$route.params.id);
        }
    },
    components: { CardItem }
}
</script>

<template>
<div>
    <div v-if="cards.length === 0" class="flex flex-row align-middle justify-center">
        <div class="text-3xl">There are no cards!</div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <CardItem v-for="card in cards" :card="card" :list_id="this.$route.params.id"/>
    </div>
</div>
</template>