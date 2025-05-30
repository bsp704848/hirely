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
    return jobId ? list.find(j => String(j.id) === String(jobId)) : null
})



</script>


<template>
    <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-4 ">
            <div v-if="selectedJob"
                class="bg-white dark:bg-gray-900 dark:text-white border rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.01] transform transition-transform duration-300 ease-in-out p-6 w-full max-w-[500px] mx-auto">
                <h2 class="sm:text-sm mb-2 break-words">
                    <span class="text-gray-900 dark:text-gray-300" style="font-size:medium; font-weight: bold;">Title :
                    </span>
                    {{ selectedJob?.title }}
                </h2>

                <p class="text-sm sm:text-sm mb-2 break-words">
                    <span class="text-gray-900 dark:text-gray-300" style="font-size:medium; font-weight: bold;">Details
                        : </span>
                    {{ selectedJob?.description }}
                </p>
                <p class="text-sm sm:text-sm mb-2 break-words">
                    <span class="font-bold text-gray-900 dark:text-gray-300"
                        style="font-size:medium; font-weight: bold;">Salary : </span>
                    {{ selectedJob?.salary }}
                </p>
                <p class="text-sm sm:text-sm mb-2 break-words">
                    <span class="font-bold text-gray-900 dark:text-gray-300"
                        style="font-size:medium; font-weight: bold;">Experience : </span>
                    {{ selectedJob?.experience }}
                </p>

                <p class="text-sm sm:text-sm mb-2 break-words">
                    <span class="font-bold text-gray-900 dark:text-gray-300"
                        style="font-size:medium; font-weight: bold;">Employer : </span>
                    {{ selectedJob?.company.name }}
                </p>

                <p class="text-sm sm:text-sm mb-2 break-words">
                    <span class="font-bold text-gray-900 dark:text-gray-300"
                        style="font-size:medium; font-weight: bold;">Location : </span>
                    {{ selectedJob?.location }}
                </p>

                <p class="text-sm sm:text-sm mb-3 break-words">
                    <span class="font-bold text-gray-900 dark:text-gray-300"
                        style="font-size:medium; font-weight: bold;">Contact : </span>
                    {{ selectedJob?.company.contactPhone }}
                </p>
                <p class="text-sm sm:text-sm mb-3 break-words">
                    <span class="font-bold text-gray-900 dark:text-gray-300"
                        style="font-size:medium; font-weight: bold;">Email : </span>
                    {{ selectedJob?.company.contactEmail }}
                </p>

                <div class="flex gap-4 mt-3">
                    <button @click="$emit('edit', selectedJob)" class="text-blue-600 hover:text-blue-700 text-lg">
                        <font-awesome-icon icon="edit" />
                    </button>
                    <button @click="$emit('delete', selectedJob.id)" class="text-red-600 hover:text-red-700 text-lg">
                        <font-awesome-icon icon="trash" />
                    </button>
                </div>
            </div>
       


        <div v-else v-for="job in props.localJobs" :key="job.id"
            class="bg-white dark:bg-gray-900 dark:text-white border rounded-2xl shadow-md hover:shadow-2xl hover:scale-[1.01] transform transition-transform duration-300 ease-in-out p-6  w-full mx-auto">
            <h2 class="text-base sm:text-sm mb-2 break-words">
                <span class="font-bold text-gray-700 dark:text-gray-300">Title : </span> {{ job.title }}
            </h2>

            <p class="text-sm sm:text-sm mb-2 break-words">
                <span class="font-bold text-gray-700 dark:text-gray-300">Details : </span> {{ job.description }}
            </p>

            <p class="text-sm sm:text-sm mb-2 break-words">
                <span class="font-bold text-gray-700 dark:text-gray-300">Employer : </span> {{ job.company.name }}
            </p>

            <p class="text-sm sm:text-sm mb-2 break-words">
                <span class="font-bold text-gray-700 dark:text-gray-300">Location : </span> {{ job.location }}
            </p>

            <p class="text-sm sm:text-sm mb-3 break-words">
                <span class="font-bold text-gray-700 dark:text-gray-300">Contact : </span> {{
                job.company.contactPhone
                }}
            </p>

            <div class="flex gap-4 mt-3">
                <button @click="$emit('edit', job)" class="text-blue-600 hover:text-blue-700 text-lg">
                    <font-awesome-icon icon="edit" />
                </button>
                <button @click="$emit('delete', job.id)" class="text-red-600 hover:text-red-700 text-lg">
                    <font-awesome-icon icon="trash" />
                </button>
            </div>
        </div>


    </div>
</template>
  
