import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue';
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Home from '@/views/Home.vue'
import { useAuthStore } from '@/stores/AuthStore';

const routes = [
    { path: "/", redirect: '/login'},
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register }
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
    else if(to.name == 'Deck Review' && from.name != 'Decks' && from.name != 'Deck Review'){
        return {
            path: '/dashboard'
        }
    }

    return true;
})

export default router;