<script setup>
defineProps({
    image: String,
    title: String,
    description: String,
    id: Number,     
})
</script>

<template>
    <div
        class="w-full max-w-[300px] flex flex-col space-y-2 px-4 py-3 border rounded-xl p-5 shadow-lg hover:shadow-2xl hover:scale-[1.02] transform transition-transform ease-in-out bg-white dark:bg-gray-900 dark:text-white">



        <div class="flex items-center space-x-2">
            <div class="w-10 h-10 flex justify-center items-center bg-gray-100 rounded-full overflow-hidden">
                <img v-if="image" :src="image" alt="icon" class="w-5 h-5 object-content" />

            </div>
            <span class="font-medium text-sm text-gray-700 truncate"> Title : {{ title.length > 18 ? title.slice(0, 18)
                + '...' : title }}</span>
        </div>


        <p class="text-xs text-gray-600">{{ description }}</p>


        <slot />
    </div>
</template>
