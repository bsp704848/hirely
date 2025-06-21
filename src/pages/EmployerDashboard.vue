<script setup>
import Hero from '../components/Hero.vue'
import employerAnimation from '../assets/Employer.json'
import Lottieplayer from '../components/LottiePlayer.vue'
import createJob from '../assets/icons/createJob.png'
import findIcon from '../assets/icons/find.png'
import teaIcon from '../assets/icons/tea.png'
import businessman from '../assets/icons/businessman.png'
import { RouterLink } from 'vue-router'

const steps = [
    {
        title: '1. Create a Job Post',
        description: 'Fill out the job title, description, type, and required skills. Posting takes just a few minutes.',
        image: createJob,
    },
    {
        title: '2. Review & Publish',
        description: 'Preview your listing, make edits if needed, and publish to make it live instantly.',
        image: findIcon,
    },
    {
        title: '3. Sit Back & Relax',
        description: 'Qualified candidates start applying. We’ll notify you when applications roll in!',
        image: teaIcon,
    },
    {
        title: '4. Hire Your Perfect Fit',
        description: 'Review applications, conduct interviews, and hire your ideal candidate—all from your dashboard.',
        image: businessman,
    }
]
</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8 py-6">

        <div class="max-w-7xl mx-auto w-full">
            <Lottieplayer v-if="animationData" />

            <Hero :animationData="employerAnimation" :showButton="false" :typedStrings="[
                'next hire today.',
                'ideal candidate easily.',
                'job post in minutes.'
            ]" />

            <section class="bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-10 mt-10">
                <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-16">
                    How <span class="text-green-500">Hirely</span> Works
                </h2>
                <div class="grid gap-10 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <div v-for="(step, index) in steps" :key="index"
                        class="flex flex-col p-4 rounded-tr-3xl rounded-bl-3xl items-center text-center shadow-2xl 
         border-r-8 border-b-8 border-transparent 
         hover:border-green-500 transform transition duration-500 ease-in-out hover:-translate-y-2 bg-white dark:bg-gray-800">
                        <img :src="step.image" alt="Step Icon" class="w-16 h-16 mb-4 p-2" />
                        <h3 class="text-xl font-semibold text-gray-700 dark:text-white">
                            {{ step.title }}
                        </h3>
                        <p class="text-sm text-gray-800 dark:text-gray-300 mt-2 px-2">
                            {{ step.description }}
                        </p>
                    </div>

                </div>
            </section>

            <div class="text-center mt-12">
                <p class="text-lg text-gray-800 dark:text-gray-300 mb-6">
                    Ready to find your next great hire?
                </p>
                <RouterLink to="/addJob"
                    class="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition">
                    Post a Job Now
                </RouterLink>
            </div>
        </div>
    </div>
</template>
