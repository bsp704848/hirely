<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { onMounted } from 'vue'

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
    try {
        const user = await authStore.fetchUser()
        if (user?.role === 'employer') {
            router.push('/employer')
        } else {
            router.push('/')
        }
    } catch (err) {
        console.error('User fetch failed:', err)
        router.push('/login')
    }
})
</script>

<template>
    <div class="text-center mt-20 text-xl font-medium">
        Finishing login via Google...
    </div>
</template>
