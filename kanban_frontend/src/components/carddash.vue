<script>
import { useDataStore } from '@/stores/DataStore';

export default {
    setup() {
      const DataStore = useDataStore();
      return { DataStore }
    },
    data() {
      return {
        errors: []
      }
    },
    components: {

    },
    props: {
        card: {
            default: {}
        },
        list_id: ""
    },
    methods: {
      async toggleCheckbox(){
          if(this.card.flag == 1){
            this.card.flag = 0
          }
          else{
            this.card.flag = 1
          }
          if(this.card.flag == 1){
            this.card.completed_on = new Date().toLocaleString()
          }
          else{
            this.card.completed_on = null
          }
          console.log(this.card)
          await this.DataStore.updateCard(this.card.card_id, this.card.list_id, this.card.title, this.card.content, this.card.deadline, this.card.completed_on, this.card.flag);
        }
        
    }
}
</script>

<template>
<div class="card bg-base-100 cool-shadow shadow-lg">
  <div class="card-body p-5 flex flex-col">
    <div class="px-1 py-1 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">Title</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 break-all">{{ card.title }}</dd>
    </div>
    <div class="px-1 py-1 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">Content</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 break-all">{{ card.content }}</dd>
    </div>
    <div class="px-1 py-1 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">Created Time</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 break-all">{{ card.created_time }}</dd>
    </div>
    <div class="px-1 py-1 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">Deadline</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 break-all">{{ card.deadline }}</dd>
    </div>
    <div class="px-1 py-1 sm:grid sm:grid-cols-2 sm:gap-4 sm:px-6">
      <dt class="text-sm font-medium">Completed On</dt>
      <dd class="mt-1 text-sm sm:mt-0 sm:col-span-2 break-all">{{ card.completed_on }}</dd>
    </div>
    <div class="form-control justify-start">
             <label class="label cursor-pointer">
              <span class="label-text">Mark as Complete</span> 
              <input type="checkbox" @click="toggleCheckbox" v-model="card.flag"  class="toggle" />
             </label>
      </div>
    <div class="card-actions justify-start">
      <router-link :to="'/card/'+card.card_id" class="btn btn-xs btn-primary">Update</router-link>
      <button class="btn btn-xs btn-error" @click="DataStore.deleteCard(card.card_id)">Delete</button>   
      <button class="btn btn-xs btn-warning" @click="DataStore.exportCard(card.card_id,card.title,card.content,card.deadline,card.completed_on,card.flag)">Export</button>   
    </div>
    <div v-for="error of errors">{{ error }}</div>
  </div>
</div>
</template>