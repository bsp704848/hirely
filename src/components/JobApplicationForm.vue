<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useApplicationStore } from '../stores/applicationStore'
import { useAuthStore } from '../stores/authStore'
import { useJobStore } from '../stores/jobStore'
import { useToast } from 'vue-toastification'
import Lottieplayer from './LottiePlayer.vue'
import applicationAnimation from '../assets/jobapplication.json'

const baseURL = import.meta.env.VITE_API_BASE_URL

const applicationStore = useApplicationStore()
const authStore = useAuthStore()
const jobStore = useJobStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const form = ref({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    position: '',
    employerName: '',
    startDate: '',
    hearAbout: '',
    coverLetter: '',
    resume: null,
})

function handleFile(e) {
    form.value.resume = e.target.files[0]
}

onMounted(async () => {
    if (!jobStore.selectedJob && route.params.id) {
        try {
            const res = await fetch(`${baseURL}/jobs/${route.params.id}`)
            if (res.ok) {
                const data = await res.json()
                jobStore.setSelectedJob(data)
            }
        } catch (err) {
            console.error('Failed to fetch job for application form:', err)
        }
    }
    if (authStore.user) {
        form.value.name = authStore.user.username || ''
        form.value.email = authStore.user.email || ''
    }
})


watch(
    () => jobStore.selectedJob,
    (job) => {
        if (job) {
            form.value.position = job._id || ''
            form.value.employerName = job.company?.companyName || ''
        } else {
            form.value.position = ''
            form.value.employerName = ''
        }
    },
    { immediate: true }
)

const errors = ref({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    email: '',
    zip: '',
    birthdate: '',
})


function isAtLeast18(birthdate) {
    if (!birthdate) return false
    const today = new Date()
    const dob = new Date(birthdate)
    let age = today.getFullYear() - dob.getFullYear()
    const m = today.getMonth() - dob.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--
    }
    return age >= 18
}

function validateBirthdate(e) {
    const value = e.target.value
    if (!isAtLeast18(value)) {
        errors.value.birthdate = 'You must be at least 18 years old to apply.'
    } else {
        errors.value.birthdate = ''
    }
}

const phonePattern = /^\d{10}$/
const zipPattern = /^[1-9][0-9]{5}$/


function validatePhone(e) {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 10) value = value.slice(0, 10)
    form.value.phone = value
    e.target.value = value
    if (!phonePattern.test(value)) {
        errors.value.phone = 'Enter valid 10 digit number'
    } else {
        errors.value.phone = ''
    }
}

function validateEmail(e) {
    const value = e.target.value
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    errors.value.email = emailPattern.test(value) ? '' : 'Invalid email address'
}


function validateTextInput(e, field) {
    const value = e.target.value
    if (!/^[A-Za-z\s]*$/.test(value)) {
        errors.value[field] = 'Only letters allowed'
        e.target.value = value.replace(/[^A-Za-z\s]/g, '')
        form.value[field] = e.target.value
    } else {
        errors.value[field] = ''
    }
}

function validateZip(e) {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    form.value.zip = value
    e.target.value = value
    if (!zipPattern.test(value)) {
        errors.value.zip = 'Enter valid 6 digit zip code'
    } else {
        errors.value.zip = ''
    }
}

async function submitForm() {

    if (!isAtLeast18(form.value.birthdate)) {
        errors.value.birthdate = 'You must be at least 18 years old to apply.'
        toast.error(errors.value.birthdate)
        return
    }
    try {
        await applicationStore.submitApplication(form.value, localStorage.getItem('token'))
        toast.success('Application submitted!')
        form.value = {
            name: '',
            email: '',
            phone: '',
            birthdate: '',
            address: '',
            city: '',
            state: '',
            zip: '',
            position: '',
            employerName: '',
            startDate: '',
            hearAbout: '',
            coverLetter: '',
            resume: null,
        }
        setTimeout(() => {
            router.push({ name: 'AppliedJobs' })
        }, 1000)
    } catch (err) {
        toast.error(applicationStore.error || 'Failed to submit application.')
    }
}
</script>

<template>
    <section
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 py-8 px-2 sm:py-12 sm:px-4">
        <div
            class="flex flex-col lg:flex-row items-stretch max-w-full w-full mx-auto  backdrop-blur-lg  overflow-hidden">

            <div
                class="flex flex-col justify-center items-center w-full lg:w-[48%] bg-gradient-to-br from-green-100 via-white to-green-100 p-8 lg:p-12">
                <div class="flex justify-center items-center w-full mb-6">
                </div>
                <h2 class="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 text-center leading-tight">
                    <span class="text-green-500">Create</span> Your Application
                </h2>
                <p class="text-gray-600 mb-8 text-lg text-center max-w-md">
                    Fill out the form to apply for a new job listing. Provide details like full name, email, position,
                    and employer.
                </p>
                <div class="mx-auto w-full lottie-center" style="max-width: 320px;">
                    <Lottieplayer :animationData="applicationAnimation" />
                </div>
            </div>


            <div class="flex flex-col justify-center w-full lg:w-[52%] p-6 sm:p-10">
                <form @submit.prevent="submitForm" class="w-full max-w-3xl mx-auto  p-4 sm:p-6 md:p-8 space-y-6 ">
                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white text-center">
                        Job <span class="text-green-500">Application</span> Form
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-10">

                        <div>
                            <label for="name" class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Full
                                Name</label>
                            <input id="name" v-model="form.name" type="text" required
                                @input="e => validateTextInput(e, 'name')"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" />
                            <span v-if="errors.name" class="text-red-500 text-xs">{{ errors.name }}</span>
                        </div>
                        <div>
                            <label for="email" class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Email
                                Address</label>
                            <input id="email" v-model="form.email" type="email" required @input="validateEmail"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" />
                            <span v-if="errors.email" class="text-red-500 text-xs">{{ errors.email }}</span>
                        </div>
                        <div>
                            <label for="phone" class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Phone
                                Number</label>
                            <input id="phone" v-model="form.phone" type="tel" required maxlength="10" pattern="\d{10}"
                                @input="validatePhone"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" />
                            <span v-if="errors.phone" class="text-red-500 text-xs">{{ errors.phone }}</span>
                        </div>
                        <div>
                            <label for="birthdate" class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Birth
                                Date</label>
                            <input id="birthdate" v-model="form.birthdate" type="date" required
                                @input="validateBirthdate"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" />
                            <span v-if="errors.birthdate" class="text-red-500 text-xs">{{ errors.birthdate }}</span>
                        </div>
                        <div>
                            <label for="address" class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Street
                                Address</label>
                            <input id="address" v-model="form.address" type="text" required
                                @input="e => validateTextInput(e, 'address')"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" />
                            <span v-if="errors.address" class="text-red-500 text-xs">{{ errors.address }}</span>
                        </div>
                        <div>
                            <label for="city"
                                class="block mb-1 font-medium text-gray-700 dark:text-gray-200">City</label>
                            <input id="city" v-model="form.city" type="text" required
                                @input="e => validateTextInput(e, 'city')"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" />
                            <span v-if="errors.city" class="text-red-500 text-xs">{{ errors.city }}</span>
                        </div>
                        <div>
                            <label for="state"
                                class="block mb-1 font-medium text-gray-700 dark:text-gray-200">State</label>
                            <input id="state" v-model="form.state" type="text" required
                                @input="e => validateTextInput(e, 'state')"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" />
                            <span v-if="errors.state" class="text-red-500 text-xs">{{ errors.state }}</span>
                        </div>
                        <div>
                            <label for="zip" class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Zip
                                Code</label>
                            <input id="zip" v-model="form.zip" type="text" required maxlength="6" @input="validateZip"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" />
                            <span v-if="errors.zip" class="text-red-500 text-xs">{{ errors.zip }}</span>
                        </div>
                        <div>
                            <label for="position"
                                class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Position Applied
                                For</label>
                            <input id="position" :value="jobStore.selectedJob?.jobTitle || ''" type="text" required
                                readonly
                                class="w-full px-4 py-2 rounded-lg border bg-gray-100 focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label for="employername"
                                class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Employer Name</label>
                            <input id="employername" v-model="form.employerName" type="text" required readonly
                                class="w-full px-4 py-2 rounded-lg border bg-gray-100 focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label for="startDate"
                                class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Available Start
                                Date</label>
                            <input id="startDate" v-model="form.startDate" type="date" required
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" />
                        </div>
                        <div>
                            <label for="hearAbout" class="block mb-1 font-medium text-gray-700 dark:text-gray-200">How
                                did you hear about us?</label>
                            <select id="hearAbout" v-model="form.hearAbout" required
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500">
                                <option value="" disabled selected>Select an option</option>
                                <option value="LinkedIn">LinkedIn</option>
                                <option value="Indeed">Indeed</option>
                                <option value="Company Website">Company Website</option>
                                <option value="Referral">Referral</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div class="md:col-span-2">
                            <label for="resume" class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Upload
                                Resume</label>
                            <input id="resume" type="file" @change="handleFile"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-green-600 file:text-white file:rounded file:cursor-pointer" />
                        </div>
                        <div class="md:col-span-2">
                            <label for="coverLetter"
                                class="block mb-1 font-medium text-gray-700 dark:text-gray-200">Cover Letter</label>
                            <textarea id="coverLetter" v-model="form.coverLetter" rows="5" required
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                                placeholder="Write your cover letter here..."></textarea>
                        </div>
                    </div>
                    <button type="submit"
                        :disabled="!form.position || !form.employerName || applicationStore.isSubmitting"
                        class="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 rounded-xl transition text-lg shadow-md">
                        Submit Application
                    </button>
                </form>
            </div>
        </div>
    </section>
</template>

<style scoped>
@media (max-width: 640px) {
    .lottie-center {
        margin-left: auto !important;
        margin-right: auto !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        width: 100% !important;
        max-width: 320px !important;
    }
}
</style>
