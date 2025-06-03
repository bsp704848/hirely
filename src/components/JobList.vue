<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter,useRoute } from 'vue-router';
import debounce from 'lodash.debounce';
import JobCard from '../components/JobCard.vue';
import defaultImage from '../assets/icons/default.png';
import { useAuthStore } from '../stores/authStore';
import JobSearch from '../components/JobSearch.vue';
import SalaryFilter from '../components/SalaryFilter.vue';
import ExperienceFilter from '../components/ExperienceFilter.vue';
const baseURL = import.meta.env.VITE_API_BASE_URL;



const jobs = ref([]);
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
    router.push(role === 'employer' ? `/employerjoblist/${jobId}` : `/job/${jobId}`);
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

watch(() => route.query.category, (newCategory) => {
    selectedCategory.value = newCategory || ''
})


const filteredJobs = computed(() => {
    return jobs.value.filter(job => {

        let salaryPass = false;
        if (job.salary && typeof job.salary === 'object') {
            salaryPass = (
                job.salary.min >= selectedSalaryRange.value.min &&
                job.salary.max <= selectedSalaryRange.value.max
            );
        } else {
            const rawSalary = job.salary || '0';
            const numericSalary = parseInt(rawSalary.toString().replace(/[^\d]/g, ''));
            salaryPass = (
                !isNaN(numericSalary) &&
                numericSalary >= selectedSalaryRange.value.min &&
                numericSalary <= selectedSalaryRange.value.max
            );
        }

        const matchesCategory = !selectedCategory.value || job.jobCategory === selectedCategory.value
        const matchesSalary = salaryPass; 
        const query = searchQuery.value.toLowerCase();
        const title = job.jobTitle?.toLowerCase() || '';
        const company = job.company?.companyName?.toLowerCase() || '';
        const location = job.company?.location?.toLowerCase() || '';
        const type = job.jobType?.toLowerCase() || '';
        const jobId = job._id?.toLowerCase() || '';
        const jobCategory = job.jobCategory?.toLowerCase() || '';
        const matchesSearch = title.includes(query) || company.includes(query) || location.includes(query) || type.includes(query) || jobId.includes(query) || jobCategory.includes(query);

        const expFilter = selectedExperience.value;
        const matchesExperience = expFilter === 'All' || job.experience === expFilter;

        return matchesCategory && matchesSearch && matchesSalary && matchesExperience;

    });
});



watch(selectedSalaryRange, (newRange) => {
    if (newRange.min === 10000 && newRange.max === 200000) {

        jobs.value = [...jobs.value];
    }
});

watch(searchQuery, debounce((val) => {
    debouncedQuery.value = val;
}, 300));

function handleSalaryChange(range) {
    selectedSalaryRange.value = range;
}

function handleExperienceChange(exp) {
    selectedExperience.value = exp;
}

</script>

<template>
    <div class="flex flex-col items-center justify-center px-4 py-6">
        <div class="flex flex-wrap-responsive w-full max-w-7xl gap-16 mx-auto">

            <aside class="w-full max-w-xs space-y-6 p-4 py-8  shadow-green-400 border-r-green-400 border-r-8">
                <h2 class="text-center font-medium text-xl">Choose your Dream job...</h2>
                <JobSearch v-model="searchQuery" />
                <SalaryFilter :salaryRange="selectedSalaryRange" @salary-changed="handleSalaryChange" />
                <ExperienceFilter @experience-changed="handleExperienceChange" />
            </aside>

            <section class="flex-1">
                <h2 class="text-4xl md:text-5xl font-bold mb-10 text-center text-gray-800 tracking-tight">
                    Latest Jobs
                </h2>
                <div v-if="isLoading" class="flex items-center justify-center h-64">
                    <p class="text-gray-500">Loading jobs...</p>
                </div>
                <div v-else class="grid gap-10 auto-grid justify-center min-h-[400px]">
                    <JobCard class="job-card" v-for="job in filteredJobs" :key="job._id" :title="job.jobTitle"
                        :id="job._id" :image="defaultImage">

                        <p class="text-sm font-bold text-gray-500">
                            <font-awesome-icon icon="location-dot" class="text-red-800" />
                            Location: <span class="font-semibold">{{ job.company.location }}</span>
                        </p>
                        <p class="text-sm font-bold text-gray-500">
                            <font-awesome-icon :icon="['fas', 'list']" class="text-blue-600" />
                            Category: <span class="font-semibold">{{ job.jobCategory }}</span>
                        </p>

                        <p class="text-sm font-bold text-gray-500">
                            <font-awesome-icon :icon="['fas', 'indian-rupee-sign']" class="text-green-600" />
                            Salary:
                            <span class="font-semibold">
                                {{ job.salary && typeof job.salary === 'object'
                                ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
                                : job.salary }}
                            </span>
                        </p>
                        <p class="text-sm font-bold text-gray-500">
                            <font-awesome-icon :icon="['fas', 'font-awesome']" class="text-blue-600" />
                            Type: <span class="font-semibold">{{ job.jobType }}</span>
                        </p>
                        <p class="text-sm font-bold text-gray-500">
                            <font-awesome-icon :icon="['fas', 'building']" class="text-blue-500" />
                            Company: <span class="font-semibold">{{ job.company.companyName }}</span>
                        </p>

                        <button
                            class="p-2 bg-green-500 text-white shadow-lg hover:bg-green-600 hover:scale-105 transition-all duration-300 rounded-pill text-sm font-bold"
                            @click="navigateTo(job._id)">
                            Show Details
                        </button>
                    </JobCard>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.auto-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    min-height: 400px;
    align-items: start;
    justify-content: center;
    width: 100%;
}

.auto-grid:only-child {
    justify-content: center;
}

.job-card {
    background-color: #ffffff;
    padding: 1.5rem;
    border-radius: 1rem;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    height: 100%;
}

.job-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

@media (max-width: 1024px) {
    .auto-grid {
        grid-template-columns: 1fr;
    }

    .flex-wrap-responsive {
        flex-direction: column;
    }

    aside {
        max-width: 100% !important;
        width: 100% !important;
    }

    section {
        width: 100%;
    }
}
</style>
