import { defineStore } from "pinia";

export const useAlertStore = defineStore("Alert", {
    state: () => {
        return {
            alerts: [],
            alertCount: 0,
        }
    },
    getters: {
        getAlerts: (state) => {
            return state.alerts.filter(alert => !alert.dismissed)
        }
    },
    actions: {
        pushAlert({ type, message }) {
            this.alerts.push({ id: this.alertCount, type: type, message: message, dismissed: false });
            this.alertCount++;
        },
        dismissAlert(id) {
            this.alerts.forEach(alert => {
                if (alert.id == id)
                    alert.dismissed = true;
            });
        },
    }
})