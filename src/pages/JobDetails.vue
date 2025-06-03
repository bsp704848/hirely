<script setup>
import { useJobStore } from '../stores/jobStore'
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const baseURL = import.meta.env.VITE_API_BASE_URL
const jobStore = useJobStore()
const route = useRoute()

const job = computed(() => jobStore.selectedJob)
const showModal = ref(false)
const applied = ref(false)

onMounted(async () => {
    const jobId = route.params.id
    try {
        const res = await fetch(`${baseURL}/jobs/${jobId}`)
        if (!res.ok) throw new Error("Failed to fetch job")
        const data = await res.json()
        jobStore.setSelectedJob(data)
    } catch (err) {
        console.error("Error fetching job:", err)
    }
})

const handleApply = () => {
    applied.value = jobStore.applyForJob(jobStore.selectedJob)
    showModal.value = true
}
</script>

<template>
    <div v-if="job" class="max-w-4xl mx-auto mt-6 px-4 sm:px-6 lg:px-8">
        <!-- Job Header -->
        <div class="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-6 space-y-6 transition hover:scale-[1.01]">
            <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white">
                {{ job.jobTitle }}
            </h2>

            <!-- Job Details Section -->
            <div>
                <h3
                    class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b-green-500 border-b-4 pb-2">
                    Job Details</h3>
                <div class="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300 text-base">
                    <p><font-awesome-icon icon="info-circle" class="text-blue-600 mr-2" /> <strong>Description:</strong>
                        {{ job.jobDetails }}</p>
                    <p><font-awesome-icon icon="briefcase" class="text-blue-600 mr-2" /> <strong>Category:</strong> {{
                        job.jobCategory }}</p>
                    <p><font-awesome-icon icon="clock" class="text-blue-600 mr-2" /> <strong>Type:</strong> {{
                        job.jobType }}</p>
                    <p><font-awesome-icon icon="clock" class="text-blue-600 mr-2" /> <strong>Experience:</strong> {{
                        job.experience }}</p>
                    <p>
                        <font-awesome-icon icon="money-bill" class="text-green-600 mr-2" />
                        <strong>Salary:</strong>
                        {{ job.salary && typeof job.salary === 'object'
                        ? `${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()}`
                        : job.salary }}
                    </p>
                    <p><font-awesome-icon icon="users" class="text-purple-600 mr-2" /> <strong>Vacancy:</strong> {{
                        job.vacancy }}</p>
                </div>
            </div>

            <!-- Company Details Section -->
            <div class="mt-16">
                <h3
                    class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 border-b-green-500 border-b-4 pb-2">
                    Company Details
                </h3>
                <div class="grid md:grid-cols-2 gap-6 text-gray-700 dark:text-gray-300 text-base">
                    <p><font-awesome-icon icon="building" class="text-yellow-600 mr-2" /> <strong>Name:</strong> {{
                        job.company.companyName }}</p>
                    <p><font-awesome-icon icon="map-marker-alt" class="text-orange-500 mr-2" />
                        <strong>Location:</strong> {{ job.company.location }}
                    </p>
                    <p><font-awesome-icon icon="building" class="text-yellow-600 mr-2" /> <strong>Details:</strong> {{
                        job.company.companyDetails }}</p>
                    <p><font-awesome-icon icon="envelope" class="text-red-500 mr-2" /> <strong>Email:</strong> {{
                        job.company.contactEmail }}</p>
                    <p><font-awesome-icon icon="phone" class="text-green-500 mr-2" /> <strong>Contact:</strong> {{
                        job.company.contactPhone }}</p>
                </div>
            </div>

            <!-- Apply Button -->
            <div class="text-right mt-8">
                <button @click="handleApply"
                    class="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full shadow-md transition duration-300">
                    <font-awesome-icon icon="check-circle" class="mr-2" />Apply Now
                </button>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl max-w-md w-full text-center space-y-4">
            <h2 :class="applied ? 'text-green-600' : 'text-red-600'" class="text-2xl font-bold">
                {{ applied ? 'Congratulations!' : 'Already Applied' }}
            </h2>
            <p class="text-gray-700 dark:text-gray-300">
                {{ applied ? 'Your application has been submitted. The employer will contact you shortly.' :
                'You have already applied for this job.' }}
            </p>
            <button @click="showModal = false"
                class="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition">
                OK
            </button>
        </div>
    </div>
</template>
