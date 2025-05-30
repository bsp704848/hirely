<script setup>
import { useRouter } from 'vue-router'
import notFoundImage from '../assets/notfound.svg'

const router = useRouter()

const goHome = () => {
    router.push('/')
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
        <img :src="notFoundImage"
            alt="Not Found" class="w-96 h-auto mb-8" />
        <p class="text-gray-600 mb-6">Oops! The page you're looking for doesn't exist or has been moved.</p>
        <button @click="goHome" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            Go to Home
        </button>
    </div>
</template>

