<script>
import AppAlert from '@/components/AppAlert.vue'
import { useAlertStore } from '@/stores/AlertStore'

export default {
    components: {
        AppAlert,
    },
    setup() {
        const AlertStore = useAlertStore();
        return { AlertStore }
    },
    computed: {
        undismissedAlerts() {
            return this.AlertStore.getAlerts;
        }
    }
}
</script>

<template>
    <div class="fixed bottom-6 left-0 z-30">
        <div class="flex flex-col-reverse w-screen gap-6">
            <TransitionGroup name="list">
                <AppAlert
                    v-for="alert in undismissedAlerts"
                    :id="alert.id"
                    :alert-type="alert.type"
                    :key="alert.id"
                    @dismiss-alert="(id) => AlertStore.dismissAlert(id)"
                >{{ alert.message }}</AppAlert>
            </TransitionGroup>
        </div>
    </div>
</template>


<style scoped>
.list-enter-active,
.list-leave-active {
    transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}
</style>