<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
    setTimeout(async () => {
        try {
            await authStore.fetchUser(router)
            router.push('/') 
        } catch (err) {
            router.push('/login')
        }
    }, 1000)
})
</script>

<template>
    <div class="text-center mt-20 text-xl font-medium">Logging in via Google...</div>
</template>
