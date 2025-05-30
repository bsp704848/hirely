import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    userData: JSON.parse(localStorage.getItem('userData')) || [],
  }),
  actions: {
    saveUser(data) {
      this.userData = data
      localStorage.setItem('userData', JSON.stringify(data))
    },
  },
})
