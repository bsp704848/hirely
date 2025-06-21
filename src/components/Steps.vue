<script setup>
import Step1 from '../assets/step1.gif'
import Step2 from '../assets/step2.gif'
import Step3 from '../assets/step3.gif'
import Step4 from '../assets/step4.gif'
import Step5 from '../assets/step5.gif'
import Step6 from '../assets/step6.gif'
import Step7 from '../assets/step7.gif'
import Step8 from '../assets/step8.gif'

const steps = [
    {
        title: '1. Create Your Profile',
        description: 'Sign up and complete your profile with your skills, experience, and preferences.',
        image: Step1,
    },
    {
        title: '2. Register on Job Portals',
        description: 'Add your latest resume to showcase your qualifications to employers.',
        image: Step2,
    },
    {
        title: '3. Search for Jobs',
        description: 'Browse jobs by title, company, location, or keywords that match your interests.',
        image: Step3,
    },
    {
        title: '4. Apply for Jobs',
        description: 'Use filters to narrow down results and shortlist jobs that fit your criteria.',
        image: Step4,
    },
    {
        title: '5. Attend Interview',
        description: 'Review job descriptions, requirements, and company information carefully.',
        image: Step5,
    },
    {
        title: '6. Get Offers',
        description: 'Submit your application with a single click and attach a personalized cover letter.',
        image: Step6,
    },
    {
        title: '7. Join the Employer',
        description: 'Monitor the status of your applications and receive notifications for updates.',
        image: Step7,
    },
    {
        title: '8. Start Working',
        description: 'Get interview tips and prepare for meetings with potential employers.',
        image: Step8,
    }
]
</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8 py-6">
        <div class="max-w-7xl mx-auto w-full">
            <section
                class=" dark:bg-gray-900 rounded-2xl p-6 sm:p-10 mt-10 ">
                <h2 class="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-16">
                    How to <span class="text-green-500">Find & Apply</span> for Jobs
                </h2>
                <div class="grid gap-10 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <div v-for="(step, index) in steps" :key="index"
                        class="flex flex-col p-4 rounded-tr-3xl rounded-bl-3xl items-center text-center shadow-2xl 
         border-r-8 border-b-8 border-transparent 
         hover:border-green-500 transform transition duration-500 ease-in-out hover:-translate-y-2 bg-white dark:bg-gray-800">
                        <img :src="step.image" alt="Step Icon" class="w-16 h-16 mb-4 p-2" />
                        <h3 class="text-xl font-semibold text-gray-700 dark:text-white">
                            {{ step.title }}
                        </h3>
                        <p class="text-sm text-gray-800 dark:text-gray-300 mt-2 px-2">
                            {{ step.description }}
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
