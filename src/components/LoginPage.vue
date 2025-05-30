<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import loginImage from '../assets/login.png'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const form = ref({
    email: '',
    password: '',
})

const showPassword = ref(false)



// const handleLoginWithLocalStorage = () => {
//     console.log('Login data:', form.value)

//     const registeredUser = JSON.parse(localStorage.getItem('userData'))
//     console.log('LocalStorage userData:', registeredUser)

//     if (!registeredUser || !registeredUser.email || !registeredUser.password) {
//         toast.error('No user found. Please register first.')
//         return
//     }

//     if (
//         registeredUser.email !== form.value.email ||
//         registeredUser.password !== form.value.password
//     ) {
//         toast.error('Invalid email or password.')
//         return
//     }

//     const role = registeredUser.role || 'employee'

//     const userData = {
//         username: form.value.email.split('@')[0],
//         email: form.value.email,
//         role,
//     }

//     authStore.login(userData)

//     toast.success('Login Successful...')

//     setTimeout(() => {
//         form.value = {
//             email: '',
//             password: '',
//         }

//         if (role === 'employee') {
//             router.push('/')
//         } else {
//             router.push('/employer')
//         }
//     }, 2000)
// }


const handleLogin = () => {
    try {
        authStore.login(form.value)
        toast.success('Login successful')

        setTimeout(() => {
            const role = authStore.role || 'employee'

            if (role === 'employee') {
                router.push('/')
            } else {
                router.push('/employer')
            }

            form.value = { email: '', password: '' }
        }, 1500)
    } catch (err) {
        toast.error(err.message || 'Login failed')
    }
}

</script>


<template>
    <div class="min-h-screen grid grid-cols-1 md:grid-cols-2 ">

        <div class="hidden md:flex items-center justify-center">
            <img :src="loginImage" alt="Login Illustration" class="w-3/4 max-w-md">
        </div>


        <div class="flex items-center justify-center p-6">
            <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
                <form @submit.prevent="handleLogin" class="space-y-5">

                    <div>
                        <label class="block mb-1 font-medium">Email</label>
                        <input type="email" v-model="form.email"
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email" required />
                    </div>


                    <div class="relative">
                        <label class="block mb-1 font-medium">Password</label>
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.password"
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password" required />
                        <i :class="`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`"
                            class="absolute right-5 top-10 text-gray-500 cursor-pointer"
                            @click="showPassword = !showPassword"></i>
                    </div>


                    <p class="text-center text-sm">
                        New to Hirely?
                        <router-link to="/register" class="text-blue-700 font-semibold">
                            Register
                        </router-link>
                        for free
                    </p>

                    <button type="submit"
                        class="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-200">
                        Login
                    </button>


                    <p class="text-center flex items-center justify-center gap-2 text-sm">
                        Login with Google
                        <i class="pi pi-google text-2xl text-blue-500"></i>
                    </p>
                </form>
            </div>
        </div>
    </div>
</template>
