<script setup>
import { useRouter } from 'vue-router'
import Hero from '../components/Hero.vue'
import JobCards from '../components/JobCards.vue'
import Carousel from '../components/Carousel.vue'
// import JobList from '../components/JobList.vue'
import AboutPage from './AboutPage.vue'
import HomeImage from '../assets/hero.webp'

const router = useRouter()

// function handleFindMoreJobs() {
//   router.push({ path: '/jobs', query: { limit: 10 } })
// }


</script>


<template>
  <div>
    <Hero :image="HomeImage" />
    <JobCards />
    <Carousel />
    <!-- <JobList :limit="3" :showFilter="false" /> -->

    <!-- <div class="text-center my-6">
      <button @click="handleFindMoreJobs"
        class="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded text-sm font-semibold">
        Find More Jobs
      </button>
    </div> -->
    <AboutPage />
  </div>
</template>


<style></style>