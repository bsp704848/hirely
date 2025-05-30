import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    users: JSON.parse(localStorage.getItem('users')) || [],
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
  }),

  actions: {
    register(newUser) {
      const exists = this.users.find(u => u.email === newUser.email)
      if (exists) throw new Error('User already registered')

      this.users.push(newUser)
      localStorage.setItem('users', JSON.stringify(this.users))
    },

    login({ email, password }) {
      const user = this.users.find(u => u.email === email && u.password === password)

      if (!user) throw new Error('Invalid email or password')

      this.currentUser = user
      localStorage.setItem('currentUser', JSON.stringify(user))
    },

    logout() {
      this.currentUser = null
      localStorage.removeItem('currentUser')
    },
  },

  getters: {
    isLoggedIn: (state) => !!state.currentUser,
    role: (state) => state.currentUser?.role || null,
    username: (state) => state.currentUser?.username || '',
  },
})
