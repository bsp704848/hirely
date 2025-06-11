<script setup>

import { ref, onMounted } from 'vue'
const emit = defineEmits(['edit', 'delete'])

const props = defineProps({
    jobs: {
        type: Array,
        required: true
    }
})
const isLoading = ref(true)

onMounted(() => {
  isLoading.value = false
})


</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-800 py-6 px-4 sm:px-6 lg:px-8">
        <div v-if="isLoading" class="text-center">
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300">Loading jobs...</p>
        </div>
        <div v-else-if="jobs.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="job in props.jobs" :key="job.id"
                class="bg-white dark:bg-gray-900 dark:text-white dark:border-gray-700 rounded-tl-3xl rounded-br-3xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] p-6 border-r-8 border-b-8 border-t-2 border-l-2 border-transparent hover:border-sky-500 
                ">
                <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Job Title : {{ job.jobTitle }}</h2>
                <p><span class="font-semibold text-gray-700 dark:text-gray-300">Category:</span> {{ job.jobCategory }}
                </p>
                <p><span class="font-semibold text-gray-700 dark:text-gray-300">Type:</span> {{ job.jobType }}</p>
                <p><span class="font-semibold text-gray-700 dark:text-gray-300">Details:</span> {{ job.jobDetails }}</p>
                <p><span class="font-semibold text-gray-700 dark:text-gray-300">Salary:</span> {{ job.salary.min }} - {{
                    job.salary.max }} &#8377; /month</p>
                <p><span class="font-semibold text-gray-700 dark:text-gray-300">Experience:</span> {{ job.experience }}
                </p>
                <p><span class="font-semibold text-gray-700 dark:text-gray-300">Vacancy:</span> {{ job.vacancy }}</p>
                <p><span class="font-semibold text-gray-700 dark:text-gray-300">Employer Name:</span> {{
                    job.company.companyName }}</p>
                <p><span class="font-semibold text-gray-700 dark:text-gray-300">Location:</span> {{ job.company.location
                    }}</p>
                <p><span class="font-semibold text-gray-700 dark:text-gray-300">Details:</span> {{
                    job.company.companyDetails }}</p>
                <p><span class="font-semibold text-gray-700 dark:text-gray-300">Email:</span> {{
                    job.company.contactEmail }}</p>
                <p><span class="font-semibold text-gray-700 dark:text-gray-300">Contact:</span> {{
                    job.company.contactPhone }}</p>

                <div class="flex gap-4 mt-4">
                    <button @click="$emit('edit', job)"
                        class="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-4 py-2 rounded-lg transition"><font-awesome-icon
                            icon="pen-to-square" /></button>
                    <button @click="$emit('delete', job.id)"
                        class="text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-4 py-2 rounded-lg transition"><font-awesome-icon
                            icon="trash" /></button>
                </div>
            </div>
        </div>
        <div v-else class="text-center">
            <p class="text-lg font-medium text-gray-700 dark:text-gray-300">No jobs found for this employer.</p>
        </div>
    </div>
</template>
