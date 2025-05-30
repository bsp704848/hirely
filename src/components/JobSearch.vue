<script setup>

defineProps(['modelValue'])
defineEmits(['update:modelValue'])

 </script>
 
<template>
    <div class="px-4 mb-8">
        <div class="flex justify-center">
            <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" type="text"
                placeholder="Search by title, company..."
                class="w-full max-w-md p-3 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>
    </div>
</template>



  
