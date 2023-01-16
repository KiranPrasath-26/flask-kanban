<script>
import { useDataStore } from '@/stores/DataStore';
import ExportInfo from '@/components/ExportInfo.vue';

export default {
    components: {
        ExportInfo
    },
    setup(){
        const DataStore = useDataStore();
        return { DataStore };
    },
    computed: {
        pendingJobs() {
            return this.DataStore.backend_jobs.filter(job => job.status == 'pending');
        },
        succeededJobs() {
            return this.DataStore.backend_jobs.filter(job => job.status == 'succeeded');
        }
    }
}
</script>

<template>
    <div>
    <div class="flex flex-col gap-4">
        <div class="text-xl font-bold">Succeeded Jobs</div>
            <ExportInfo class="cool-shadow" v-for="job in succeededJobs" :job="job" />
    </div>
    <div class="flex flex-col gap-3">
        <div class="text-xl font-bold">Pending Jobs</div>
        <ExportInfo v-for="job in pendingJobs" :job="job" />
    </div>
    </div>
</template>