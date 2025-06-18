<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch,onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import ScrollToTop from './components/ScrollToTop.vue'
import Loader from './components/Loader.vue'
import { useUserStore } from './stores/userStore'
import { useJobStore } from './stores/jobStore'
import { useAuthStore } from './stores/authStore'


const route = useRoute()
const router = useRouter()
const isEmployer = ref(route.path === '/employer')
const isLoading = ref(false)
const userStore = useUserStore()
const jobStore = useJobStore()
const authStore = useAuthStore()


onMounted(() => {
  setTimeout(() => {
    authStore.fetchUser(router)
  }, 1000) 
})


router.beforeEach((to, from, next) => {
  isLoading.value = true
  next()
})

router.afterEach(() => {

  setTimeout(() => {
    isLoading.value = false
  }, 1500)
})

watch(route, (newRoute) => {
  isEmployer.value = newRoute.path === '/employer'
})
</script>

<template>
  <div class="min-h-screen flex flex-col ">
    <div v-if="isLoading" class="fixed inset-0 z-50 flex items-center justify-center">
      <Loader />
    </div>


    <div v-else class="flex flex-col flex-grow">
      <Navbar :isEmployer="isEmployer" />
      <main class="flex-grow">
        <router-view />
      </main>
      <ScrollToTop />
      <Footer />

    </div>
    </div>
</template>
