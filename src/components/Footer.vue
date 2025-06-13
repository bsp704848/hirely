<script setup>
import logo from '../assets/logo2.png'
import { RouterLink } from 'vue-router'  

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}


</script>

<template>
    <footer class="bg-gradient-to-br from-gray-500 to-green-500 py-10 px-6 mt-10">
        <div
            class="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 items-center text-center sm:text-left">

            <div>
                <RouterLink to="/" @click="scrollToTop">
                    <img :src="logo" alt="Logo" class="w-24 mx-auto sm:mx-0 mb-4">
                </RouterLink>
                <p class="text-sm text-white">Empowering careers and connections — crafted with care and code.</p>
            </div>
            <div class="flex flex-col sm:flex-row justify-center sm:justify-center gap-4 sm:gap-6">
                <RouterLink to="/" @click="scrollToTop" class="text-white hover:text-yellow-300 transition">Home
                </RouterLink>
                <RouterLink to="/about" class="text-white hover:text-yellow-300 transition">About</RouterLink>
                <RouterLink to="/register" class="text-white hover:text-yellow-300 transition">Register</RouterLink>
            </div>

            <div class="sm:text-right">
                <p class="text-sm text-white">Contact: support@hirely.com</p>
                <p class="text-sm text-white mt-1">&copy; 2025 Hirely. All rights reserved.</p>
            </div>

        </div>
    </footer>
</template>


