<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import logo from '../assets/logo1.png'
import { defineProps, ref, onMounted, onBeforeUnmount,computed } from 'vue'
import { useAuthStore } from '../stores/authStore'



const isEmployer = computed(() => authStore.role === 'employer')


const showDropdown = ref(false)

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const logout = () => {
    authStore.logout()
    router.push('/')
}

const isMenuOpen = ref(false) 

function toggleDropdown() {
    showDropdown.value = !showDropdown.value
} 

function handleClickOutside(event) {
    if (!event.target.closest('.relative')) {
        showDropdown.value = false
    }
} 

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
}) 

const isActive = (path) => {
  return route.path === path
}

</script>

<template>
    <nav class="bg-white py-4 px-6 text-gray-800">
        <div class="max-w-7xl mx-auto flex items-center justify-between">


            <RouterLink to="/" class="flex items-center space-x-2">
                <img :src="logo" alt="Logo" width="100px" class="object-contain" />
            </RouterLink>


            <button @click="isMenuOpen = !isMenuOpen" class="md:hidden text-3xl">
                <span v-if="!isMenuOpen"><font-awesome-icon icon="bars" /></span>
                <span v-else><font-awesome-icon icon="xmark" class="text-2xl" /></span>
            </button>


            <div class="hidden md:flex items-center gap-8">
                <div class="space-x-6 text-base font-medium">
                    <RouterLink :to="isEmployer ? '/employer' : '/'" :class="[
                        'p-2 rounded transition-colors',
                        isActive(isEmployer ? '/employer' : '/') ? 'bg-green-300 text-green-800 font-semibold' : 'hover:text-green-800 hover:bg-green-300'
                    ]">
                        Home
                    </RouterLink>
                    <RouterLink to="/jobs" :class="[
                        'p-2 rounded transition-colors',
                        isActive('/jobs') ? 'bg-green-300 text-green-800 font-semibold' : 'hover:text-green-800 hover:bg-green-300'
                    ]">Jobs</RouterLink>

                    <RouterLink v-if="authStore.role === 'employer'" to="/addjob"
                        :class="['p-2 rounded transition-colors', isActive('/addjob') ? 'bg-green-300 text-green-800 font-semibold'  : 'hover:text-green-800 hover:bg-green-300' ]">
                        Post Job
                    </RouterLink>
                </div>

                <div class="flex gap-4 items-center">
                    <template v-if="authStore.isLoggedIn">
                        <div class="relative">

                            <span @click="toggleDropdown"
                                class="p-2 cursor-pointer text-gray-700 font-semibold hover:text-green-800 hover:bg-green-300 rounded">
                                Hello, {{ authStore.username }}
                            </span>
                            <div v-if="showDropdown"
                                class="absolute mt-2 bg-white border rounded shadow p-2 text-sm z-50 w-40">
                                <p class="text-gray-600">Role : <span class="font-medium text-green-500 capitalize">{{
                                        authStore.role }}</span></p>
                                <button @click="logout" class="text-red-600 hover:underline">Logout</button>
                            </div>
                        </div>
                        <RouterLink to="/about" :class="[
                            'p-2 rounded transition-colors font-semibold',
                            isActive('/about') ? 'bg-green-300 text-green-800 font-bold' : 'hover:text-green-800 hover:bg-green-300'
                        ]">About
                        </RouterLink>
                    </template>
                    <template v-else>
                        <RouterLink to="/login" class="text-green-600 hover:underline">Login</RouterLink>
                        <RouterLink to="/register" class="text-green-600 hover:underline">Register</RouterLink>
                    </template>
                </div>
            </div>
        </div>


        <div v-if="isMenuOpen" class="md:hidden mt-4 px-4 space-y-4 text-base font-medium">
            <RouterLink to="/" class="block p-2 rounded hover:bg-green-100" @click="isMenuOpen = false">Home
            </RouterLink>
            <RouterLink to="/jobs" class="block p-2 rounded hover:bg-green-100" @click="isMenuOpen = false">Jobs
            </RouterLink>
            <RouterLink to="/about" class="block p-2 rounded hover:bg-green-100" @click="isMenuOpen = false">About
            </RouterLink>

            <RouterLink v-if="authStore.role === 'employer'" to="/addjob" class="block p-2 rounded hover:bg-green-100"
                @click="isMenuOpen = false">Post Job</RouterLink>

            <template v-if="authStore.isLoggedIn">
                <div class="p-2 font-semibold text-gray-700">Hello, {{ authStore.username }}</div>
                <button @click="logout" class="text-red-600 hover:underline">Logout</button>
            </template>
            <template v-else>
                <RouterLink to="/login" class="block text-green-600 hover:underline" @click="isMenuOpen = false">Login
                </RouterLink>
                <RouterLink to="/register" class="block text-green-600 hover:underline" @click="isMenuOpen = false">
                    Register</RouterLink>
            </template>
        </div>
    </nav>
</template>
