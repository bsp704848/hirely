<script setup>
import { useRoute } from 'vue-router'
import { computed, unref } from 'vue'

const props = defineProps({
    localJobs: {
        type: Array,
        default: () => []
    }
})
const emit = defineEmits(['edit', 'delete'])

const route = useRoute()
const jobId = route.params.id

const selectedJob = computed(() => {

    const list = unref(props.localJobs)
    console.log("list", list);

    return jobId ? list.find(job => String(job._id) === String(jobId)) : null
})



</script>


<template>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
        <div v-if="selectedJob"
            class="bg-white dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01] p-6 w-full max-w-[600px] mx-auto">

            <!-- JOB DETAILS SECTION -->
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2">🧾 Job Details</h2>

            <div class="space-y-2">
                <p><span class="font-bold text-gray-700 dark:text-gray-300">Title:</span> {{ selectedJob?.jobTitle }}
                </p>
                <p><span class="font-bold text-gray-700 dark:text-gray-300">Category:</span> {{ selectedJob?.jobCategory
                    }}</p>
                <p><span class="font-bold text-gray-700 dark:text-gray-300">Job Type:</span> {{ selectedJob?.jobType }}
                </p>
                <p><span class="font-bold text-gray-700 dark:text-gray-300">Details:</span> {{ selectedJob?.jobDetails
                    }}</p>
                <p>
                    <span class="font-bold text-gray-700 dark:text-gray-300">Salary:</span>
                    {{ selectedJob && typeof selectedJob.salary === 'object'
                        ? `${selectedJob.salary.min.toLocaleString()} - ${selectedJob.salary.max.toLocaleString()}`
                        : selectedJob.salary }}
                </p>
                <p><span class="font-bold text-gray-700 dark:text-gray-300">Experience:</span> {{
                    selectedJob?.experience }}</p>
                <p><span class="font-bold text-gray-700 dark:text-gray-300">Vacancy:</span> {{ selectedJob?.vacancy }}
                </p>
            </div>

            <!-- DIVIDER -->
            <hr class="my-5 border-t border-gray-300 dark:border-gray-700" />

            <!-- COMPANY DETAILS SECTION -->
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 border-b pb-2">🏢 Company Details
            </h2>

            <div class="space-y-2">
                <p><span class="font-bold text-gray-700 dark:text-gray-300">Name:</span> {{
                    selectedJob?.company.companyName }}</p>
                <p><span class="font-bold text-gray-700 dark:text-gray-300">Description:</span> {{
                    selectedJob?.company.companyDetails }}</p>
                <p><span class="font-bold text-gray-700 dark:text-gray-300">Location:</span> {{
                    selectedJob?.company.location }}</p>
                <p><span class="font-bold text-gray-700 dark:text-gray-300">Phone:</span> {{
                    selectedJob?.company.contactPhone }}</p>
                <p><span class="font-bold text-gray-700 dark:text-gray-300">Email:</span> {{
                    selectedJob?.company.contactEmail }}</p>
            </div>

            <!-- ACTIONS -->
            <div class="flex gap-4 mt-6">
                <button @click="$emit('edit', selectedJob)"
                    class="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-4 py-2 rounded-lg transition">
                    <font-awesome-icon icon="edit" />
                    Edit
                </button>
                <button @click="$emit('delete', selectedJob.id)"
                    class="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-4 py-2 rounded-lg transition">
                    <font-awesome-icon icon="trash" />
                    Delete
                </button>
            </div>
        </div>

        <!-- MULTIPLE JOB LISTING VIEW -->
        <div v-else v-for="job in props.localJobs" :key="job._id || job.id"
            class="bg-white dark:bg-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl transform hover:scale-[1.01] transition p-6">

            <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {{ job.jobTitle }}
            </h2>

            <div class="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <p><span class="font-bold">Details:</span> {{ job.jobDetails }}</p>
                <p><span class="font-bold">Employer:</span> {{ job.company.companyName }}</p>
                <p><span class="font-bold">Location:</span> {{ job.company.location }}</p>
                <p><span class="font-bold">Contact:</span> {{ job.company.contactPhone }}</p>
            </div>

            <!-- ACTIONS -->
            <div class="flex gap-4 mt-4">
                <button @click="$emit('edit', job)"
                    class="flex items-center gap-2 text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 px-3 py-1.5 rounded-lg transition">
                    <font-awesome-icon icon="edit" />
                    Edit
                </button>
                <button @click="$emit('delete', job.id)"
                    class="flex items-center gap-2 text-red-600 hover:text-white hover:bg-red-600 border border-red-600 px-3 py-1.5 rounded-lg transition">
                    <font-awesome-icon icon="trash" />
                    Delete
                </button>
            </div>
        </div>
    </div>
</template>
  
