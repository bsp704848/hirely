<script setup>
import { onMounted,computed } from 'vue'
import { useJobStore } from '../stores/jobStore'


const jobStore = useJobStore()
const isLoading = computed(() => jobStore.isLoading)

const baseURL = import.meta.env.VITE_API_BASE_URL
const fileBaseURL = baseURL.replace('/api', '')

onMounted(async () => {
    await jobStore.fetchEmployerApplications()
})

const changeStatus = async (app, newStatus) => {
    try {
        await jobStore.updateApplicationStatus(app, newStatus)
    } catch (e) {
        alert('Failed to update status')
    }
}
</script>

<template>
    <div class="max-w-5xl mx-auto mt-10 px-2 sm:px-6 lg:px-8">
        <h1
            class="text-4xl sm:text-5xl text-center font-extrabold mb-10 text-gradient bg-gradient-to-r from-green-400 via-green-400 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
            Applications
        </h1>
        <div v-if="isLoading" class="flex justify-center items-center h-40">
            <svg class="animate-spin h-8 w-8 text-green-500 mr-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span class="text-lg text-gray-500">Loading...</span>
        </div>
        <div v-else-if="jobStore.employerApplications.length" class="space-y-10">
            <div v-for="app in jobStore.employerApplications" :key="app._id"
                class=" dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl border border-green-200 dark:border-gray-700 shadow-2xl p-8 flex flex-col md:flex-row md:items-center md:justify-between hover:scale-[1.015]  transition-all duration-300 group relative overflow-hidden">
                <div class="flex-1">
                    <h2 class="text-2xl font-bold text-green-700 dark:text-green-300 mb-4 flex items-center gap-2">
                        <span
                            class="inline-block dark:from-green-900 dark:via-blue-900 dark:to-green-900 px-4 py-2 rounded-full text-green-700 dark:text-green-200 text-sm font-semibold shadow">
                            {{ app.position?.jobTitle || 'Position' }}
                        </span>
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 mb-4">
                        <p class="text-gray-700 dark:text-gray-200 font-semibold">
                            <span class="text-green-500 font-bold">Name:</span>
                            <span class="ml-1 font-medium">{{ app.applicantName || app.name }}</span>
                        </p>
                        <p class="text-gray-700 dark:text-gray-200 font-semibold">
                            <span class="text-blue-500 font-bold">Email:</span>
                            <span class="ml-1 font-medium">{{ app.applicantEmail || app.email }}</span>
                        </p>
                        <p class="text-gray-700 dark:text-gray-200 font-semibold">
                            <span class="text-purple-500 font-bold">Contact:</span>
                            <span class="ml-1 font-medium">{{ app.applicantphone || app.phone }}</span>
                        </p>
                        <p class="text-gray-700 dark:text-gray-200 font-semibold">
                            <span class="text-yellow-500 font-bold">Applied:</span>
                            <span class="ml-1 font-medium">{{ new Date(app.createdAt).toLocaleDateString() }}</span>
                        </p>
                    </div>
                    <div class="flex items-center gap-4 mt-2">
                        <span class="text-gray-700 dark:text-gray-200 font-semibold">Resume:</span>
                        <a v-if="app.resume" :href="`${fileBaseURL}/uploads/${app.resume}`" target="_blank"
                            class="inline-flex items-center px-5 py-2 rounded-full border-2 border-transparent bg-green-400 text-white font-bold hover:bg-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" stroke-width="2"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
                            </svg>
                            View Resume
                        </a>
                        <span v-else class="text-gray-400 italic">No resume uploaded</span>
                    </div>
                    <div class="mt-6 flex items-center gap-4">
                        <label class="font-semibold mr-2 text-gray-700 dark:text-gray-200">Status:</label>
                        <span :class="[
                            'inline-block w-4 h-4 rounded-full mr-2 border-2 border-white shadow',
                            app.status === 'applied' ? 'bg-blue-400' :
                                app.status === 'interview' ? 'bg-yellow-400' :
                                    app.status === 'selected' ? 'bg-green-500' :
                                        app.status === 'rejected' ? 'bg-red-400' : 'bg-gray-300'
                        ]" aria-hidden="true"></span>
                        <select v-model="app.status" @change="changeStatus(app, app.status)"
                            class="rounded-lg border-2 border-green-300 dark:border-green-700 bg-white dark:bg-gray-800 px-4 py-2 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400 transition font-semibold shadow-sm">
                            <option value="applied">Applied</option>
                            <option value="interview">Interview</option>
                            <option value="selected">Selected</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
                <div
                    class="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-400 to-green-600 opacity-30 rounded-b-3xl">
                </div>
            </div>
        </div>
        <div v-else
            class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-center py-16">
            <svg class="w-16 h-16 mb-4 text-green-200 dark:text-gray-700" fill="none" stroke="currentColor"
                stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="text-xl font-semibold">No applications yet.</span>
        </div>
    </div>
</template>

<style scoped>
.text-gradient {
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}
</style>