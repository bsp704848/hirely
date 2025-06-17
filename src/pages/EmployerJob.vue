<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import JobForm from '../components/JobForm.vue'

const baseURL = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const router = useRouter()

const jobId = route.params.id
const job = ref(null)
const isLoading = ref(true)

onMounted(async () => {
    try {
        const res = await fetch(`${baseURL}/jobs/${jobId}`)
        const data = await res.json()

        if (data && typeof data === 'object') {
            job.value = data
        } else {
            console.warn("Unexpected API response format", data)
        }
    } catch (err) {
        console.error("Failed to fetch job details", err)
    } finally {
        isLoading.value = false
    }
})

function handleUpdate(updatedJob) {
    fetch(`${baseURL}/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedJob)
    })
        .then(() => {
            router.push('/EmployerJobspage')
        })
        .catch(console.error)
}
</script>

<template>
    <div class="p-4">
        <div v-if="isLoading" class="text-center">
            <svg class="animate-spin h-8 w-8 text-green-500 mr-3" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
            <span class="text-lg text-gray-500">Loading...</span>
        </div>
        <div v-else>
            <h2 class="text-4xl font-bold mb-4 text-center"><span class="text-green-500">Update</span> Job Details</h2>
            <JobForm :initialData="job" mode="edit" @update="handleUpdate" />
        </div>
    </div>
</template>