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
    },
    actions: {
        // pushJob(job_id,list_id,list_name){
        //     this.backend_jobs.unshift({
        //         job_id: job_id,
        //         list_id: list_id,
        //         list_name: list_name,
        //         status: 'pending',
        //         url: ''
        //     })
        // },
        // finishedJob(job_id,url){
        //     this.backend_jobs.forEach(job => {
        //         if(job.job_id == job_id){
        //             job.status = 'succeeded';
        //             job.url = url;
        //         }
        //     })
        // },
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
        


        async addCard(list_id, title, content, deadline=null){
            const AlertStore = useAlertStore();
            const AuthStore = useAuthStore();
            
            const data = {
                list_id : list_id,
                title : title,
                content : content,
                created_time : new Date().toLocaleString(),
                deadline : deadline,
                completed_on : null,
                flag : null
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

        async updateCard(card_id, list_id, title, content, deadline=null, completed_on=null, flag=0){
            const AlertStore = useAlertStore();
            const AuthStore = useAuthStore();
            
            const data = {
                list_id : list_id,
                title : title,
                content : content,
                created_time : new Date().toLocaleString(),
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

                // async doReview(list_id,result){
        //     try {
        //         const AlertStore = useAlertStore();
        //         const AuthStore = useAuthStore();

        //         console.log("Inside do review");
        //         console.log(result);

        //         await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/deck/update_lrt/${deck_id}`, {
        //             "method": "PUT",
        //             "headers": {
        //                 "Authentication-Token": AuthStore.authenticationToken,
        //                 "Content-Type": "application/json"
        //             },
        //             "body": JSON.stringify({"last_review_time":new Date().toLocaleString()})
        //             })
        //         console.log('update_lrt')
        //         let total_points = 0;
        //         for(const card of result){
        //             await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/card/update_difficulty/${card.card_id}`, {
        //                 "method": "PUT",
        //                 "headers": {
        //                     "Authentication-Token": AuthStore.authenticationToken,
        //                     "Content-Type": "application/json"
        //                 },
        //                 "body": JSON.stringify({"difficulty":card.difficulty})
        //                 })   
        //             total_points += parseInt(card.score);
        //         }
        //         let total_score = Math.floor((total_points/(3*result.length))*100);
        //         console.log("Total Score " + total_score);
        //         console.log('update_difficulty')
        //         await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/deck/update_ts/${deck_id}`, {
        //             "method": "PUT",
        //             "headers": {
        //                 "Authentication-Token": AuthStore.authenticationToken,
        //                 "Content-Type": "application/json"
        //             },
        //             "body": JSON.stringify({"total_score":total_score})
        //             })
        //         console.log('update_ts')
        //         this.fetchData(false);
        //         AlertStore.pushAlert({
        //             type: 'success',
        //             message: `Review done for deck ${deck_id}`
        //         });
        //     }
        //     catch(err){
        //         console.log(err)
        //         AlertStore.pushAlert({
        //             type: 'error',
        //             message: `Couldn't do the review for ${deck_id}`
        //         })
        //     }
        // },
        
        // async updateWebhookUrl(webhook_url){
        //     const AlertStore = useAlertStore();
        //     const AuthStore = useAuthStore();

        //     const data = {
        //         webhook_url: webhook_url,
        //     }

        //     await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update_webhook_url/${AuthStore.userId}`, {
        //         "method": "PUT",
        //         "headers": {
        //             "Authentication-Token": AuthStore.authenticationToken,
        //             "Content-Type": "application/json"
        //         },
        //         "body": JSON.stringify(data)
        //     })
        //     .then(resp => {
        //         if(parseInt(resp.status) >= 400){
        //             throw Error("Unable to update webhook url");
        //         }
        //         return resp.json();
        //     })
        //     .then(data => {
        //         this.user.webhook_url = webhook_url;
        //         AlertStore.pushAlert({
        //             type: 'info',
        //             message: 'Webhook URL Updated'
        //         })
        //     })
        //     .catch(err => {
        //         AlertStore.pushAlert({
        //             type: 'error',
        //             message: 'Unable to update webhook url'
        //         })
        //         console.log(err);
        //     })

        //     console.log(data);
        // },

        // async exportDeck(deck_id,deck_name){
        //     const AlertStore = useAlertStore();
        //     const AuthStore = useAuthStore();
        //     await fetch(`${import.meta.env.VITE_BACKEND_URL}/export_deck/${AuthStore.userId}/${deck_id}`, {
        //             "method": "GET",
        //             "headers": {
        //                 "Authentication-Token": AuthStore.authenticationToken,
        //                 "Content-Type": "application/json"
        //             }
        //             })
        //         .then(resp => {
        //             if(parseInt(resp.status) >= 400){
        //                 throw Error("Unable to export deck");
        //             }
        //             return resp.json();
        //         })
        //         .then(data => {
        //             console.log(data);
        //             this.pushJob(data.job_id,deck_id,deck_name);
        //             AlertStore.pushAlert({
        //                 type: 'warning',
        //                 message: `Export deck ${deck_id} job sent to backend`
        //             })
        //         })
        //         .catch(err => {
        //             AlertStore.pushAlert({
        //                 type: 'error',
        //                 message: 'Unable to export deck'
        //             })
        //         console.log(err);
        //         });
        // }
    }
})