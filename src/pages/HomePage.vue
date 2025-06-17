<script setup>

import Hero from '../components/Hero.vue'
import JobCards from '../components/JobCards.vue'
import Carousel from '../components/Carousel.vue'
import AboutPage from './AboutPage.vue'
import HomeImage from '../assets/hero.webp'
import Steps from '../components/Steps.vue'
import JobsCarousel from '../components/JobsCarousel.vue'


</script>


<template>
  <div >
    <Hero :image="HomeImage" />
    <JobCards />
    <Carousel />
    <Steps/>
    <JobsCarousel/>
    <AboutPage />
  </div>
</template>


