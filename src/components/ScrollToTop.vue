
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isVisible = ref(false)

function handleScroll() {
    isVisible.value = window.scrollY > 200
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
    <button v-show="isVisible" @click="scrollToTop"
        class="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-br from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-pill"
        aria-label="Scroll to top">
        <font-awesome-icon icon="arrow-up" />
    </button>
</template> 



  
