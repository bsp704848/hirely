<script setup>
import { useRouter } from 'vue-router'
import JobCard from '../components/JobCard.vue'
import homeImg from '../assets/icons/home.png'
import buildingImg from '../assets/icons/building.png'
import monitorImg from '../assets/icons/monitor.png'
import dataImg from '../assets/icons/data.png'
import engineeringImg from '../assets/icons/engineering.png'
import moneyImg from '../assets/icons/money.png'
import rocketImg from '../assets/icons/rocket.png'
import marketImg from '../assets/icons/market.png'

const router = useRouter()

function goToCategory(category) {
    router.push({ name: 'joblist', query: { category } })
}

const jobs = [
    { image: homeImg, title: 'Writing & Content' },
    { image: buildingImg, title: 'Business & Management' },
    { image: monitorImg, title: 'Software & Development' },
    { image: dataImg, title: 'Education & Training' },
    { image: engineeringImg, title: 'Engineering / Technical' },
    { image: moneyImg, title: 'Accounting & Finance' },
    { image: rocketImg, title: 'Logistics / Operations' },
    { image: marketImg, title: 'Sales & Marketing' },

]
</script>

<template>
    <div class="mb-28">
        <div class="text-center text-4xl font-bold mb-20">
            <p>Find your <span class="text-green-600">dream job now</span> </p>
        </div>
        <div class="w-full bg-white rounded-lg flex justify-center p-2 sm:p-4 md:p-6">
            <div class="w-full max-w-6xl">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 px-2 sm:px-4 md:px-6 py-4">
                    <div v-for="(job, index) in jobs" :key="index" @click="goToCategory(job.title)"
                        class="cursor-pointer hover:scale-105 transition-all duration-300">
                        <JobCard :image="job.image" :title="job.title" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
