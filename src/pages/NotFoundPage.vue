<script setup>
import { useRouter } from 'vue-router'
import notFoundAnimation from '../assets/404.json'
import Lottieplayer from '../components/LottiePlayer.vue'

const router = useRouter()

const goHome = () => {
    router.push('/')
}
</script>

<template>
    <div class="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4">
        <Lottieplayer :animationData="notFoundAnimation" />
        <p class="text-gray-600 mb-6">Oops! The page you're looking for doesn't exist or has been moved.</p>
        <button @click="goHome"
            class="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-6 py-2 rounded  transition">
            Go to Home
        </button>
    </div>
</template>

