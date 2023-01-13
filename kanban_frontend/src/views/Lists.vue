<script>
import { useAlertStore } from "@/stores/AlertStore";
import ListItem from "@/components/ListItem.vue";

export default {
    setup() {
        const AlertStore = useAlertStore();
        return { AlertStore };
    },
    computed: {
        decks() {
            return this.AlertStore.lists;
        }
    },
    components: { ListItem }
}
</script>

<template>
<div>
    <div v-if="lists.length === 0" class="flex flex-row align-middle justify-center">
        <div class="text-3xl">There are no Lists!</div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <ListItem v-for="list in lists" :list="list" />
    </div>
</div>
</template>