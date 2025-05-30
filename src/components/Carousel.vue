<script setup>
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

import brand1 from '../assets/brand1.png'
import brand2 from '../assets/brand2.png'
import brand3 from '../assets/brand3.png'
import brand4 from '../assets/brand4.png'
import brand5 from '../assets/brand5.png'
import brand6 from '../assets/brand6.png'
import brand7 from '../assets/brand7.png'
import brand8 from '../assets/brand8.png'

const brands = [brand1, brand2, brand3, brand4, brand5, brand6, brand7, brand8]
</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8 py-10 bg-white mb-24">
        <h1 class="text-3xl sm:text-4xl font-bold text-center mb-10">
            Trusted <span class="text-green-600">Brands</span>
        </h1>

        <Carousel :items-to-show="3" :items-to-scroll="1" :wrap-around="true" :autoplay="2000" :transition="700"
            class="w-full max-w-7xl mx-auto" :breakpoints="{
                640: { itemsToShow: 2 },
                768: { itemsToShow: 3 },
                1024: { itemsToShow: 4 },
                1280: { itemsToShow: 5 }
            }">
            <Slide v-for="(logo, index) in brands" :key="index">
                <div class="flex items-center justify-center p-4">
                    <img :src="logo" alt="Brand Logo" class="h-16 w-36 sm:w-40 object-contain" />
                </div>
            </Slide>
        </Carousel>
    </div>
</template>
