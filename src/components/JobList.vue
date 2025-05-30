<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import JobCard from '../components/JobCard.vue'
import defaultImage from '../assets/icons/default.png'
import JobSearch from '../components/JobSearch.vue'
import JobFilter from '../components/JobFilter.vue'
import { useAuthStore } from '../stores/authStore'
import Pagination from '../components/Pagination.vue'


const props = defineProps({
    limit: {
        type: Number,
        default: null
    }
})

const router = useRouter()
const apiJobs = ref([])
const localJobs = ref([]) 
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(6)
const isFiltering = ref(false)

const selectedSalaryRange = ref(0) 
const selectedSalary = ref('')
const selectedExperience = ref('')
const auth = useAuthStore()


const navigateTo = (jobId) => {
    const role = auth.role || 'employee' 

    if (role === 'employer') {
        router.push(`/employerjoblist/${jobId}`)
    } else {
        router.push(`/job/${jobId}`)
    }
}


onMounted(async () => {
    const stored = JSON.parse(localStorage.getItem('jobs')) || []
    localJobs.value = stored

    if (props.limit == null) {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts')
        let data = await res.json()

        data = data.map(post => ({
            ...post,
            description: post.body,
            salary: "₹50K - ₹60K",
            company: {
                name: 'Company',
                contactEmail: 'hr@company.com',
                contactPhone: '9999999999'
            },
            location: 'Surat',
            type: 'Full Time',
        }))

        apiJobs.value = data

        const allCombined = [...stored, ...data].filter(job => job.company && job.location && job.type)
        localStorage.setItem('allJobs', JSON.stringify(allCombined))
    } else {

        localStorage.setItem('allJobs', JSON.stringify(stored))
    }
})

const filteredJobs = computed(() => {
    const query = searchQuery.value.toLowerCase();
    const selectedSalaryVal = selectedSalary.value;
    const selectedExperienceVal = selectedExperience.value;

    return allJobs.value.filter((job) => {

        const jobId = job.id?.toString().toLowerCase();
        
        const matchesSearch =
            job.title.toLowerCase().includes(query) ||
            job.location?.toLowerCase().includes(query) ||
            job.company?.name?.toLowerCase().includes(query) ||
            (jobId && jobId.includes(query));

        const matchesSalary = !selectedSalaryVal ||
            job.salary.replace(/\s|,/g, '') === selectedSalaryVal.replace(/\s|,/g, '');



        const matchesExperience =
            !selectedExperienceVal || job.experience === selectedExperienceVal;

        return matchesSearch && matchesSalary && matchesExperience;
    });
});

const allJobs = computed(() => {

    let combined = props.limit != null
        ? localJobs.value
        : [...localJobs.value, ...apiJobs.value]

    
    combined = combined.filter(job => job.company && job.location && job.type) 


    return props.limit != null
        ? combined.slice(0, props.limit)
        : combined
}) 


function handleSalaryFilter(value) {
    isFiltering.value = true
    selectedSalary.value = value

    setTimeout(() => {
        isFiltering.value = false
    }, 1000)
}
  

function handleExperienceFilter(value) {
    selectedExperience.value = value;

} 


const totalPages = computed(() => {
    return Math.ceil(filteredJobs.value.length / itemsPerPage.value)
})

const paginatedJobs = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredJobs.value.slice(start, end)
}) 

function onPageChange(newPage) {
    currentPage.value = newPage
}


</script>
<template>
    <div class="flex flex-col items-center justify-center px-4 py-6">

        <h2 class="text-3xl font-semibold mb-10 text-center">Latest Jobs</h2>


        <div class="w-full max-w-6xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">

            <div class="w-full md:w-1/3 ">
                <JobSearch v-model="searchQuery" />
            </div>

            <div class="w-full md:w-1/3 flex">
                <JobFilter v-model:salaryRange="selectedSalaryRange" @update:salaryFilter="handleSalaryFilter"
                    v-model:experienceFilter="selectedExperience" @update:experienceFilter="handleExperienceFilter" />
            </div>
        </div>

        <div class="w-full max-w-6xl grid gap-10 auto-grid justify-center" :class="{ 'min-h-[400px]': isFiltering }">
            <div v-if="isFiltering" class="w-full col-span-full flex justify-center items-center py-10">
                <div class="loader mt-4"></div>
            </div>
            <template v-if="!isFiltering">
                <template v-if="filteredJobs.length === 0">
                    <div v-show="!isFiltering && filteredJobs.length === 0"
                        class="col-span-full text-center text-gray-500 py-10 text-lg">
                        No jobs found with selected filters.
                    </div>
                </template>
                <template v-else>
                    <template v-for="job in paginatedJobs" :key="job.id">
                        <JobCard v-if="job.id" :title="job.title" :id="job.id" :image="defaultImage">
                            <p class="text-sm font-bold text-gray-500">
                                <i class="pi pi-map-marker" style="font-size: 1rem"></i>
                                Location: <span class="font-semibold">{{ job.location }}</span>
                            </p>
                            <p class="text-sm font-bold text-gray-500">
                                <i class="pi pi-bullseye" style="font-size: 1rem"></i>
                                Type: <span class="font-semibold">{{ job.type }}</span>
                            </p>
                            <p class="text-sm font-bold text-gray-500">
                                <i class="pi pi-building" style="font-size: 1rem"></i>
                                Company: <span class="font-semibold">{{ job.company.name }}</span>
                            </p>

                            <button
                                class="p-2 bg-green-500 text-white shadow-lg hover:bg-green-700 transition-all rounded text-sm font-bold"
                                @click="navigateTo(job.id)">
                                Show Details
                            </button>
                        </JobCard>
                    </template>
                </template>
            </template>
        </div>
    </div>
    <Pagination v-if="!isFiltering && filteredJobs.length > itemsPerPage" :currentPage="currentPage"
        :totalPages="totalPages" @page-changed="onPageChange" />
</template> 


<style scoped>
.loader {
    border: 4px solid #e2e8f0;
    border-top: 4px solid #4ade80;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
    margin: auto;
}

.auto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    justify-content: center;
    gap: 2rem;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>

  
