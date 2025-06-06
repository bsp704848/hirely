<script setup>
import lottie from 'lottie-web'
import { onMounted, ref } from 'vue'

const props = defineProps({
    animationData: Object
})

const container = ref(null)


onMounted(() => {
    lottie.loadAnimation({
        container: container.value,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: props.animationData
    })
})
</script>

<template>
    <div ref="container" class="w-96 h-96 mb-8"></div>
</template>
