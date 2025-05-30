<script setup>
import JobCard from '../components/JobCard.vue'
import homeImg from '../assets/icons/home.png'
import buildingImg from '../assets/icons/building.png'
import monitorImg from '../assets/icons/monitor.png'
import dataImg from '../assets/icons/data.png'
import engineeringImg from '../assets/icons/engineering.png'
import moneyImg from '../assets/icons/money.png'
import rocketImg from '../assets/icons/rocket.png'
import marketImg from '../assets/icons/market.png'


const jobs = [
    { image: homeImg, title: 'Remote' },
    { image: buildingImg, title: 'MNC' },
    { image: monitorImg, title: 'Software & Dev' },
    { image: dataImg, title: 'Data Science' },
    { image: engineeringImg, title: 'Engineering' },
    { image: moneyImg, title: 'Banking & Finance' },
    { image: rocketImg, title: 'Startups' },
    { image: marketImg, title: 'Marketing' },

]
</script>

<template>
    <div class="mb-28">
        <div class="text-center text-4xl font-bold mb-20">
            <p>Find your <span class="text-green-600">dream job now</span> </p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg">
            <JobCard v-for="(job, index) in jobs" :key="index" :image="job.image" :title="job.title" />
        </div>
    </div>
</template>
