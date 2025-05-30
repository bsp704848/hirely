<script setup>
import { useJobStore } from '../stores/jobStore'
import { onMounted,ref } from 'vue'
import { useRoute } from 'vue-router'

const jobStore = useJobStore()
const route = useRoute()
const job = jobStore.selectedJob 

const showModal = ref(false)
const applied = ref(false)

onMounted(() => {
    const jobId = route.params.id
    const allJobs = JSON.parse(localStorage.getItem('allJobs')) || []
    const foundJob = allJobs.find(job => job.id == jobId)

    if (foundJob) {
        jobStore.setSelectedJob(foundJob)
    }
})

const handleApply = () => {
    applied.value = jobStore.applyForJob(jobStore.selectedJob) 
    showModal.value = true
}

</script>

<template>
    <div class="max-w-3xl mx-auto  border rounded-xl p-6 mt-4 shadow-lg hover:shadow-2xl hover:scale-[1.02] transform transition-transform
        ease-in-out bg-white dark:bg-gray-900 dark:text-white">


        <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ job?.title }}</h2>


        <p class="text-gray-700 mb-4">
            <span class="font-semibold text-gray-900"><i class="pi pi-info-circle text-indigo-600"
                    style="font-size:large"></i>
                Description:</span>
            {{ job?.description }}
        </p>


        <div class="space-y-2 text-sm text-gray-700">
            <p class="font-semibold"><i class="pi pi-map-marker mr-2 text-orange-400" style="font-size:large"></i><span
                    class="font-bold">Location:</span> {{
                job?.location }}</p>

            <p class="font-semibold"><i class="pi pi-bullseye mr-2 text-indigo-600" style="font-size:large"></i><span
                    class="font-bold">Type:</span> {{ job?.type }}
            </p>
            <p class="font-semibold"><i class="pi pi-bullseye mr-2 text-indigo-600" style="font-size:large"></i><span
                    class="font-bold">Experience:</span> {{ job?.experience }}
            </p>

            <p class="font-semibold"><i class="pi pi-indian-rupee mr-2 text-indigo-600"
                    style="font-size:large"></i><span class="
                    font-bold">Salary:</span> {{
                job?.salary }}</p>

            <p class="font-semibold"><i class="pi pi-building mr-2 text-indigo-600" style="font-size:large"></i><span
                    class="font-bold">Company:</span> {{
                job?.company?.name }}</p>

            <p class="font-semibold"><i class="pi pi-at mr-2 text-indigo-600" style="font-size:large"></i><span
                    class="font-bold">Email:</span> {{
                job?.company?.contactEmail }}</p>

            <p class="font-semibold"><i class="pi pi-phone mr-2 text-indigo-600" style="font-size:large"></i><span
                    class="font-bold">Contact:</span> {{
                job?.company?.contactPhone }}</p>
        </div>


        <div class="mt-6 text-right">
            <button @click="handleApply"
                class="bg-green-500 text-white px-5 py-2 rounded-xl shadow hover:bg-green-700 transition-all">
                <i class="pi pi-check-circle text-white"></i> Apply Now
            </button>
        </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div v-if="applied" class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <h2 class="text-2xl font-bold text-green-600 mb-4">Congratulations!</h2>
            <p class="text-gray-700 mb-4">Your application has been sent. The employer will contact you soon!</p>
            <button @click="showModal = false"
                class="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                OK
            </button>
        </div>
        <div v-else class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
            <h2 class="text-xl font-bold text-red-600 mb-4"> You have already applied for this job.</h2>
            <button @click="showModal = false"
                class="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">
                OK
            </button>
        </div>
    </div>

</template>
