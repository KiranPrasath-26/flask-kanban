<script>
import { useDataStore } from '@/stores/DataStore'
export default {
    setup() {
        const DataStore = useDataStore();
        return { DataStore }
    },
    data() {
        return {
            title: '',
            content: '',
            deadline: '',
            errors: [],
        }
    },
    computed: {
        lists() {
            return this.DataStore.lists;
        },
        card() {
            console.log("card_id ", this.$route.params.cid);
            return this.DataStore.getCardByCardId(this.$route.params.cid)[0];
        } 
    },
    methods: {
        async updateCard() {
            if(!this.list_id){
                this.list_id = this.card.list_id
            }
            if(!this.title){
                this.title = this.card.title
            }
            if(!this.content){
                this.content = this.card.content
            }
            if(!this.deadline){
                this.deadline = this.card.deadline
            }
            console.log("deadline",this.deadline)
            console.log("conent",this.content)
            await this.DataStore.updateCard(this.card.card_id, this.list_id, this.title, this.content, this.deadline);
            this.title = ''
            this.content = ''
            this.deadline = ''
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
                <div class="col-span-6 sm:col-span-3">
                  <label for="list-name" class="block text-sm font-medium text-gray-700">List Name</label>
                  <select v-model="list_id" id="list-name" name="list-name" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option v-for="list in lists" :value="list.list_id">{{ list.list_name }}</option>
                  </select>
                </div>
              <div>
                <label for="title" class="block text-sm font-medium text-gray-700"> Title </label>
                <div class="mt-1">
                  <textarea v-model="title" id="title" name="title" rows="3" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3" placeholder="ML LAB" />
                </div>
              </div>
              <div>
                <label for="content" class="block text-sm font-medium text-gray-700"> Content </label>
                <div class="mt-1">
                  <textarea v-model="content" id="content" name="content" rows="3" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-3" placeholder="Complete Lab 4 Assignment" />
                </div>
              </div>
            <div> 
              <label for="deadline" class="block text-sm font-medium text-gray-700"> DeadLine </label>
                <input type="datetime-local" v-model="deadline" id="deadline" name="deadline"/>
                <!-- <date-pick v-model="date" :pickTime="true" :format="'DD/MM/YYYY, HH:mm:ss'"></date-pick> -->
            </div>
            </div>
            <div v-for="error in errors">{{ error }}</div>
            <div class="px-4 py-3 bg-gray-50 sm:px-6">
              <button @click="updateCard()" class="btn btn-primary py-0">Update Card</button>
            </div>
          </div>
      </div>
    </div>
  </div>

  </template>
