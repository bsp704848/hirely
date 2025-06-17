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
                <h2
                    class="font-bold mb-4 md:mb-6 text-center text-lg md:text-xl bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                    All Filters</h2>
                <JobSearch v-model="searchQuery" @clear-search="fetchAllJobs" />
                <SalaryFilter :salaryRange="selectedSalaryRange" @salary-changed="handleSalaryChange" />
                <ExperienceFilter @experience-changed="handleExperienceChange" />
                <Pagination :currentPage="currentPage" :totalPages="totalPages" @page-changed="handlePageChange" />
            </aside>

            <section class="joblist-main">
                <h2
                    class="bg-gradient-to-r from-green-200 via-green-500 to-purple-600 bg-clip-text text-transparent text-4xl font-bold text-center mb-8">
                    Latest Jobs</h2>
                <div v-if="isLoading" class="loading-wrapper">
                    <svg class="animate-spin h-8 w-8 text-green-500 mr-3" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <span class="text-lg text-gray-500">Loading...</span>
                </div>
                <div v-else>
                    <div v-if="!paginatedJobs.length" class="no-jobs-found">
                        <p class="text-center text-xl text-gray-800">No jobs found matching your criteria.</p>
                    </div>
                    <div v-else class="auto-grid-wrapper">
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
                                <p><font-awesome-icon :icon="['fas', 'building']" /> Employer : <span>{{
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


<style scoped >
.joblist-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem 1rem;
}

.joblist-container {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    max-width: 1200px;
    width: 100%;
}

.joblist-sidebar {
    width: 100%;
    max-width: 350px;
    padding: 1rem;
    border-right: 4px solid #22c55e;
    border-bottom: 4px solid #22c55e;
    border-right-width: 4px;
    border-radius: 1rem;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    flex-shrink: 0;
    margin-top: 6rem;
    padding-bottom: 2rem;
}

.joblist-sidebar h2 {
    text-align: center;
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
}

.joblist-main {
    flex: 1;
    width: 100%;
}



.loading-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
    font-size: 1.2rem;
    color: #888;
}

.auto-grid-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

.auto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    width: 100%;
    gap: 1rem;
    row-gap: 1.5rem;
    align-items: stretch;
}

.auto-grid:only-child {
    justify-content: center;
}

.job-card {
    background-color: #ffffff;
    padding: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    border-right: 6px solid transparent ;
    border-bottom: 6px solid transparent ;
    gap: 0.5rem;
    height: 100%;
    max-width: 360px;
    margin: 0 auto;
}


.job-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
    border-right-color: #16a34a;
    border-bottom-color: #16a34a;
}

.job-card p {
    font-size: 0.875rem;
    font-weight: 600;
    color: #555;
}

.job-card span {
    font-weight: 700;
    color: #222;
}

.show-details-btn {
    padding: 0.5rem;
    background: linear-gradient(to right, #22c55e, #16a34a);
    color: white;
    border: none;
    border-radius: 2rem;
    font-size: 0.875rem;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
}

.show-details-btn:hover {
    background: linear-gradient(to right, #16a34a, #22c55e);
    transform: scale(1);
}
.no-jobs-found {
    display: flex;
        justify-content: center;
        align-items: center;
        height: 300px;
        font-size: 1.2rem;
        color: #020202;
}


@media (max-width: 640px) {
    .joblist-container {
        flex-direction: column;
    }

    .joblist-sidebar {
        width: 100%;
        max-width: 100%;
    }

    .auto-grid {
        grid-template-columns: 1fr;
    }
}

@media (min-width: 641px) and (max-width: 1024px) {
    .auto-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .joblist-sidebar {
        width: 100%;
        max-width: 100%;
    }
}
</style>