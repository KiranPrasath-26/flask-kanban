<script>
import { useDataStore } from '@/stores/DataStore'

export default {
    setup() {
        const DataStore = useDataStore();
        return { DataStore }
    },
    data() {
        return {
            list_name: ''
        }
    },
    methods: {
        async addList() {
            if(!this.list_name){
                alert("Please enter a list name");
                return false;
            }
            await this.DataStore.addList(this.list_name);
            this.list_name = '';
        }
    }
}

</script>

<template>
  <div>
    <div class="md:grid md:gap-6">
      
      <div class="mt-5 md:mt-0">
          <div class="shadow sm:rounded-md sm:overflow-hidden">
            <div class="px-4 py-5 bg-white space-y-6 sm:p-6">
              <div>
                <label for="list-name" class="block text-sm font-medium text-gray-700"> List Name </label>
                <div class="mt-1">
                  <input v-model="list_name" id="list-name" name="list-name" rows="3" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3" placeholder="Reminders" />
                </div>
                <p class="mt-2 text-sm text-gray-500">The name of the List</p>
              </div>
              
            </div>
            <div class="px-4 py-3 bg-gray-50 sm:px-6">
              <button @click="addList()" class="btn btn-primary py-0">Add List</button>
            </div>
          </div>
      </div>
    </div>
  </div>

  </template>
