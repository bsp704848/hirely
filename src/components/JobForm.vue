<script setup>
import { reactive, watch, ref } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router'
import { useJobStore } from '../stores/jobStore';
const baseURL = import.meta.env.VITE_API_BASE_URL;
import postJobAnimation from '../assets/postJob.json'
import Lottieplayer from '../components/LottiePlayer.vue'
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();


const emit = defineEmits(['update', 'create']);
const props = defineProps({
    initialData: Object,
    mode: {
        type: String,
        default: 'add',
    },
});

const router = useRouter();

const form = reactive({
    jobCategory: { label: 'Select The Category', value: '' },
    jobType: { label: 'Full-Time', value: 'Full-Time' },
    jobTitle: '',
    jobDetails: '',
    salary: { label: 'Select Salary', value: null },
    experience: { label: 'Fresher', value: 'Fresher' },
    vacancy: '',
    company: {
        companyName: '',
        location: '',
        companyDetails: '',
        contactEmail: '',
        contactPhone: '',
    },
});

const categoryOptions = [
    { label: 'Select The Category', value: '' },
    { label: 'Software & Development', value: 'Software & Development' },
    { label: 'Engineering/Technical', value: 'Engineering / Technical' },
    { label: 'Business & Management', value: 'Business & Management' },
    { label: 'Sales & Marketing', value: 'Sales & Marketing' },
    { label: 'Accounting & Finance', value: 'Accounting & Finance' },
    { label: 'Healthcare & Pharmaceuticals', value: 'Healthcare & Pharmaceuticals' },
    { label: 'Education & Training', value: 'Education & Training' },
    { label: 'Design & Creative', value: 'Design & Creative' },
    { label: 'Writing & Content', value: 'Writing & Content' },
    { label: 'Customer Support/Call Center', value: 'Customer Support / BPO / Call Center' },
    { label: 'Logistics/Operations', value: 'Logistics / Operations' },
    { label: 'Other/General Labor', value: 'Other/General Labor' },
];

const jobTypeOptions = [
    { label: 'Full-Time', value: 'Full-Time' },
    { label: 'Part-Time', value: 'Part-Time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Remote', value: 'Remote' },
    { label: 'Internship', value: 'Internship' },
    { label: 'Freelance', value: 'Freelance' },
];

const experienceOptions = [
    { label: 'Fresher', value: 'Fresher' },
    { label: '1 to 2 yrs', value: '1 to 2 yrs' },
    { label: '3 to 4 yrs', value: '3 to 4 yrs' },
    { label: '5 to 6 yrs', value: '5 to 6 yrs' },
    { label: '7 to 8 yrs', value: '7 to 8 yrs' },
    { label: '9 to 10 yrs', value: '9 to 10 yrs' },
    { label: 'Up to 10 years', value: 'up to 10 years' },
];

const salaryOptions = [
    { label: '₹0 - ₹10K', value: { min: 0, max: 10000 } },
    { label: '₹10K - ₹20K', value: { min: 10000, max: 20000 } },
    { label: '₹20K - ₹30K', value: { min: 20000, max: 30000 } },
    { label: '₹30K - ₹40K', value: { min: 30000, max: 40000 } },
    { label: '₹40K - ₹50K', value: { min: 40000, max: 50000 } },
    { label: '₹50K - ₹60K', value: { min: 50000, max: 60000 } },
    { label: '₹60K - ₹70K', value: { min: 60000, max: 70000 } },
    { label: '₹70K - ₹80K', value: { min: 70000, max: 80000 } },
    { label: '₹80K - ₹90K', value: { min: 80000, max: 90000 } },
    { label: '₹90K - ₹100K', value: { min: 90000, max: 100000 } },
    { label: '₹100K - ₹125K', value: { min: 100000, max: 125000 } },
    { label: '₹125K - ₹150K', value: { min: 125000, max: 150000 } },
    { label: '₹150K - ₹175K', value: { min: 150000, max: 175000 } },
    { label: '₹175K - ₹200K', value: { min: 175000, max: 200000 } },
    { label: 'Over ₹200K', value: { min: 200000, max: Infinity } },
];

watch(
    () => props.initialData,
    (newData) => {
        if (newData && typeof newData === 'object') {
            form.jobCategory.value = newData.jobCategory || '';
            form.jobType.value = newData.jobType || '';
            form.salary.value = newData.salary || null;
            form.experience.value = newData.experience || '';
            form.jobTitle = newData.jobTitle || '';
            form.jobDetails = newData.jobDetails || '';
            form.vacancy = newData.vacancy || '';
            form.company = {
                companyName: newData.company?.companyName || '',
                location: newData.company?.location || '',
                companyDetails: newData.company?.companyDetails || '',
                contactEmail: newData.company?.contactEmail || '',
                contactPhone: newData.company?.contactPhone || '',
            };
        }
    },
    { immediate: true }
);

const toast = useToast();
const jobStore = useJobStore();

const handleSubmit = async () => {
    const isEdit = props.mode === 'edit';

    const jobData = {
        ...(isEdit && props.initialData),
        jobCategory: form.jobCategory.value,
        jobType: form.jobType.value,
        jobTitle: form.jobTitle.trim(),
        jobDetails: form.jobDetails.trim(),
        salary: form.salary.value || null,
        experience: form.experience.value,
        vacancy: form.vacancy,
        company: {
            companyName: form.company.companyName.trim(),
            location: form.company.location.trim(),
            companyDetails: form.company.companyDetails.trim(),
            contactEmail: form.company.contactEmail.trim(),
            contactPhone: form.company.contactPhone.trim(),
        },
    };

    try {
        if (isEdit) {
            const res = await fetch(`${baseURL}/jobs/${props.initialData._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jobData),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Job updated successfully!');
                emit('update', data);
            }
        } else {
            const newJob = await jobStore.saveJob(jobData);
            toast.success('Job added successfully!');
            emit('create', newJob);
        }

        router.push(authStore.role === 'employer' ? '/EmployerJobspage' : '/jobs');
    } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || 'Error submitting job');
    }
};

const errors = ref({
    companyName: '',
    jobTitle: '',
    contactPhone: '',
    location: '',
    contactEmail: '',
})


const phonePattern = /^[6-9]\d{9}$/


function validateContactPhone(e) {
    let value = e.target.value.replace(/\D/g, '')
    if (value.length > 10) value = value.slice(0, 10)
    form.company.contactPhone = value
    e.target.value = value
    if (!phonePattern.test(value)) {
        errors.value.contactPhone = 'Enter valid 10 digit number'
    } else {
        errors.value.contactPhone = ''
    }
}

function validateContactEmail(e) {
    const value = e.target.value
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    errors.value.contactEmail = emailPattern.test(value) ? '' : 'Invalid email address'
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
</script>


<template>
    <section
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 py-8 px-2 sm:py-12 sm:px-4">
        <div
            class="flex flex-col lg:flex-row items-stretch max-w-full w-full mx-auto  backdrop-blur-lg overflow-hidden">

            <div
                class="flex flex-col justify-center items-center w-full lg:w-[48%] bg-gradient-to-br from-green-100 via-white to-green-100 p-8 lg:p-12">
                <h2 class="text-3xl md:text-4xl font-extrabold mb-4 text-gray-900 text-center leading-tight">
                    <span class="text-green-500">Post</span> Your Job
                </h2>
                <p class="text-gray-600 mb-8 text-lg text-center max-w-md">
                    Fill out the form to add a new job listing. Provide details like job type, description, salary and
                    company info.
                </p>
                <div class="flex justify-center items-center w-full mb-6">
                    <div class="lottie-center">
                        <Lottieplayer :animationData="postJobAnimation" />
                    </div>
                </div>
            </div>


            <div class="flex flex-col justify-center w-full lg:w-[52%] p-6 sm:p-10">
                <form @submit.prevent="handleSubmit" class="w-full max-w-3xl mx-auto  p-4 sm:p-6 md:p-8 space-y-6 ">

                    <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">
                        Job <span class="text-green-500">Posting</span> Form
                    </h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                        <div>
                            <label for="category" class="block mb-1 font-medium text-gray-700">Job Category</label>
                            <select v-model="form.jobCategory.value"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" required>
                                <option v-for="option in categoryOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label for="type" class="block mb-1 font-medium text-gray-700">Job Type</label>
                            <select v-model="form.jobType.value"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" required>
                                <option v-for="option in jobTypeOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block mb-1 font-medium text-gray-700">Job Title</label>
                            <input v-model="form.jobTitle" type="text" @input="validateTextInput($event, 'jobTitle')"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                                placeholder="e.g. Frontend Developer" required />
                            <span v-if="errors.jobTitle" class="text-red-500 text-xs">{{ errors.jobTitle }}</span>
                        </div>

                        <div>
                            <label class="block mb-1 font-medium text-gray-700">Job Details</label>
                            <input v-model="form.jobDetails"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                                placeholder="Add job duties" />
                        </div>

                        <div>
                            <label for="salary" class="block mb-1 font-medium text-gray-700">Salary</label>
                            <select v-model="form.salary.value" id="salary"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" required>
                                <option :value="null">Select the Salary</option>
                                <option v-for="(option, index) in salaryOptions" :key="index" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label for="type" class="block mb-1 font-medium text-gray-700">Experience</label>
                            <select v-model="form.experience.value"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500" required>
                                <option v-for="option in experienceOptions" :key="option.value" :value="option.value">
                                    {{ option.label }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block mb-1 font-medium text-gray-700">Vacancy</label>
                            <input v-model.lazy="form.vacancy" type="number"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                                placeholder="Add open position" />
                        </div>
                    </div>

                    <h3 class="text-2xl font-semibold mt-4 mb-2 text-gray-800">About Employer</h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                        <div>
                            <label class="block mb-1 font-medium text-gray-700">Employer Name</label>
                            <input v-model="form.company.companyName" type="text"
                                @input="validateTextInput($event, 'companyName')"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                                placeholder="Company Name" />
                            <span v-if="errors.companyName" class="text-red-500 text-xs">{{ errors.companyName }}</span>
                        </div>

                        <div>
                            <label class="block mb-1 font-medium text-gray-700">Employer Details</label>
                            <input v-model="form.company.companyDetails"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                                placeholder="What does your company do?" />
                        </div>

                        <div>
                            <label class="block mb-1 font-medium text-gray-700">Location</label>
                            <input v-model="form.company.location" type="text"
                                @input="validateTextInput($event, 'location')"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                                placeholder="Company location" required />
                            <span v-if="errors.location" class="text-red-500 text-xs">{{ errors.location }}</span>
                        </div>

                        <div>
                            <label class="block mb-1 font-medium text-gray-700">Contact Email</label>
                            <input v-model="form.company.contactEmail" type="email" @input="validateContactEmail"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                                placeholder="Email for applicants" required />
                            <span v-if="errors.contactEmail" class="text-red-500 text-xs">{{ errors.contactEmail
                                }}</span>
                        </div>

                        <div>
                            <label class="block mb-1 font-medium text-gray-700">Contact Phone</label>
                            <input v-model="form.company.contactPhone" type="tel" maxlength="10" pattern="\d{10}"
                                @input="validateContactPhone"
                                class="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-green-500"
                                placeholder="Phone (optional)" />
                            <span v-if="errors.contactPhone" class="text-red-500 text-xs">{{ errors.contactPhone
                                }}</span>
                        </div>
                    </div>

                    <div>
                        <button
                            class="w-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold py-3 rounded-xl transition text-lg shadow-md"
                            type="submit">
                            {{ props.mode === 'edit' ? 'Update Job' : 'Add Job' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>

<style scoped>
.lottie-center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 320px;
    margin-left: auto;
    margin-right: auto;
}
</style>