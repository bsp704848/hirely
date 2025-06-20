<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import JobCard from './JobCard.vue'
import defaultImage from '../assets/icons/default.png'

const router = useRouter()
const jobs = ref([])
const isLoading = ref(true)
const baseURL = import.meta.env.VITE_API_BASE_URL

async function fetchLatestJobs() {
    try {
        const res = await fetch(`${baseURL}/jobs?sort=-postedAt&limit=6`) // Reduced to 6 for better carousel behavior
        const data = await res.json()
        if (Array.isArray(data)) {
            jobs.value = data
        }
    } catch (err) {
        console.error('Error fetching latest jobs:', err)
    } finally {
        isLoading.value = false
    }
}

onMounted(fetchLatestJobs)

function navigateToJobList() {
    router.push('/jobs')
}

function navigateToJobDetails(jobId) {
    router.push(`/job/${jobId}`)
}
</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8 py-12 ">
        <div class="max-w-7xl mx-auto">
            <h1
                class="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-16 md:mb-12 text-gray-900 dark:text-white">
                Latest <span class="text-green-600 dark:text-green-400">Job Openings</span>
            </h1>

            <div v-if="isLoading" class="text-center py-8 text-gray-800 dark:text-gray-300">
                <svg class="animate-spin h-8 w-8 mx-auto text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <p class="mt-2">Loading jobs...</p>
            </div>

            <div v-else-if="jobs.length === 0" class="text-center py-8 text-gray-600 dark:text-gray-300">
                No current job openings available
            </div>

            <Carousel v-else :items-to-show="1.2" :autoplay="0" :transition="500" class="w-full relative" :breakpoints="{
                320: { itemsToShow: 1 },
                375: { itemsToShow: 1 },
                400: { itemsToShow: 1 },
                500: { itemsToShow: 1 },
                640: { itemsToShow: 2 },
                768: { itemsToShow: 1 },
                900: { itemsToShow: 3 },
                1024: { itemsToShow: 3 },
                1280: { itemsToShow: 3 },
                1440: { itemsToShow: 3 },
            }">
                <Slide v-for="job in jobs" :key="job._id">
                    <div class="px-1 sm:px-3 py-2 h-full flex ">
                        <JobCard @click="() => navigateToJobDetails(job._id)" :title="job.jobTitle" :id="job._id"
                            :image="job.company?.logo || defaultImage"
                            class="h-full flex flex-col justify-between w-full min-w-[300px]  min-h-[200px] bg-white shadow-md p-4 transition-transform duration-300 hover:scale-[1.02] border-r-8 border-b-8 border-transparent hover:border-r-green-500 hover:border-b-green-500">

                            <div class="flex-1">
                                <p class=" text-sm sm:text-base">
                                    <font-awesome-icon icon="location-dot" class="mr-1" />
                                    {{ job.company?.location || 'Location not specified' }}
                                </p>
                                <p class="text-sm sm:text-base"><font-awesome-icon icon="list" class="mr-1" /> {{
                                    job.company.companyName || 'Name not specified' }}</p>
                                <p class="text-sm sm:text-base text-truncate"><font-awesome-icon icon="list" class="mr-1" /> {{
                                    job.jobCategory || 'Category not specified' }}</p>
                                <p class="text-sm sm:text-base">
                                    <font-awesome-icon icon="indian-rupee-sign" class="mr-1" />
                                    <span v-if="job.salary && typeof job.salary === 'object'">
                                        {{ job.salary.min?.toLocaleString() || 'NA' }} - {{
                                        job.salary.max?.toLocaleString()
                                        || 'NA' }} /month
                                    </span>
                                    <span v-else>
                                        {{ job.salary || 'Salary not specified' }}
                                    </span>
                                </p>
                            </div>
                        </JobCard>
                    </div>
                </Slide>

                <template #addons>
                    <Navigation>
                        <template #next>
                            <button aria-label="Next slide"
                                class="carousel__next bg-green-600 hover:bg-green-700 text-white p-2 absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-4 shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </template>
                        <template #prev>
                            <button aria-label="Previous slide"
                                class="carousel__prev bg-green-600 hover:bg-green-700 text-white p-2 absolute left-0 top-1/2 transform -translate-y-1/2 translate-x-4 shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </template>
                    </Navigation>
                </template>
            </Carousel>

            <div class="text-center mt-8 sm:mt-10">
                <button @click="navigateToJobList"
                    class="px-5 mt-8  py-2 sm:px-6 sm:py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-300 inline-flex items-center">
                    View All Jobs
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20"
                        fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>

.carousel__next,
.carousel__prev {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border-radius: 50%;
    background-color: #0baa45;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.carousel__next:hover,
.carousel__prev:hover {
    transform: translateY(-50%) scale(1.1);
    background-color: #0c8639;
}


@media (max-width: 640px) {
    .carousel__next {
        right: 10px !important;
        transform: translateY(-50%);
    }

    .carousel__prev {
        left: 10px !important;
        transform: translateY(-50%);
    }
}


.carousel__track {
    scrollbar-width: none;
}

.carousel__track::-webkit-scrollbar {
    display: none;
}


.carousel__slide {
    padding: 0 4px;
}


.carousel__slide .job-card {
    border-radius: 1rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: white;
    padding: 0.75rem;
    height: 100%;
}

.carousel__slide .job-card:hover {
    transform: scale(1.03);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}


@media (max-width: 400px) {
    .carousel__slide .job-card {
        min-width: 260px;
        padding: 0.75rem;
    }
}


.carousel__slide .job-card p {
    line-height: 1.4;
    margin-bottom: 0.3rem;
    color: #333;
}


.dark .carousel__slide .job-card {
    background-color: #1e293b;
    color: #f1f5f9;
}

.dark .carousel__slide .job-card p {
    color: #e2e8f0;
}
</style>
