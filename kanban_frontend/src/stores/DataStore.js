import { defineStore } from 'pinia'
import { useAlertStore } from '@/stores/AlertStore'
import { useAuthStore } from '@/stores/AuthStore'

export const useDataStore = defineStore("DataStore", {
    state: () => {
        return {
            user: {},
            lists: [],
            cards: [],
            dataFetched: true,
            fetchingData: false,
            backend_jobs: []
        }
    },
    getters: {
        getCardsByListId: (state) => {
            return (list_id) => state.cards.filter(card => card.list_id == list_id)
        },
        getCardByCardId: (state) => {
            return (card_id) => state.cards.filter(card => (card.card_id == card_id))
        },
        getListByListId: (state) => {
            return (list_id) => state.lists.filter(list => list.list_id == list_id)
        },
    },
    actions: {
        pushListJob(job_id,list_id,list_name){
            this.backend_jobs.unshift({
                job_id: job_id,
                list_id: list_id,
                list_name: list_name,
                status: 'pending',
                url: ''
            })
        },
        pushCardJob(job_id,card_id,title,content,deadline,completed_on,flag){
            this.backend_jobs.unshift({
                job_id: job_id,
                card_id: card_id,
                title: title,
                content: content,
                deadline: deadline,
                completed_on: completed_on,
                flag: flag,
                status: 'pending',
                url: ''
            })
        },
        finishedJob(job_id,url){
            this.backend_jobs.forEach(job => {
                if(job.job_id == job_id){
                    job.status = 'succeeded';
                    job.url = url;
                }
            })
        },
        async fetchData(alert=true) {
            const AlertStore = useAlertStore();
            const AuthStore = useAuthStore();
            try {
                this.fetchingData = true;
                const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user_data/${AuthStore.userId}`, {
                                "method": "GET",
                                "headers": {
                                    "Authentication-Token": AuthStore.authenticationToken,
                                    "Content-Type": "application/json"
                                }
                                })
                    .then(resp => resp.json());
                console.log(data);
                this.user = data.user;
                this.lists = data.lists;
                this.cards = data.cards;
                this.fetchingData = false;
                if(alert){
                AlertStore.pushAlert({
                    type: 'success',
                    message: 'Successfully fetched the data from the API'
                });
                }
            }
            catch {
                this.dataFetched = false;
                this.fetchingData = false;
                AlertStore.pushAlert({
                    type: 'error',
                    message: 'Unable to fetch data from the API'
                });
            }
        },
        


        async addCard(list_id, title, content, deadline){
            const AlertStore = useAlertStore();
            const AuthStore = useAuthStore();
            
            const data = {
                list_id : list_id,
                title : title,
                content : content,
                created_time : new Date().toLocaleString(),
                deadline : deadline,
                completed_on : null,
                flag : 0
            }

            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/card`, {
                "method": "POST",
                "headers": {
                    "Authentication-Token": AuthStore.authenticationToken,
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(data)
            })
            .then(resp => {
                if(parseInt(resp.status) >= 400){
                    throw Error("Unable to add card");
                }
                return resp.json();
            })
            .then(data => {
                this.cards.push(data);
                AlertStore.pushAlert({
                    type: 'info',
                    message: 'New card added'
                })
            })
            .catch(err => {
                AlertStore.pushAlert({
                    type: 'error',
                    message: 'Unable to add card'
                })
                console.log(err);
            }) 
        },

        async updateCard(card_id, list_id, title, content, deadline, completed_on, flag){
            const AlertStore = useAlertStore();
            const AuthStore = useAuthStore();

            const data = {
                list_id: list_id,
                title : title,
                content : content,
                deadline : deadline,
                completed_on : completed_on,
                flag : flag
            }

            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/card/${card_id}`, {
                "method": "PUT",
                "headers": {
                    "Authentication-Token": AuthStore.authenticationToken,
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(data)
            })
            .then(resp => {
                if(parseInt(resp.status) >= 400){
                    throw Error("Unable to add card");
                }
                return resp.json();
            })
            .then(data => {
                for(let i=0; i<this.cards.length; i++){
                    if(this.cards[i].card_id == card_id){
                        this.cards.splice(i,1);
                        i--;
                    }
                }
                this.cards.push(data);
                AlertStore.pushAlert({
                    type: 'info',
                    message: `Deleted the card with card_id ${card_id}`
                })
            })
            .catch(err => {
                AlertStore.pushAlert({
                    type: 'error',
                    message: 'Unable to add card'
                })
                console.log(err);
            }) 
        },

        async addList(list_name){
            const AlertStore = useAlertStore();
            const AuthStore = useAuthStore();

            const data = {
                user_id : this.user.id,
                list_name : list_name,
                list_date : new Date().toLocaleString(),
                score : 0
            }

            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/list`, {
                "method": "POST",
                "headers": {
                    "Authentication-Token": AuthStore.authenticationToken,
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(data)
            })
            .then(resp => {
                if(parseInt(resp.status) >= 400){
                    throw Error("Unable to add list");
                }
                return resp.json();
            })
            .then(data => {
                this.lists.push(data);
                AlertStore.pushAlert({
                    type: 'info',
                    message: 'New list added'
                })
            })
            .catch(err => {
                AlertStore.pushAlert({
                    type: 'error',
                    message: 'Unable to add list'
                })
                console.log(err);
            })

            console.log(data);
        },

        async updateList(list_id,list_name){
            const AlertStore = useAlertStore();
            const AuthStore = useAuthStore();

            const data = {
                user_id : this.user.id,
                list_name : list_name,
            }

            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/list/${list_id}`, {
                "method": "PUT",
                "headers": {
                    "Authentication-Token": AuthStore.authenticationToken,
                    "Content-Type": "application/json"
                },
                "body": JSON.stringify(data)
            })
            .then(resp => {
                if(parseInt(resp.status) >= 400){
                    throw Error("Unable to add list");
                }
                return resp.json();
            })
            .then(data => {
                for(let i=0; i<this.lists.length; i++){
                    if(this.lists[i].list_id == list_id){
                        this.lists.splice(i,1);
                        i--;
                    }
                }
                this.lists.push(data);
                AlertStore.pushAlert({
                    type: 'info',
                    message: 'New list added'
                })
            })
            .catch(err => {
                AlertStore.pushAlert({
                    type: 'error',
                    message: 'Unable to add list'
                })
                console.log(err);
            })

            console.log(data);
        },

        async deleteCard(card_id){
            const AlertStore = useAlertStore();
            const AuthStore = useAuthStore();
        
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/card/${card_id}`, {
                    "method": "DELETE",
                    "headers": {
                        "Authentication-Token": AuthStore.authenticationToken,
                        "Content-Type": "application/json"
                    }
                    })
                .then(resp => {
                    if(parseInt(resp.status) >= 400){
                        throw Error("Unable to delete card");
                    }
                    return resp.json();
                })
                .then(data => {
                    for(let i=0; i<this.cards.length; i++){
                        if(this.cards[i].card_id == card_id){
                            this.cards.splice(i,1);
                            i--;
                        }
                    }
                    AlertStore.pushAlert({
                        type: 'info',
                        message: `Deleted the card with card_id ${card_id}`
                    })
                })
                .catch(err => {
                    AlertStore.pushAlert({
                        type: 'error',
                        message: 'Unable to delete card'
                    })
                console.error(err);
                });
        },
        async deleteList(list_id){
            const AlertStore = useAlertStore();
            const AuthStore = useAuthStore();
        
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/list/${list_id}`, {
                    "method": "DELETE",
                    "headers": {
                        "Authentication-Token": AuthStore.authenticationToken,
                        "Content-Type": "application/json"
                    }
                    })
                .then(resp => {
                    if(parseInt(resp.status) >= 400){
                        throw Error("Unable to delete list");
                    }
                    return resp.json();
                })
                .then(data => {
                    for(let i=0; i<this.lists.length; i++){
                        if(this.lists[i].list_id == list_id){
                            this.lists.splice(i,1);
                            i--;
                        }
                    }
                    for(let i=0; i<this.cards.length; i++){
                        if(this.cards[i].list_id == list_id){
                            this.cards.splice(i,1);
                            i--;
                        }
                    }
                    AlertStore.pushAlert({
                        type: 'info',
                        message: `Deleted the deck with deck_id ${list_id}`
                    })
                })
                .catch(err => {
                    AlertStore.pushAlert({
                        type: 'error',
                        message: 'Unable to delete deck'
                    })
                console.error(err);
                });
        },

        async exportList(list_id,list_name){
            const AlertStore = useAlertStore();
            const AuthStore = useAuthStore();
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/export_list/${AuthStore.userId}/${list_id}}`, {
                    "method": "GET",
                    "headers": {
                        "Authentication-Token": AuthStore.authenticationToken,
                        "Content-Type": "application/json"
                    }
                    })
                .then(resp => {
                    if(parseInt(resp.status) >= 400){
                        throw Error("Unable to export list");
                    }
                    return resp.json();
                })
                .then(data => {
                    console.log(data);
                    this.pushListJob(data.job_id,list_id,list_name);
                    AlertStore.pushAlert({
                        type: 'warning',
                        message: `Export list ${list_id} job sent to backend`
                    })
                })
                .catch(err => {
                    AlertStore.pushAlert({
                        type: 'error',
                        message: 'Unable to export list'
                    })
                console.log(err);
                });
        },

        async exportCard(card_id,title,content,deadline,completed_on,flag){
            const AlertStore = useAlertStore();
            const AuthStore = useAuthStore();
            await fetch(`${import.meta.env.VITE_BACKEND_URL}/export_card/${AuthStore.userId}/${card_id}}`, {
                    "method": "GET",
                    "headers": {
                        "Authentication-Token": AuthStore.authenticationToken,
                        "Content-Type": "application/json"
                    }
                    })
                .then(resp => {
                    if(parseInt(resp.status) >= 400){
                        throw Error("Unable to export list");
                    }
                    return resp.json();
                })
                .then(data => {
                    console.log(data);
                    this.pushCardJob(data.job_id,card_id,title,content,deadline,completed_on,flag);
                    AlertStore.pushAlert({
                        type: 'warning',
                        message: `Export Card ${card_id} job sent to backend`
                    })
                })
                .catch(err => {
                    AlertStore.pushAlert({
                        type: 'error',
                        message: 'Unable to export list'
                    })
                console.log(err);
                });
        }
    }
})