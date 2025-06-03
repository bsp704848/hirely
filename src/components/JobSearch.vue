<script setup>
defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])
</script>

<template>
    <div class="px-4 mb-8">
        <div class="flex justify-center">
            <v-text-field :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)"
                label="Search by title, company..." variant="outlined" density="comfortable" clearable
                class="w-full max-w-md" prepend-inner-icon="mdi-magnify" />
        </div>
    </div>
</template>


