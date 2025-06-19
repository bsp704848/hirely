<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
    if (route.query.tokenSet === 'true') {
        try {
           
            await new Promise(resolve => setTimeout(resolve, 500));
            const user = await authStore.fetchUser();

            if (user?.role === 'employer') {
                router.push('/employer');
            } else {
                router.push('/');
            }
        } catch (err) {
            console.error('Google fetchUser failed:', err);
            router.push('/login');
        }
    } else {
        router.push('/login');
    }
});
</script>

<template>
    <div class="text-center mt-20 text-xl font-medium">Finishing login via Google...</div>
</template>
