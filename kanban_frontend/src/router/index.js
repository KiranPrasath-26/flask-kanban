import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Template from '@/views/Template.vue'
import AddList from '@/views/AddList.vue';
import AddCard from '@/views/AddCard.vue';
import InfoUser from '@/views/InfoUser.vue';
import Lists from '@/views/Lists.vue'
import Cards from '@/views/Cards.vue'
import { useAuthStore } from '@/stores/AuthStore';
import UpdateCard from '@/views/UpdateCard.vue';

const routes = [
    { path: "/", redirect: '/login'},
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    {
        path: '/',
        name: 'Template',
        component: Template,
        meta: { requiresAuth: true },
        children: [
            { path: 'Dashboard', name: 'Dashboard', component: Dashboard },
            { path: 'lists', name: 'Lists', component: Lists },
            { path: 'lists/:id', name: 'List Cards', component: Cards },
            { path: '/card/:cid', name: 'Update Card', component: UpdateCard },
            // { path: 'review/:id', name: 'Deck Review', component: DeckReview},
            { path: 'infouser', name: 'InfoUser', component: InfoUser },
            { path: 'add-list', name: 'Add List', component: AddList },
            { path: 'add-card', name: 'Add Card', component: AddCard },
            // { path: 'export', name: 'Export Deck', component: ExportDeck },
            // { path: 'update_webhook', name: 'Update Webhook', component: UpdateWebhook }
        ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach( (to, from) => {
    const AuthStore = useAuthStore();
    if (to.meta.requiresAuth && !AuthStore.isAuthenticated) {
        return {
            path: '/login',
        }
    }
    else if((to.name == 'Login' || to.name == 'Register') && AuthStore.isAuthenticated){
        console.log("Already Authenticated");
        return {
            path: '/dashboard'
        }
    }
    else if(to.name == 'List Review' && from.name != 'Lists' && from.name != 'List Review'){
        return {
            path: '/dashboard'
        }
    }

    return true;
})

export default router;