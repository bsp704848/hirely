import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useJobStore = defineStore('jobStore', () => {
  const jobForm = ref(Array.isArray(JSON.parse(localStorage.getItem('jobForm'))) ? JSON.parse(localStorage.getItem('jobForm')) : []);
  const selectedJob = ref(JSON.parse(localStorage.getItem('selectedJob')) || null)
  const appliedJobs = ref(JSON.parse(localStorage.getItem('appliedJobs')) || [])

  function saveJob(data) {
    jobForm.value.push(data)
    localStorage.setItem('jobForm', JSON.stringify(jobForm.value))
  }


  function setSelectedJob(job) {
    selectedJob.value = job
    localStorage.setItem('selectedJob', JSON.stringify(job)) 
  } 


  function applyForJob(job) {
    const alreadyApplied = appliedJobs.value.some(j => j.id === job.id)

    if (!alreadyApplied) {
      appliedJobs.value.push(job)
      localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs.value))
      return true 
    }
    return false 
  }

  return {
    jobForm,
    saveJob,
    selectedJob,
    setSelectedJob,    
    appliedJobs,
    applyForJob,
  }
})
