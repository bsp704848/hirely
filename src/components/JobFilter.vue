<script setup>
import { ref, watch, toRef } from 'vue'; 

const props = defineProps({
    salaryRange: {
        type: Number,
        default: 0
    },
    experienceFilter: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:salaryRange', 'update:salaryFilter', 'update:experienceFilter'])


const salaryRanges = [
    'All Salaries',
    '0 - ₹ 10K',
    '₹ 10K - ₹ 20K',
    '₹ 20K - ₹ 30K',
    '₹ 30K - ₹ 40K',
    '₹ 40K - ₹ 50K',
    '₹ 50K - ₹ 60K',
    '₹ 60K - ₹ 70K',
    '₹ 70K - ₹ 80K',
    '₹ 80K - ₹ 90K',
    '₹ 90K - ₹ 100K',
    '₹ 100K - ₹ 125K',
    '₹ 125K - ₹ 150K',
    '₹ 150K - ₹ 175K',
    '₹ 175K - ₹ 200K',
    'Over ₹ 200K'
]; 

const localSalaryRange = toRef(props, 'salaryRange')
const localExperienceFilter = toRef(props, 'experienceFilter')


watch(localSalaryRange, (newVal) => {
    emit('update:salaryRange', newVal)
    if (newVal === 0) {
        emit('update:salaryFilter', '')
    } else {
        emit('update:salaryFilter', salaryRanges[newVal])
    }
})

watch(localExperienceFilter, (newVal) => {
    emit('update:experienceFilter', newVal)
}) 



const handleInput = (event) => {
    emit('update:salaryRange', +event.target.value);
};

const handleChange = (event) => {
    const value = +event.target.value;
    if (value === 0) {
        emit('update:salaryFilter', '');
    } else {
        emit('update:salaryFilter', salaryRanges[value]);
    }
};
</script>

<template>
    <div class="job-filter">
        <div class="salary-slider">
            <input type="range" :value="salaryRange" @input="handleInput" @change="handleChange" :min="0"
                :max="salaryRanges.length - 1" step="1" />
            <div class="salary-value">{{ salaryRanges[salaryRange] }}</div>
        </div>

        <div class="select">
            <select id="experience" :value="experienceFilter"
                @change="$emit('update:experienceFilter', $event.target.value)"
                class="bg-transparent focus:outline-none focus:ring-0 border-none">
                <option value="">Experience</option>
                <option value="Fresher">Fresher</option>
                <option value="1 to 2 yrs">1 to 2 yrs</option>
                <option value="3 to 4 yrs">3 to 4 yrs</option>
                <option value="5 to 6 yrs">5 to 6 yrs</option>
            </select>
        </div>
    </div>
</template>

<style scoped>
 

.job-filter {
    display: flex;
    align-items: center;
    gap: 3rem;
    padding-bottom: 1rem;
}

label {
    font-weight: 600;
}

.select{
    padding: 1rem;
    padding-bottom: 3rem;
}
.salary-slider {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
    width: 100%;
    max-width: 300px;
  
}


.salary-slider input[type='range'] {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 5px;
    background: linear-gradient(90deg, #80f089 0%, #4caf3f 100%);
    outline: none;
    cursor: pointer;
    transition: background 0.3s ease;
}

.salary-slider input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    background: #ffffff;
    border: 2px solid #70ee0a;
    border-radius: 50%;
    cursor: pointer;
}

.salary-slider input[type='range']::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #ffffff;
    border: 2px solid #4facfe;
    border-radius: 50%;
    cursor: pointer;
}

.salary-value {
    font-weight: bold;
    color: #107003;
    margin-top: 0.25rem;
    text-align: left;
    width: 100%;
    transition: all 0.3s ease;
}
</style>
