<script setup>
import { ref, onMounted } from 'vue'
import EmployerJobList from '../components/EmployerJobList.vue'
import JobForm from '../components/JobForm.vue'
import { useToast } from 'vue-toastification';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const localJobs = ref([])
const editingJob = ref(null)
const showModal = ref(false)
const toast = useToast();

onMounted(async () => {
    try {
        const res = await fetch(`${baseURL}/jobs`)
        const data = await res.json()

        if (Array.isArray(data)) {
            localJobs.value = data
        } else {
            console.warn("Unexpected API response format", data)
        }
    } catch (err) {
        console.error("Failed to fetch jobs from API", err)
    }
})

function handleCreate(newJob) {
    localJobs.value.unshift(newJob)  
}


function handleEdit(job) {
    editingJob.value = { ...job }
    showModal.value = true
}

function handleDelete(id) {
    const jobToDelete = localJobs.value.find(job => job.id === id || job._id === id)
    if (!jobToDelete) return

    const confirmDelete = confirm(`Are you sure you want to delete the job "${jobToDelete.jobTitle}"?`)
    if (confirmDelete) {
        localJobs.value = localJobs.value.filter(job => job.id !== id && job._id !== id)
        fetch(`${baseURL}/jobs/${id}`, {
            method: 'DELETE'
        }).catch(console.error)
    }
}

function handleUpdate(updatedJob) {
    const index = localJobs.value.findIndex(job => job.id === updatedJob.id || job._id === updatedJob.id)
    if (index !== -1) {
        localJobs.value[index] = updatedJob
        toast.success("Job updated successfully!")
    }
        fetch(`${baseURL}/jobs/${updatedJob.id || updatedJob._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedJob)
        }).catch(console.error)

    showModal.value = false
}
</script>

<template>
    <div class="p-4">
        <EmployerJobList :localJobs="localJobs" @edit="handleEdit" @delete="handleDelete" />


        <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2">
            <div
                class="bg-white w-full max-w-5xl sm:rounded-lg shadow-lg relative overflow-y-auto max-h-[90vh] sm:p-6 p-4">
                <h2 class="text-xl font-bold mb-4">Edit Job</h2>
                <JobForm :initialData="editingJob" mode="edit" @update="handleUpdate" @create="handleCreate" />

                <button class="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl font-bold"
                    @click="showModal = false">×</button>
            </div>
        </div>
    </div>
</template>
