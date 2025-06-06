<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import debounce from 'lodash.debounce';
import JobCard from '../components/JobCard.vue';
import defaultImage from '../assets/icons/default.png';
import { useAuthStore } from '../stores/authStore';
import JobSearch from '../components/JobSearch.vue';
import SalaryFilter from '../components/SalaryFilter.vue';
import ExperienceFilter from '../components/ExperienceFilter.vue';
import Pagination from '../components/Pagination.vue';
const baseURL = import.meta.env.VITE_API_BASE_URL;
import '../assets/Styles/jobList.css';



const jobs = ref([]);
const jobsPerPage = 4
const currentPage = ref(1)
const auth = useAuthStore();
const router = useRouter();
const route = useRoute()
const selectedSalaryRange = ref({ min: 10000, max: 200000 });
const selectedExperience = ref('All');
const searchQuery = ref('');
const debouncedQuery = ref('');
const selectedCategory = ref(route.query.category || '')
const isLoading = ref(true);


const navigateTo = (jobId) => {
    const role = auth.role || 'employee';
    router.push(role === 'employer' ? `/EmployerJobs/${jobId}` : `/job/${jobId}`);
};

onMounted(async () => {
    try {
        const res = await fetch(`${baseURL}/jobs`);
        const data = await res.json();

        const category = route.query.category
        if (category) {
            searchQuery.value = category
        }

        if (Array.isArray(data)) {
            jobs.value = data;

            const salaries = data
                .map(job => {
                    if (job.salary && typeof job.salary === 'object') {
                        return [job.salary.min, job.salary.max];
                    }
                    const numericSalary = parseInt((job.salary || '0').toString().replace(/[^\d]/g, ''));
                    return isNaN(numericSalary) ? null : numericSalary;
                })
                .flat()
                .filter(sal => sal !== null);

            if (salaries.length > 0) {
                selectedSalaryRange.value.min = Math.min(...salaries);
                selectedSalaryRange.value.max = Math.max(...salaries);
            }
        }


    } catch (err) {
        console.error('Error fetching jobs:', err);
    } finally {
        isLoading.value = false;
    }
});

const totalPages = computed(() =>
    Math.ceil(jobs.value.length / jobsPerPage)
)


function handlePageChange(page) {
    currentPage.value = page
}


function safeLower(str) {
    return typeof str === 'string' ? str.toLowerCase() : '';
}

const paginatedJobs = computed(() => {
    const filteredJobs = jobs.value.filter(job => {

        let salaryPass = false;
        if (job.salary && typeof job.salary === 'object') {
            salaryPass =
                job.salary.min >= selectedSalaryRange.value.min &&
                job.salary.max <= selectedSalaryRange.value.max;
        } else {
            const rawSalary = job.salary || '0';
            const numericSalary = parseInt(rawSalary.toString().replace(/[^\d]/g, ''));
            salaryPass =
                !isNaN(numericSalary) &&
                numericSalary >= selectedSalaryRange.value.min &&
                numericSalary <= selectedSalaryRange.value.max;
        }


        const matchesCategory = !selectedCategory.value || job.jobCategory === selectedCategory.value;
        const query = safeLower(searchQuery.value);
        const title = safeLower(job.jobTitle);
        const company = safeLower(job.company?.companyName);
        const location = safeLower(job.company?.location);
        const type = safeLower(job.jobType);
        const jobId = safeLower(job._id);
        const jobCategory = safeLower(job.jobCategory);
        const matchesSearch =
            title.includes(query) ||
            company.includes(query) ||
            location.includes(query) ||
            type.includes(query) ||
            jobId.includes(query) ||
            jobCategory.includes(query);
        const expFilter = selectedExperience.value;
        const matchesExperience = expFilter === 'All' || job.experience === expFilter;

        return matchesCategory && matchesSearch && salaryPass && matchesExperience;
    });

    const start = (currentPage.value - 1) * jobsPerPage;
    return filteredJobs.slice(start, start + jobsPerPage);
});


watch(selectedSalaryRange, (newRange) => {
    if (newRange.min === 10000 && newRange.max === 200000) {

        jobs.value = [...jobs.value];
    }
});

watch(() => route.query.category, (newCategory) => {
    selectedCategory.value = newCategory || ''
})

watch(searchQuery, debounce((val) => {
    debouncedQuery.value = val;
}, 300));

watch([searchQuery, selectedSalaryRange, selectedExperience], () => {
    currentPage.value = 1;
});


function handleSalaryChange(range) {
    selectedSalaryRange.value = range;
}

function handleExperienceChange(exp) {
    selectedExperience.value = exp;
}

</script>

<template>
    <div class="joblist-wrapper">
        <div class="joblist-container">
            <aside class="joblist-sidebar">
                <h2 class="font-bold">All Filters</h2>
                <JobSearch v-model="searchQuery" @clear-search="fetchAllJobs" />
                <SalaryFilter :salaryRange="selectedSalaryRange" @salary-changed="handleSalaryChange" />
                <ExperienceFilter @experience-changed="handleExperienceChange" />
                <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="handlePageChange" />
            </aside>

            <section class="joblist-main">
                <h2 class="joblist-heading">Latest Jobs</h2>
                <div v-if="isLoading" class="loading-wrapper">
                    <p>Loading jobs...</p>
                </div>
                <div v-else>
                    <div class="auto-grid-wrapper">
                        <div class="auto-grid">
                            <JobCard class="job-card" v-for="job in paginatedJobs" :key="job._id" :title="job.jobTitle"
                                :id="job._id" :image="defaultImage">

                                <p><font-awesome-icon icon="location-dot" /> Location: <span>{{ job.company.location
                                }}</span></p>
                                <p><font-awesome-icon :icon="['fas', 'list']" /> Category: <span>{{ job.jobCategory
                                }}</span></p>
                                <p><font-awesome-icon :icon="['fas', 'indian-rupee-sign']" /> Salary:
                                    <span>
                                        {{ job.salary && typeof job.salary === 'object'
                                            ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
                                            : job.salary }} &#8377; /month
                                    </span>
                                </p>
                                <p><font-awesome-icon :icon="['fas', 'font-awesome']" /> Type: <span>{{ job.jobType
                                }}</span></p>
                                <p><font-awesome-icon :icon="['fas', 'building']" /> Company: <span>{{
                                    job.company.companyName }}</span></p>

                                <button class="show-details-btn" @click="navigateTo(job._id)">
                                    Show Details
                                </button>
                            </JobCard>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
