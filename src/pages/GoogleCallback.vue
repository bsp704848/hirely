<script setup>
import { useRouter, useRoute } from 'vue-router'
import { onMounted } from 'vue'
import { useAuthStore } from '../stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

onMounted(async () => {
    const token = route.query.token;

    if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
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
