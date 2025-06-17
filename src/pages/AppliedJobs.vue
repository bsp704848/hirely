<script setup>
import { onMounted, computed,ref } from 'vue'
import { useJobStore } from '../stores/jobStore'

const jobStore = useJobStore()
const isLoading = ref(true);

onMounted(async () => {
    isLoading.value = true
    await jobStore.fetchAppliedJobs()
    isLoading.value = false
})


const appliedJobs = computed(() => jobStore.appliedJobs)

</script>

<template>
    <div class="max-w-5xl mx-auto mt-10 px-2 sm:px-6 lg:px-8">
        <h1
            class="text-4xl sm:text-5xl text-center font-extrabold mb-10 text-gradient bg-gradient-to-r from-green-400 via-green-400 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
            Applied Jobs
        </h1>

        <div v-if="isLoading" class="flex justify-center items-center h-[300px]">
            <div class="flex items-center gap-3">
                <svg class="animate-spin h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                <span class="text-lg text-gray-500">Loading...</span>
            </div>
        </div>

        <div v-else-if="appliedJobs.length" class="space-y-8">
            <div v-for="application in appliedJobs" :key="application._id"
                class="rounded-3xl border border-green-200 dark:border-gray-700 shadow-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between hover:scale-[1.02] transition-transform duration-300 group">
                <div class="flex-1">
                    <h2
                        class="text-lg sm:text-xl font-bold text-green-700 dark:text-green-300 mb-2 flex items-center gap-2">
                        <span
                            class=" bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full text-green-600 dark:text-green-200 font-semibold shadow">
                            {{ application.position?.jobTitle || 'Position' }}
                        </span>
                    </h2>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-2">
                        <p class="text-gray-800 dark:text-gray-200 font-semibold">
                            <span class="text-blue-500 font-bold">Employer:</span>
                            <span class="ml-1 font-medium">
                                {{ application.employerName || application.company?.companyName ||
                                application.companyName || 'Company' }}
                            </span>
                        </p>
                        <p class="text-gray-700 dark:text-gray-200 font-semibold">
                            <span class="text-yellow-500 font-bold">Applied:</span>
                            <span class="ml-1 font-medium">{{ new Date(application.createdAt).toLocaleDateString()
                                }}</span>
                        </p>
                    </div>
                </div>

                <div class="flex items-center gap-2 mt-4">
                    <span
                        :class="['px-2 py-1 rounded-full text-xs font-bold', application.status === 'applied' ? 'bg-blue-200 text-blue-800' : 'bg-gray-200']">Applied</span>
                    <span>→</span>
                    <span
                        :class="['px-2 py-1 rounded-full text-xs font-bold', application.status === 'interview' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200']">Interview</span>
                    <span>→</span>
                    <span
                        :class="['px-2 py-1 rounded-full text-xs font-bold', application.status === 'selected' ? 'bg-green-200 text-green-800' : 'bg-gray-200']">Selected</span>
                    <span>→</span>
                    <span
                        :class="['px-2 py-1 rounded-full text-xs font-bold', application.status === 'rejected' ? 'bg-red-200 text-red-800' : 'bg-gray-200']">Rejected</span>
                </div>
            </div>
        </div>


        <div v-else
            class="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 text-center py-16">
            <svg class="w-16 h-16 mb-4 text-green-200 dark:text-gray-700" fill="none" stroke="currentColor"
                stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path>
            </svg>
            <span class="text-xl font-semibold">You have not applied to any jobs yet.</span>
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
