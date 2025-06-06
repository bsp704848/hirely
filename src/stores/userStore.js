import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: [],
  }),
  actions: {
    saveUser(data) {
      this.userData = data
    },
  },
})
