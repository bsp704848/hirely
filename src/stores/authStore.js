import axios from 'axios'
import { defineStore } from 'pinia'
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    role: localStorage.getItem('userRole') || '',
  }),
  
  getters: {
    username: (state) => state.user?.username || '', 
    isLoggedIn: (state) => !!state.user
  },
  actions: {
    async register(userData) {
      const res = await axios.post(`${baseURL}/auth/register`, userData)
      this.user = res.data.user
      this.role = res.data.user.role
      localStorage.setItem('userRole', this.role)
    },
    async login(userData) {
      try {
        const res = await axios.post(`${baseURL}/auth/login`, userData)
        this.user = res.data.user
        this.role = res.data.user.role
    
        localStorage.setItem('user', JSON.stringify(this.user))
        localStorage.setItem('userRole', this.role)
      } catch (error) {
        throw error
      }
    },

    logout() {
      this.user = null
      this.role = ''
      localStorage.removeItem('user')
      localStorage.removeItem('userRole')
    }
    
  }
})
