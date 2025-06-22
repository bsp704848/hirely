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
        const res = await fetch(`${baseURL}/jobs?sort=-postedAt&limit=6`)
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
    <div class="px-4 sm:px-6 lg:px-8 py-16 ">
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

            <Carousel :items-to-show="3" :items-to-scroll="3" :autoplay="0" :transition="500" :wrap-around="false"
                class="w-full" :breakpoints="{
                    320: { itemsToShow: 1, itemsToScroll: 1 },
                    640: { itemsToShow: 1, itemsToScroll: 1 },
                    768: { itemsToShow: 2, itemsToScroll: 2 },
                    1024: { itemsToShow: 3, itemsToScroll: 3 },
                    1280: { itemsToShow: 3, itemsToScroll: 3 }
                }">

                <Slide v-for="job in jobs" :key="job._id" class="carousel__slide">
                    <div class="h-full flex">
                        <JobCard @click="() => navigateToJobDetails(job._id)" :title="job.jobTitle" :id="job._id"
                            :image="job.company?.logo || defaultImage"
                            class="h-full flex flex-col justify-between w-full min-w-[300px]  min-h-[200px] bg-white p-4 transition-transform duration-300 hover:scale-[1.02] border-l-2 border-t-2 border-r-8 border-b-8 border-green-500 hover:border-r-green-700 hover:border-b-green-700 hover:border-l-green-700 hover:border-t-green-700">

                            <div class="flex-1">
                                <p class=" text-sm sm:text-base">
                                    <font-awesome-icon icon="location-dot" class="mr-1" />
                                    {{ job.company?.location || 'Location not specified' }}
                                </p>
                                <p class="text-sm sm:text-base"><font-awesome-icon icon="list" class="mr-1" /> {{
                                    job.company.companyName || 'Name not specified' }}</p>
                                <p class="text-sm sm:text-base"><font-awesome-icon icon="list" class="mr-1" /> {{
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
                        <template #prev>
                            <button aria-label="Previous slide" class="carousel-nav-btn carousel-prev">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                        clip-rule="evenodd" />
                                </svg>
                            </button>
                        </template>
                        <template #next>
                            <button aria-label="Next slide" class="carousel-nav-btn carousel-next">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor"
                                    viewBox="0 0 20 20">
                                    <path fill-rule="evenodd"
                                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
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
.carousel-nav-btn {
    @apply bg-green-600 hover:bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-md transition;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 20;
}

.carousel-prev {
    left: 1rem;
}

.carousel-next {
    right: 1rem;
}

@media (max-width: 768px) {
    .carousel-prev {
        left: 0.5rem;
    }

    .carousel-next {
        right: 0.5rem;
    }
}

.carousel__next,
.carousel__prev {
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #22c55e;
    color: white;
    border-radius: 9999px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.carousel__track {
    scrollbar-width: none;
}

.carousel__track::-webkit-scrollbar {
    display: none;
}

.carousel__slide {
    display: flex;
    justify-content: center;
    padding: 0 2px;
    box-sizing: border-box;
    margin-bottom: 1rem;
    margin-top: 1rem;
}

.job-card p {
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    color: #1f2937;
    line-height: 1.6;
}

@media (max-width: 1024px) {
    .job-card {
        min-width: 95%;
    }
}

@media (max-width: 768px) {
    .job-card {
        min-width: 100%;
        padding: 1rem;
    }
}

.dark .job-card {
    background-color: #1e293b;
    color: #f8fafc;
    border-color: #334155;
}

.dark .job-card p {
    color: #cbd5e1;
}
</style>
