<script setup>
import { RouterLink, useRouter, useRoute } from 'vue-router'
import logo from '../assets/logo1.png'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
console.log('Navbar authStore state:', authStore);
const isEmployer = computed(() => authStore.role === 'employer')
const showDropdown = ref(false)
const router = useRouter()
const route = useRoute()


const logout = () => {
    authStore.logout()
    router.push('/login')
}

function handleLogoClick() {
    const targetPath = isEmployer ? '/employer' : '/'
    if (route.path !== targetPath) {
        router.push(targetPath)
    }
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

onMounted(async () => {
    const hasToken = document.cookie.includes('token=');
    if (hasToken && !authStore.user) {
        try {
            await authStore.fetchUser(router);
        } catch (err) {
            console.error('Failed to fetch user on navbar mount:', err);
        }
    }
    document.addEventListener('click', handleClickOutside);
});

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

            <div @click="handleLogoClick" class="flex items-center space-x-2 cursor-pointer">
                <img :src="logo" alt="Logo" width="100px" class="object-contain" />
            </div>

            <button @click="isMenuOpen = !isMenuOpen"
                class="md:hidden text-3xl rounded-full p-2 transition-colors duration-200
                    border-2 border-green-400 bg-green-100 hover:bg-green-300 hover:text-green-900 focus:outline-none shadow"
                :class="isMenuOpen ? 'bg-green-300 text-green-900 border-green-600' : 'bg-green-100 text-green-700 border-green-400'">
                <span v-if="!isMenuOpen"><font-awesome-icon icon="bars" /></span>
                <span v-else><font-awesome-icon icon="xmark" class="text-2xl" /></span>
            </button>

            <div class="hidden md:flex items-center gap-8">
                <div class="flex items-center gap-6 text-base font-medium">

                    <RouterLink v-if="!(isEmployer ? route.path === '/employer' : route.path === '/')"
                        :to="isEmployer ? '/employer' : '/'" class="p-2 rounded-tl-3xl rounded-br-3xl transition-colors"
                        :class="isActive(isEmployer ? '/employer' : '/') ? 'bg-green-300 text-green-800 font-semibold' : 'hover: text-gray-800 hover:bg-green-300'">
                        Home
                    </RouterLink>

                    <RouterLink v-if="route.path !== (isEmployer ? '/EmployerJobspage' : '/jobs')"
                        :to="isEmployer ? '/EmployerJobspage' : '/jobs'"
                        class="p-2 rounded-tl-3xl rounded-br-3xl transition-colors"
                        :class="isActive(isEmployer ? '/EmployerJobspage' : '/jobs') ? 'bg-green-300 text-green-800 font-semibold' : 'hover:text-gray-800 hover:bg-green-300'">
                        Jobs
                    </RouterLink>

                    <RouterLink v-if="authStore.role === 'employee' && route.path !== '/applied-jobs'"
                        to="/applied-jobs" class="p-2 transition-colors rounded-tl-3xl rounded-br-3xl"
                        :class="isActive('/applied-jobs') ? 'bg-green-300 text-green-800 font-semibold' : 'hover:text-gray-800 hover:bg-green-300'">
                        Applied Jobs
                    </RouterLink>

                    <RouterLink v-if="authStore.role === 'employer' && route.path !== '/applications'"
                        to="/applications"
                        class="p-2 transition-colors flex items-center gap-1 rounded-tl-3xl rounded-br-3xl"
                        :class="isActive('/applications') ? 'bg-green-300 text-green-800 font-semibold' : 'hover:text-gray-800 hover:bg-green-300'">
                        Applications
                    </RouterLink>

                    <RouterLink v-if="authStore.role === 'employer' && route.path !== '/addjob'" to="/addjob"
                        class="p-2 rounded-tl-3xl rounded-br-3xl transition-colors"
                        :class="isActive('/addjob') ? 'bg-green-300 text-green-800 font-semibold' : 'hover:text-gray-800 hover:bg-green-300'">
                        Post Job
                    </RouterLink>
                </div>

                <div class="flex gap-4 items-center">
                    <template v-if="authStore.isLoggedIn">
                        <div class="relative">
                            <span @click="toggleDropdown"
                                class="p-2 cursor-pointer text-gray-700 font-semibold hover:text-gray-800 hover:bg-green-300 rounded-tl-3xl rounded-br-3xl">
                                Hello, {{ authStore.username }}
                            </span>
                            <div v-if="showDropdown"
                                class="absolute mt-2 bg-white border rounded shadow p-2 text-sm z-50 w-40">
                                <p class="text-gray-600">Role : <span class="font-medium text-green-500 capitalize">{{
                                        authStore.role }}</span></p>
                                <button @click="logout" class="text-red-600 hover:underline">Logout</button>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <RouterLink to="/login" class="text-green-600 hover:underline">Login</RouterLink>
                        <RouterLink to="/register" class="text-green-600 hover:underline">Register</RouterLink>
                    </template>

                    <RouterLink v-if="route.path !== '/about'" to="/about" :class="[
                        'p-2 rounded-tl-3xl rounded-br-3xl transition-colors font-semibold',
                        isActive('/about') ? 'bg-green-300 text-green-800 font-bold' : 'hover:text-gray-800 hover:bg-green-300'
                    ]">
                        About
                    </RouterLink>
                </div>
            </div>
        </div>

        <div v-if="isMenuOpen" class="md:hidden mt-4 px-4 space-y-4 text-base font-medium">
            <RouterLink :to="isEmployer ? '/employer' : '/'" class="block p-2 rounded-lg border border-green-200 bg-green-50 text-green-800 font-semibold shadow transition-all duration-200
                    hover:bg-green-300 hover:text-green-900 hover:scale-105" @click="isMenuOpen = false">Home
            </RouterLink>
            <RouterLink :to="isEmployer ? '/EmployerJobspage' : '/jobs'" class="block p-2 rounded-lg border border-green-200 bg-green-50 text-green-800 font-semibold shadow transition-all duration-200
                    hover:bg-green-300 hover:text-green-900 hover:scale-105" @click="isMenuOpen = false">Jobs
            </RouterLink>

            <RouterLink v-if="authStore.role === 'employer' && route.path !== '/applications'" to="/applications" class="block p-2 rounded-lg border border-green-200 bg-green-50 text-green-800 font-semibold shadow transition-all duration-200
                hover:bg-green-300 hover:text-green-900 hover:scale-105" @click="isMenuOpen = false">
                Applications
            </RouterLink>

            <RouterLink v-if="authStore.role === 'employee'" to="/applied-jobs" class="block p-2 rounded-lg border border-green-200 bg-green-50 text-green-800 font-semibold shadow transition-all duration-200
                    hover:bg-green-300 hover:text-green-900 hover:scale-105" @click="isMenuOpen = false">Applied Jobs
            </RouterLink>

            <RouterLink v-if="authStore.role === 'employer'" to="/addjob" class="block p-2 rounded-lg border border-green-200 bg-green-50 text-green-800 font-semibold shadow transition-all duration-200
                    hover:bg-green-300 hover:text-green-900 hover:scale-105" @click="isMenuOpen = false">Post Job
            </RouterLink>

            <template v-if="authStore.isLoggedIn">
                <div class="relative">
                    <span @click="toggleDropdown" class="block w-full p-2 cursor-pointer text-gray-700 font-semibold rounded-lg border border-green-200 bg-green-50 shadow
                            hover:text-green-900 hover:bg-green-300 transition-all duration-200">
                        Hello, {{ authStore.username }}
                    </span>
                    <div v-if="showDropdown" class="absolute mt-2 bg-white border rounded shadow p-2 text-sm z-50 w-40">
                        <p class="text-gray-600">Role : <span class="font-medium text-green-500 capitalize">{{
                                authStore.role }}</span></p>
                        <button @click="logout" class="text-red-600 hover:underline mt-2">Logout</button>
                    </div>
                </div>
                <RouterLink to="/about" class="block p-2 rounded-lg border border-green-200 bg-green-50 text-green-800 font-semibold shadow transition-all duration-200
                        hover:bg-green-300 hover:text-green-900 hover:scale-105" @click="isMenuOpen = false">About
                </RouterLink>
            </template>
            <template v-else>
                <RouterLink to="/login" class="block p-2 rounded-lg border border-green-200 bg-white text-green-600 font-semibold shadow transition-all duration-200
                        hover:bg-green-300 hover:text-green-900 hover:scale-105" @click="isMenuOpen = false">Login
                </RouterLink>
                <RouterLink to="/register" class="block p-2 rounded-lg border border-green-200 bg-white text-green-600 font-semibold shadow transition-all duration-200
                        hover:bg-green-300 hover:text-green-900 hover:scale-105" @click="isMenuOpen = false">Register
                </RouterLink>
            </template>
        </div>
    </nav>
</template>
