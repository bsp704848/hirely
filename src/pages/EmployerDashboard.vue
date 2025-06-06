<script setup>
import Hero from '../components/Hero.vue'
import employerAnimation from '../assets/Employer.json'
import Lottieplayer from '../components/LottiePlayer.vue'

</script>

<template>
    <div class="p-4">
        <Lottieplayer v-if="animationData" />
        <Hero :animationData="employerAnimation" :showButton="false"
            :typedStrings="['next hire today.', 'ideal candidate easily.', 'job post in minutes.']" />
    </div>
</template>
