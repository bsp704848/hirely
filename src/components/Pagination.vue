<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    currentPage: Number,
    totalPages: Number
})


const emit = defineEmits(['page-changed'])

const maxVisiblePages = 3
const startPage = ref(1)

const visiblePageNumbers = computed(() => {
    const pages = []
    const endPage = Math.min(startPage.value + maxVisiblePages - 1, props.totalPages)
    for (let i = startPage.value; i <= endPage; i++) {
        pages.push(i)
    }
    return pages
})

function changePage(page) {
    if (page >= 1 && page <= props.totalPages) {
        emit('page-changed', page)
    }
}

function nextPage() {
    if (props.currentPage < props.totalPages) {
        const nextPageNum = props.currentPage + 1

        if (nextPageNum > startPage.value + maxVisiblePages - 1 && startPage.value + maxVisiblePages - 1 < props.totalPages) {
            startPage.value++
        }

        changePage(nextPageNum)
    }
}

function prevPage() {
    if (props.currentPage > 1) {
        const prevPageNum = props.currentPage - 1


        if (prevPageNum < startPage.value && startPage.value > 1) {
            startPage.value--
        }

        changePage(prevPageNum)
    }
}

watch(
    () => props.currentPage,
    (newPage) => {
        if (newPage < startPage.value) {
            startPage.value = newPage
        } else if (newPage >= startPage.value + maxVisiblePages) {
            startPage.value = newPage - maxVisiblePages + 1
        }
    }
)
</script>

<template>
    <div class="flex justify-center items-center gap-2 mt-6 flex-wrap">
        <button
            class="px-3 py-1 rounded bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white hover:font-bold"
            :disabled="currentPage === 1" @click="prevPage">
            Prev
        </button>

        <button v-for="page in visiblePageNumbers" :key="page" @click="changePage(page)" :class="[
            'px-3 py-1 rounded',
            page === currentPage
                ? 'bg-green-600 text-white font-bold'
                : 'bg-green-300 hover:bg-gray-300'
        ]">
            {{ page }}
        </button>

        <button
            class="px-3 py-1 rounded bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white hover:font-bold"
            :disabled="currentPage === totalPages" @click="nextPage">
            Next
        </button>
    </div>
</template>
