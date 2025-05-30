<script setup>
import { reactive,watch } from 'vue';
import { useToast } from 'vue-toastification';
import formImage from '../assets/emp3.png'
import { useJobStore } from '../stores/jobStore' 


const emit = defineEmits(['update'])
const props = defineProps({
    initialData: Object,
    mode: {
        type: String,
        default: 'add' 
    }
});


const form = reactive({
    type: 'Full-Time',
    title: '',
    description: '',
    salary: '',
    experience:'Fresher',
    location: '',
    company: {
        name: '',
        description: '',
        contactEmail: '',
        contactPhone: ''
    }
}); 

watch(() => props.initialData, (newData) => {
    if (newData) {
        const cleanData = JSON.parse(JSON.stringify(newData))
        Object.assign(form, cleanData)
    }
}, { immediate: true })


const toast = useToast();
const jobStore = useJobStore()

const handleSubmit = () => {
    const newJob = {
        id: props.mode === 'edit' && props.initialData?.id ? props.initialData.id : Date.now(),
        title: form.title,
        type: form.type,
        location: form.location,
        description: form.description,
        salary: form.salary,
        experience: form.experience,
        company: {
            name: form.company.name,
            description: form.company.description,
            contactEmail: form.company.contactEmail,
            contactPhone: form.company.contactPhone,
        }
    };

    emit('update', newJob) 

    try {
        const existingJobs = JSON.parse(localStorage.getItem('jobs')) || [];

        if (props.mode === 'edit') {
            const index = existingJobs.findIndex(job => job.id === newJob.id);
            if (index !== -1) {
                existingJobs[index] = newJob;
            }
        } else {
            existingJobs.push(newJob);
            jobStore.saveJob(newJob);
        }

        localStorage.setItem('jobs', JSON.stringify(existingJobs));
        toast.success(props.mode === 'edit' ? 'Job Updated Successfully!' : 'Job Added Successfully!');

        if (props.mode !== 'edit') {
           
            form.type = 'Full-Time';
            form.title = '';
            form.description = '';
            form.salary = '';
            form.experience = 'Fresher';
            form.location = '';
            form.company.name = '';
            form.company.description = '';
            form.company.contactEmail = '';
            form.company.contactPhone = '';
        }
    } catch (error) {
        console.error('Error saving job locally:', error);
        toast.error('Failed to save job.');
    }
};
</script>


<template>
    <section class=" py-16 px-4">
        <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

            <div class="flex flex-col justify-center items-start p-6">
                <h2 class="text-4xl font-bold text-green-700 mb-4">Post Your Job</h2>
                <p class="text-gray-600 mb-6">Fill out the form to add a new job listing. Provide details like job type,
                    description, salary and company info.</p>
                <img :src="formImage" alt="Job" class="w-full max-w-sm" />
            </div>


            <div class="bg-white px-6 py-8 shadow-md rounded-md border">
                <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                        <label for="type" class="block text-sm text-gray-700 font-bold mb-2">Job Type</label>
                        <select v-model="form.type" id="type" class="border rounded w-full py-2 px-3" required>
                            <option value="Full-Time">Full-Time</option>
                            <option value="Part-Time">Part-Time</option>
                            <option value="Remote">Remote</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Job Name</label>
                        <input v-model="form.title" type="text" class="border text-sm rounded w-full py-2 px-3"
                            placeholder="e.g. Frontend Developer" required />
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Description</label>
                        <input v-model="form.description" class="border text-sm rounded w-full py-2 px-3"
                            placeholder="Add job duties" />
                    </div>

                    <div>
                        <label for="salary" class="block text-sm text-gray-700 font-bold mb-2">Salary</label>
                        <select v-model="form.salary" id="salary" class="border text-sm rounded w-full py-2 px-3"
                            required>
                            <option value="0 - ₹10K">&#8377;0 - &#8377;10K</option>
                            <option value="₹10K - ₹20K">&#8377;10K - &#8377;20K</option>
                            <option value="₹20K - ₹30K">&#8377;20K - &#8377;30K</option>
                            <option value="₹30K - ₹40K">&#8377;30K - &#8377;40K</option>
                            <option value="₹40K - ₹50K">&#8377;40K - &#8377;50K</option>
                            <option value="₹50K - ₹60K">&#8377;50K - &#8377;60K</option>
                            <option value="₹60K - ₹70K">&#8377;60K - &#8377;70K</option>
                            <option value="₹70K - ₹80K">&#8377;70K - &#8377;80K</option>
                            <option value="₹80K - ₹90K">&#8377;80K - &#8377;90K</option>
                            <option value="₹90K - ₹100K">&#8377;90K - &#8377;100K</option>
                            <option value="₹100K - ₹125K">&#8377;100K - &#8377;125K</option>
                            <option value="₹125K - ₹150K">&#8377;125K - &#8377;150K</option>
                            <option value="₹150K - ₹175K">&#8377;150K - &#8377;175K</option>
                            <option value="₹175K - ₹200K">&#8377;175K - &#8377;200K</option>
                            <option value="Over ₹200K">Over &#8377;200K</option>
                        </select>
                    </div>

                    <div>
                        <label for="type" class="block text-sm text-gray-700 font-bold mb-2">Experience</label>
                        <select v-model="form.experience" id="type" class="border rounded w-full py-2 px-3" required>
                            <option value="Fresher">Fresher</option>
                            <option value="1 to 2 yrs">1 to 2 yrs</option>
                            <option value="3 to 4 yrs">3 to 4 yrs</option>
                            <option value="5 to 6 yrs">5 to 6 yrs</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Location</label>
                        <input v-model="form.location" type="text" class="border text-sm rounded w-full py-2 px-3"
                            placeholder="Job location" required />
                    </div>

                    <h3 class="text-2xl font-semibold col-span-full mt-4">Company Info</h3>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Company Name</label>
                        <input v-model="form.company.name" type="text" class="border text-sm rounded w-full py-2 px-3"
                            placeholder="Company Name" />
                    </div>

                    <div>
                        <label class="block text-sm text-gray-700 font-bold mb-2">Company Description</label>
                        <input v-model="form.company.description" class="border text-sm rounded w-full py-2 px-2"
                            placeholder="What does your company do?" />
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

