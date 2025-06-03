<script setup>
import { ref, watch } from 'vue';


const emit = defineEmits(['experience-changed']);

const form = ref({
    experience: ''
})

const experienceOptions = [
    'All', 
    'Fresher',
    '1 to 2 yrs',
    '3 to 4 yrs',
    '5 to 6 yrs',
    '7 to 8 yrs',
    '8 to 9 yrs',
    'up to 10 years'
]; 

watch(() => form.value.experience, (val) => {
    emit('experience-changed', val);
});

</script>

<template>
    <v-container class="pa-0" fluid>
        <v-row>
            <v-col cols="12">
                <v-select v-model="form.experience" :items="experienceOptions" label="Experience" variant="outlined"
                    density="comfortable" required></v-select>
            </v-col>
        </v-row>
    </v-container>
</template>


