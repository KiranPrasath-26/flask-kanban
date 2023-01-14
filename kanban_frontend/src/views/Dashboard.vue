<script>
import { useDataStore } from '@/stores/DataStore';
import { useAlertStore } from '@/stores/AlertStore';

</script>


<template>
    <div>
        <div>
        <h1>Dashboard</h1>
        </div>
        <div class="grid grid-cols-4 gap-4 h-96">
            <div class="flex bg-red-500  rounded-md shadow-lg">01</div>
            <div class="bg-red-500 rounded-md shadow-lg">02</div>
            <div class="bg-red-500 rounded-md shadow-lg">03</div>
            <div class="bg-red-500 rounded-md shadow-lg">04</div>
        </div>
    </div>
</template>