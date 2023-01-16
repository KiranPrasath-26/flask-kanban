<script setup>
import { RouterView } from 'vue-router';
import { useDataStore } from '@/stores/DataStore';
import { useAlertStore } from '@/stores/AlertStore';
import { useAuthStore } from '@/stores/AuthStore';
import NavBar from '@/components/NavBar.vue'
import AppAlertList from '@/components/AppAlertList.vue'

const DataStore = useDataStore()
DataStore.fetchData();

const AlertStore = useAlertStore()


</script>

<template>
    <AppAlertList />
    <div
        id="drawer"
        class="drawer h-screen w-full rounded"
    >
        <!-- Page content here -->
        <div id="main">
            <div class="flex flex-col justify-start gap-10">
                <NavBar />
                <RouterView />
            </div>
        </div>
    </div>
</template>

<style>
#main {
    position: relative;
    padding: 20px;
}
</style>