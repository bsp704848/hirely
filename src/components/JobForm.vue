<script setup>
import { reactive, watch } from 'vue';
import { useToast } from 'vue-toastification';
import formImage from '../assets/emp3.png';
import { useJobStore } from '../stores/jobStore';
const baseURL = import.meta.env.VITE_API_BASE_URL;


const emit = defineEmits(['update', 'create']);
const props = defineProps({
    initialData: Object,
    mode: {
        type: String,
        default: 'add',
    },
});

const form = reactive({
    jobCategory: { label: 'Select The Category', value: '' },
    jobType: { label: 'Full-Time', value: 'Full-Time' },
    jobTitle: '',
    jobDetails: '',
    salary: null,
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
    { label: '9 to 10 yrs', value: '8 to 9 yrs' },
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
            Object.assign(form, JSON.parse(JSON.stringify(newData)));
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
        salary: form.salary ? JSON.parse(JSON.stringify(form.salary)) : null,
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

    const url = isEdit
        ? `${baseURL}/jobs/${props.initialData._id || props.initialData.id}`
        : `${baseURL}/jobs/add`;

    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData),
        });

        const data = await res.json();

        if (res.ok) {
            toast.success(isEdit ? 'Job updated successfully!' : 'Job added successfully!');
            emit(isEdit ? 'update' : 'create', data);

            if (!isEdit) {
               
                Object.assign(form, {
                    jobCategory: { label: 'Select The Category', value: '' },
                    jobType: { label: 'Full-Time', value: 'Full-Time' },
                    jobTitle: '',
                    jobDetails: '',
                    salary: null,
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
            }
        } else {
            toast.error(data?.message || 'Something went wrong!');
        }
    } catch (err) {
        console.error(err);
        toast.error('Server Error: Could not submit job.');
    }
};

</script>


<template>
    <section class=" py-16 px-4">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

            <div class="flex flex-col justify-center items-start p-6">
                <h2 class="text-4xl font-bold text-green-700 mb-4">Post Your Job</h2>
                <p class="text-gray-600 mb-6">Fill out the form to add a new job listing. Provide details like job
                    type,
                    description, salary and company info.</p>
                <img :src="formImage" alt="Job" class="w-full max-w-sm" />
            </div>


            <div class="bg-white px-6 py-8 shadow-md rounded-md border">
                <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label for="category" class="block text-sm text-gray-700 font-bold mb-2">Job
                            Category</label>
                        <select v-model="form.jobCategory" class="border rounded w-full py-2 px-3" required>
                            <option v-for="option in categoryOptions" :key="option.value" :value="option">
                                {{ option.label }}
                            </option>
                        </select>

                    </div>

                    <div>
                        <label for="type" class="block text-sm text-gray-700 font-bold mb-2">Job Type</label>
                        <select v-model="form.jobType" class="border rounded w-full py-2 px-3" required>
                            <option v-for="option in jobTypeOptions" :key="option.value" :value="option">
                                {{ option.label }}
                            </option>
                        </select>

                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Job Title</label>
                        <input v-model="form.jobTitle" type="text" class="border text-sm rounded w-full py-2 px-3"
                            placeholder="e.g. Frontend Developer" required />
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Job Details</label>
                        <input v-model="form.jobDetails" class="border text-sm rounded w-full py-2 px-3"
                            placeholder="Add job duties" />
                    </div>

                    <div>
                        <label for="salary" class="block text-sm text-gray-700 font-bold mb-2">Salary</label>
                        <select v-model="form.salary" id="salary" class="border text-sm rounded w-full py-2 px-3"
                            required>
                            <option :value="null">Select the Salary</option>
                            <option v-for="(option, index) in salaryOptions" :key="index" :value="option.value">
                                {{ option.label }}
                            </option>
                        </select>

                    </div>


                    <div>
                        <label for="type" class="block text-sm text-gray-700 font-bold mb-2">Experience</label>
                        <select v-model="form.experience" class="border rounded w-full py-2 px-3" required>
                            <option v-for="option in experienceOptions" :key="option.value" :value="option">
                                {{ option.label }}
                            </option>
                        </select>

                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Vacancy</label>
                        <input v-model.lazy="form.vacancy" type="number" class="border text-sm rounded w-full py-2 px-3"
                            placeholder="Add open position" />
                    </div>


                    <h3 class="text-2xl font-semibold col-span-full mt-4">About Company</h3>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Company Name</label>
                        <input v-model="form.company.companyName" type="text"
                            class="border text-sm rounded w-full py-2 px-3" placeholder="Company Name" />
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Company Details</label>
                        <input v-model="form.company.companyDetails" class="border text-sm rounded w-full py-2 px-2"
                            placeholder="What does your company do?" />
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Location</label>
                        <input v-model="form.company.location" type="text"
                            class="border text-sm rounded w-full py-2 px-3" placeholder="Company location" required />
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Contact Email</label>
                        <input v-model="form.company.contactEmail" type="email"
                            class="border text-sm rounded w-full py-2 px-3" placeholder="Email for applicants"
                            required />
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Contact Phone</label>
                        <input v-model="form.company.contactPhone" type="tel"
                            class="border text-sm rounded w-full py-2 px-3" placeholder="Phone (optional)" />
                    </div>

                    <div class="col-span-full">
                        <button
                            class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full w-full transition"
                            type="submit">
                            {{ props.mode === 'edit' ? 'Update Job' : 'Add Job' }}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    </section>
</template>
