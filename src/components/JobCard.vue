<script setup>
defineProps({
    image: String,
    title: String,
    description: String,
    id: [String, Number]

})


</script>

<template>
    <div
        class="w-full max-w-[300px] flex flex-col space-y-3 px-4 py-4 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 dark:text-white border-r-4 border-b-4 border-transparent hover:border-green-400">

        <div class="flex items-center space-x-2">
            <div class="w-10 h-10 flex justify-center items-center bg-gray-100 rounded-full overflow-hidden">
                <img v-if="image" :src="image" alt="icon" class="w-5 h-5 object-content" />

            </div>
            <span class="font-bold text-base text-gray-800 truncate">{{title }}</span>
        </div>

        <p class="text-xs text-gray-600">{{ description }}</p>
        <slot />
    </div>
</template>
