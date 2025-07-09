import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import socket from '../socket' 
import { initializeSocket } from '../socket'

const baseURL = import.meta.env.VITE_API_BASE_URL

export const useJobStore = defineStore('jobStore', () => {
  const jobs = ref([])
  const socketRef = ref(null)
  const selectedJob = ref(null)
  const appliedJobs = ref([]) 
  const employerApplications = ref([])
  const isLoading = ref(false) 

  async function initSocket() {
    socketRef.value = await initializeSocket()
  }

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
      jobs.value.unshift(response.data.job) 
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

      return response.data
    } catch (error) {
      console.error('Error deleting job:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function fetchEmployerJobs() {
    try {
      isLoading.value = true
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${baseURL}/jobs/employer/my-jobs`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        }
      )
      jobs.value = response.data
    } catch (error) {
      console.error('Error fetching employer jobs:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchAppliedJobs() {
    try {
      isLoading.value = true
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${baseURL}/applications/my`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        }
      )
      appliedJobs.value = response.data.applications || []
    } catch (error) {
      console.error('Error fetching applied jobs:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchEmployerApplications() {
    try {
      isLoading.value = true
      const token = localStorage.getItem('token')
      const response = await axios.get(
        `${baseURL}/jobs/employer/applications`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        }
      )
      employerApplications.value = response.data.applications || []
    } catch (error) {
      console.error('Error fetching employer applications:', error)
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

  async function updateApplicationStatus(application, newStatus) {
    try {
      isLoading.value = true
      const token = localStorage.getItem('token')
   
      const response = await axios.put(
        `${baseURL}/applications/${application._id}/status`,
        { status: newStatus },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true
        }
      )
      
      const updatedApp = response.data.application || { ...application, status: newStatus }

      
      const idx = employerApplications.value.findIndex(app => app._id === application._id)
      if (idx !== -1) {
        employerApplications.value.splice(idx, 1, updatedApp)
      }
    
      const idx2 = appliedJobs.value.findIndex(app => app._id === application._id)
      if (idx2 !== -1) {
        appliedJobs.value.splice(idx2, 1, updatedApp)
      }

      
      return response.data
    } catch (error) {
      console.error('Error updating application status:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  if (socketRef.value) {
    socketRef.value.on('applicationStatusUpdated', (updatedApp) => {
      const idx = employerApplications.value.findIndex(app => app._id === updatedApp._id)
      if (idx !== -1) {
        employerApplications.value.splice(idx, 1, updatedApp)
      }

      const idx2 = appliedJobs.value.findIndex(app => app._id === updatedApp._id)
      if (idx2 !== -1) {
        appliedJobs.value.splice(idx2, 1, updatedApp)
      }
    })
  }


  return {
    jobs,
    initSocket,
    saveJob,
    selectedJob,
    setSelectedJob,
    appliedJobs,
    employerApplications,
    applyForJob,
    fetchJobs,
    fetchEmployerJobs,
    fetchAppliedJobs, 
    fetchEmployerApplications,
    isLoading,
    updateJob,
    deleteJob,
    updateApplicationStatus
  }
})
