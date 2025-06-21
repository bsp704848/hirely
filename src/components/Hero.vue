<script setup>
import { Typed } from '@duskmoon/vue3-typed-js';
import welcomeAnimation from '../assets/welcome.json'
import Lottieplayer from '../components/LottiePlayer.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const props = defineProps({
    animationData: {
        type: Object,
        required: false,
        default: null,
    },
    showButton: {
        type: Boolean,
        default: true,
    },
    typedStrings: {
        type: Array,
        default: () => ['dream job effortlessly.', 'perfect role with Hirely!']
    }
})

const options = {
    strings: props.typedStrings,
    typeSpeed: 50,
    backSpeed: 40,
    loop: true
};

const authStore = useAuthStore()
const router = useRouter()

const handleGetStartedClick = () => {
    if (authStore.isLoggedIn) {
        const role = authStore.role || 'employee';
        if (role === 'employee') {
            setTimeout(() => {
                router.push('/jobs');
            }, 1500);
          
        } else {
            setTimeout(() => {
                router.push('/employer');
            }, 1500);
        }      
    } else {
        router.push('/register');
    }
}

</script>

<template>
    <section class="text-green-600 py-10 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12">

            <div class="lg:w-1/2 text-center lg:text-left">
                <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                    Welcome to <span class="text-gray-800">Hirely!</span>
                </h1>
                <p
                    class="text-xl sm:text-2xl md:text-3xl font-bold h-12 mb-4 flex justify-center lg:justify-start items-center gap-2">
                    Find your
                    <Typed :options="options">
                        <span class="typing text-black"></span>
                    </Typed>
                </p>
                <p class="text-base sm:text-lg md:text-xl mb-6 text-gray-800">
                    Empower your career journey with seamless registration, job matching, and employee management.
                </p>
                <button v-if="showButton" @click="handleGetStartedClick"
                    class="inline-block bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold px-6 py-3 rounded-lg transition">
                    Get Started
                </button>
            </div>

            <div class="lg:w-1/2 flex justify-center">
                <Lottieplayer :animationData="animationData || welcomeAnimation" class="w-[600px] h-[400px]" />
            </div>

        </div>
    </section>
</template>