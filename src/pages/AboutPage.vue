<script setup>
import teamImage from '../assets/team.jpg'

</script>
<template>
    <section class="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">

        <div class="container mx-auto px-6 py-16 text-center">
            <h1 class="text-4xl md:text-5xl font-extrabold mb-4">About <span class="text-green-600">Hirely</span></h1>
            <p class="text-lg md:text-xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
                Connecting talent with opportunity. We make hiring smarter, faster, and easier — for everyone.
            </p>
        </div>


        <div class="bg-gray-100 dark:bg-gray-800 py-12">
            <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div>
                    <h2 class="text-3xl font-bold text-green-700 mb-4">Who Are We?</h2>
                    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">
                        Hirely is a forward-thinking job platform dedicated to helping businesses connect with top-tier
                        talent.
                        We’re not just a job board — we’re a talent ecosystem that bridges the gap between employers and
                        job seekers, ensuring quality and speed in the recruitment process.
                    </p>
                </div>
                <div class="overflow-hidden rounded-lg">
                    <img :src="teamImage" class="transform transition-transform duration-300 hover:scale-105" />
                </div>
            </div>
        </div>


        <div class="py-12">
            <div class="max-w-6xl mx-auto px-6 text-center">
                <h2 class="text-3xl font-bold text-green-700 mb-6">What We Do</h2>
                <p class="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
                    We offer a modern platform for job listings, resume screening, employer branding, and advanced
                    filtering.
                    Whether you're a startup or an enterprise, Hirely helps streamline hiring with smart tools and
                    outstanding candidate experiences.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-2xl transition">
                        <h3 class="font-bold text-xl mb-2 text-green-600">Smart Job Posting</h3>
                        <p>Post jobs effortlessly, reach a wide talent pool, and track applicant engagement.</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-2xl transition">
                        <h3 class="font-bold text-xl mb-2 text-green-600">AI Candidate Matching</h3>
                        <p>Match the best-fit candidates based on skills, location, and experience using our AI-driven
                            engine.</p>
                    </div>
                    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-2xl transition">
                        <h3 class="font-bold text-xl mb-2 text-green-600">Real-Time Analytics</h3>
                        <p>Track views, applications, and hiring progress with real-time, actionable data.</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-gray-100 dark:bg-gray-800 py-12">
            <div class="max-w-6xl mx-auto px-6 text-center">
                <h2 class="text-3xl font-bold text-green-700 mb-8">What Our Customers Say</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-slate-950 transition">
                        <p class="italic">“Hirely made hiring our next developer so easy. We posted the job and within
                            days we had the perfect fit.”</p>
                        <div class="mt-4 font-semibold">– Anjali, HR Manager at TechWave</div>
                    </div>
                    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-slate-950 transition">
                        <p class="italic">“The user interface is fantastic and intuitive. Love the applicant tracking
                            features!”</p>
                        <div class="mt-4 font-semibold">– Rahul, Founder of SmartRecruit</div>
                    </div>
                    <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-slate-950 transition">
                        <p class="italic">“I got my dream job through Hirely in just a week. Highly recommended for job
                            seekers.”</p>
                        <div class="mt-4 font-semibold">– Priya, Frontend Developer</div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
  
