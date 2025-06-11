import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        userData: [],
    }),
    actions: {
        setToken(token) {
            this.token = token
            localStorage.setItem('token', token)
        },
        logout() {
            this.token = null
            localStorage.removeItem('token')
        },
        saveUser(data) {
            this.userData = data
        },
    }
})
