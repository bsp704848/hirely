<script setup>
import { ref, watch, onMounted } from 'vue';

const emit = defineEmits(['salary-changed']);
const props = defineProps({
    salaryRange: {
        type: Object,
        required: true,
    },
});

const minSalary = props.salaryRange.min || 10000;
const maxSalary = props.salaryRange.max || 200000;

const salaryRange = ref([minSalary, maxSalary]);

onMounted(() => {
    emit('salary-changed', { min: salaryRange.value[0], max: salaryRange.value[1] });
});

watch(salaryRange, ([from, to]) => {
    emit('salary-changed', { min: from, max: to });
}, { immediate: true });
</script>

<template>
    <v-container class="pa-4" style="max-width: 400px">
        <v-row>
            <v-col cols="12">
                <label class="font-weight-bold mb-2 d-block">Salary Range (₹)</label>
                <v-range-slider v-model="salaryRange" :min="minSalary" :max="maxSalary" step="10000" thumb-label
                color="success" 
                    :ticks="[10000, 50000, 100000, 150000, 200000]" class="mt-3"
                    @change="() => emit('salary-changed', { min: salaryRange.value[0], max: salaryRange.value[1] })"></v-range-slider>
                <div class="text-sm font-weight-medium">
                    ₹{{ salaryRange[0].toLocaleString() }} - ₹{{ salaryRange[1].toLocaleString() }}
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>



