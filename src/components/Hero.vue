<script setup>
import { RouterLink } from 'vue-router'
import { Typed } from '@duskmoon/vue3-typed-js';

const props = defineProps({
    image: {
        type: String,
        required: false,
        default: '',
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

</script>

<template>
    <section class="text-blue-800 py-10 px-4 sm:px-6 lg:px-8">
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
                <p class="text-base sm:text-lg md:text-xl mb-6 text-gray-700">
                    Empower your career journey with seamless registration, job matching, and employee management.
                </p>
                <RouterLink to="/register"
                v-if="showButton" class="inline-block bg-yellow-300 text-blue-800 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-400 transition">
                    Get Started
                </RouterLink>
            </div>

       
            <div class="lg:w-1/2 flex justify-center">
                <img :src="image" alt="Hero" class="w-3/4 sm:w-2/3 md:w-full max-w-md object-contain" />
            </div>

        </div>
    </section>
</template>


