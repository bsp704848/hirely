import axios from 'axios'
import { defineStore } from 'pinia'
const baseURL = import.meta.env.VITE_API_BASE_URL

export const useApplicationStore = defineStore('application', {
    state: () => ({
        isSubmitting: false,
        error: null,
        success: false,
    }),
    actions: {
        async submitApplication(form, token) {
            this.isSubmitting = true
            this.error = null
            this.success = false
            try {
                const formData = new FormData()
                for (const key in form) {
                    if (form[key] !== null && form[key] !== undefined) {
                        formData.append(key, form[key])
                    }
                }
                const res = await axios.post(
                    `${baseURL}/applications/submit`,
                    formData,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        },
                        withCredentials: true
                    }
                )
                this.success = true
                return res.data
            } catch (err) {
                this.error = err.response?.data?.error || err.message
                throw err
            } finally {
                this.isSubmitting = false
            }
        }
    }
})