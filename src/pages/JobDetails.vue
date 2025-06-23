<script setup>
import { useJobStore } from '../stores/jobStore'
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const baseURL = import.meta.env.VITE_API_BASE_URL
const jobStore = useJobStore()
const route = useRoute()
const router = useRouter()

const job = computed(() => jobStore.selectedJob)
const showModal = ref(false)
const hasApplied = ref(false)
const isLoading = ref(true);


const allJobs = ref([])

const fetchJob = async (jobId) => {
    try {
        const res = await fetch(`${baseURL}/jobs/${jobId}`)
        if (!res.ok) throw new Error("Failed to fetch job")
        const data = await res.json()
        jobStore.setSelectedJob(data)
    } catch (err) {
        console.error("Error fetching job:", err)
    }
}

onMounted(async () => {
    isLoading.value = true;
    await fetchJob(route.params.id)
    try {
        const res = await fetch(`${baseURL}/jobs`)
        if (res.ok) {
            allJobs.value = await res.json()
        }
    } catch (err) {
        console.error("Error fetching all jobs:", err)
    }
    finally {
        isLoading.value = false;
    }
})


watch(() => route.params.id, async (newId) => {
    isLoading.value = true;
    await fetchJob(newId);
    isLoading.value = false;
})

const relatedJobs = computed(() => {
    if (!job.value) return []
    return allJobs.value
        .filter(j => j.jobCategory === job.value.jobCategory && j._id !== job.value._id)
        .slice(0, 5)
})

const handleApply = async () => {
    try {
        const token = localStorage.getItem('token')


        if (!token) {
            alert("You need to be logged in to apply.");
            router.push({ name: 'Login' });
            return;
        }

        const res = await fetch(`${baseURL}/applications/check/${job.value._id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            const errorText = await res.text();
            console.error('Server responded with:', errorText);
            throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        if (data.alreadyApplied) {
            hasApplied.value = true;
            showModal.value = true;  
        } else {
            hasApplied.value = false;
            router.push({ name: 'JobApplication', params: { id: job.value._id } })
        }
    } catch (err) {
        console.error("Error checking application status:", err);
        alert("Failed to check application status. Please try again later.");
    }
};


const handleClick = (jobId) => {
    router.push({ component: 'JobDetails', params: { id: jobId } })
}
</script>

<template>
    <div>
        <div v-if="isLoading" class="flex justify-center items-center min-h-[60vh]">
            <div class="flex items-center gap-4">
                <svg class="animate-spin h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span class="text-lg text-gray-500">Loading job details...</span>
            </div>
        </div>

        <div v-else class="max-w-7xl mx-auto mt-6 px-2 sm:px-4 lg:px-8">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

                <div class="lg:col-span-2">
                    <div v-if="job"
                        class="bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-2xl rounded-3xl p-6 sm:p-10 space-y-8 transition hover:scale-[1.01]">
                        <h2
                            class="text-3xl sm:text-4xl font-extrabold text-green-700 dark:text-green-300 break-words drop-shadow-lg">
                            {{ job.jobTitle }}
                        </h2>

                        <div>
                            <h3
                                class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b-green-500 border-b-4 pb-2">
                                Job Details
                            </h3>
                            <div
                                class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300 text-base">
                                <p>
                                    <font-awesome-icon icon="info-circle" class="text-blue-600 mr-2" />
                                    <strong>Description:</strong>
                                    <span class="ml-1">{{ job.jobDetails }}</span>
                                </p>
                                <p>
                                    <font-awesome-icon icon="briefcase" class="text-blue-600 mr-2" />
                                    <strong>Category:</strong>
                                    <span class="ml-1">{{ job.jobCategory }}</span>
                                </p>
                                <p>
                                    <font-awesome-icon icon="clock" class="text-blue-600 mr-2" />
                                    <strong>Type:</strong>
                                    <span class="ml-1">{{ job.jobType }}</span>
                                </p>
                                <p>
                                    <font-awesome-icon icon="clock" class="text-blue-600 mr-2" />
                                    <strong>Experience:</strong>
                                    <span class="ml-1">{{ job.experience }}</span>
                                </p>
                                <p>
                                    <font-awesome-icon icon="money-bill" class="text-green-600 mr-2" />
                                    <strong>Salary:</strong>
                                    <span class="ml-1">
                                        {{ job.salary && typeof job.salary === 'object'
                                        ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} `
                                        : job.salary }} &#8377; /month
                                    </span>
                                </p>
                                <p>
                                    <font-awesome-icon icon="users" class="text-purple-600 mr-2" />
                                    <strong>Vacancy:</strong>
                                    <span class="ml-1">{{ job.vacancy }}</span>
                                </p>
                            </div>
                        </div>

                        <div class="mt-12">
                            <h3
                                class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b-green-500 border-b-4 pb-2">
                                Employer Details
                            </h3>
                            <div
                                class="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300 text-base">
                                <p>
                                    <font-awesome-icon icon="building" class="text-yellow-600 mr-2" />
                                    <strong>Name:</strong>
                                    <span class="ml-1">{{ job.company.companyName }}</span>
                                </p>
                                <p>
                                    <font-awesome-icon icon="map-marker-alt" class="text-orange-500 mr-2" />
                                    <strong>Location:</strong>
                                    <span class="ml-1">{{ job.company.location }}</span>
                                </p>
                                <p>
                                    <font-awesome-icon icon="building" class="text-yellow-600 mr-2" />
                                    <strong>Details:</strong>
                                    <span class="ml-1">{{ job.company.companyDetails }}</span>
                                </p>
                                <p>
                                    <font-awesome-icon icon="envelope" class="text-red-500 mr-2" />
                                    <strong>Email:</strong>
                                    <span class="ml-1">{{ job.company.contactEmail }}</span>
                                </p>
                                <p>
                                    <font-awesome-icon icon="phone" class="text-green-500 mr-2" />
                                    <strong>Contact:</strong>
                                    <span class="ml-1">{{ job.company.contactPhone }}</span>
                                </p>
                            </div>
                        </div>

                        <div class="flex justify-end mt-8">
                            <button @click="handleApply"
                                class="bg-gradient-to-r from-green-400 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold px-8 py-3 rounded-full shadow-xl transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300">
                                <font-awesome-icon icon="check-circle" class="mr-2" />Apply Now
                            </button>
                        </div>
                    </div>
                </div>

                <div>
                    <div
                        class="bg-gradient-to-br from-white via-green-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-xl rounded-3xl p-4 sm:p-6">
                        <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white text-center">Related Jobs</h3>
                        <div v-if="relatedJobs.length" class="grid gap-4">
                            <div v-for="related in relatedJobs" :key="related._id"
                                class="border border-green-200 dark:border-green-700 rounded-2xl p-4 hover:shadow-2xl hover:border-blue-400 dark:hover:border-blue-400 transition cursor-pointer flex flex-col gap-2 bg-white dark:bg-gray-900 group"
                                @click="handleClick(related._id)">
                                <h4
                                    class="font-semibold text-lg text-green-700 dark:text-green-400 truncate group-hover:underline">
                                    {{ related.jobTitle }}
                                </h4>
                                <p class="text-gray-800 dark:text-gray-300 text-sm truncate">
                                    {{ related.company?.companyName }}
                                </p>
                                <p class="text-gray-800 dark:text-gray-300 text-sm">
                                    {{ related.salary && typeof related.salary === 'object'
                                    ? `${related.salary.min.toLocaleString()} - ${related.salary.max.toLocaleString()} `
                                    : related.salary }} &#8377; /month
                                </p>
                                <p class="text-gray-800 dark:text-gray-400 text-xs">
                                    {{ related.jobType }} | {{ related.company?.location }}
                                </p>
                                <button @click.stop="handleClick(related._id)"
                                    class="mt-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-1 rounded-full shadow transition font-semibold self-end">
                                    Details
                                </button>
                            </div>
                        </div>
                        <div v-else class="text-gray-800 dark:text-gray-400 text-center py-8">
                            No related jobs found.
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showModal && hasApplied"
            class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div
                class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md w-full text-center space-y-4 border-2 border-red-200 dark:border-red-700">
                <h2 class="text-red-600 dark:text-red-400 text-2xl font-bold">
                    Already Applied
                </h2>
                <p class="text-gray-700 dark:text-gray-300">
                    You have already applied for this job.
                </p>
                <button @click="showModal = false"
                    class="mt-4 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-2 rounded-full shadow-lg transition font-bold">
                    OK
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 640px) {
    .rounded-3xl {
        border-radius: 1.25rem !important;
    }

    .p-6,
    .sm\:p-10 {
        padding: 1.25rem !important;
    }
}
</style>
