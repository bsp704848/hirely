import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL

export const useJobStore = defineStore('jobStore', () => {
  const jobs = ref([])
  const selectedJob = ref(null)
  const appliedJobs = ref(JSON.parse(localStorage.getItem('appliedJobs')) || [])
  const isLoading = ref(false)

  async function fetchJobs(data) {
    try {
      isLoading.value = true
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${baseURL}/jobs`,
        {
          params: data,
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
          withCredentials: true
        }
      )
      jobs.value = response.data
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function saveJob(data) {
    try {
      isLoading.value = true
      const token = localStorage.getItem('token') 
      const response = await axios.post(
        `${baseURL}/jobs/add`,
        data,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true 
        }
      )
      jobs.value.push(response.data.job)
      return response.data.job
    } catch (error) {
      console.error('Error saving job:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function updateJob(jobId, data) {
    try {
      isLoading.value = true
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${baseURL}/jobs/${jobId}`,
        data,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        }
      )

      return response.data
    } catch (error) {
      console.error('Error updating job:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function deleteJob(jobId) {
    try {
      isLoading.value = true
      const token = localStorage.getItem('token')
      const response = await axios.delete(
        `${baseURL}/jobs/${jobId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        }
      )
      // handle response...
      return response.data
    } catch (error) {
      console.error('Error deleting job:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function setSelectedJob(job) {
    selectedJob.value = job
  }

  function applyForJob(job) {
    const alreadyApplied = appliedJobs.value.some(j => j._id === job._id)
    if (!alreadyApplied) {
      appliedJobs.value.push(job)
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs.value))
      return true
    }
    return false
  }

  return {
    jobs,
    saveJob,
    selectedJob,
    setSelectedJob,
    appliedJobs,
    applyForJob,
    fetchJobs,
    isLoading,
    updateJob,
    deleteJob
  }
})
