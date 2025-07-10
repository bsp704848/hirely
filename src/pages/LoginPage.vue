<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { useToast } from 'vue-toastification'
import loginImage from '../assets/signin.svg'
import { GoogleLogin } from 'vue3-google-login'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const baseURL = import.meta.env.VITE_API_BASE_URL

const form = ref({
    email: '',
    password: '',
})

const showPassword = ref(false)
const errorMessage = ref('')
const selectedRole = ref('employee')

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

const handleLogin = async () => {

    if (!form.value.email || !form.value.password) {
        errorMessage.value = 'Please fill in all fields'
        return
    }
    if (!validateEmail(form.value.email)) {
        errorMessage.value = 'Please enter a valid email'
        return
    }
    errorMessage.value = ''
    try {
        await authStore.login(form.value);

        toast.success('Login successful'); 

        const role = authStore.role || 'employee';
        router.push(role === 'employer' ? '/employer' : '/');

        form.value = { email: '', password: '' };

    } catch (err) {
        console.error('Login error:', err.response?.data || err.message);
        toast.error(err.response?.data?.message || err.message || 'Login failed');
    }
}

const handleGoogleLogin = async (response) => {

    if (!selectedRole.value) {
        toast.error("Please select a role before continuing with Google login")
        return
    }

    const token = response.credential;
    const role = selectedRole.value;


    try {
        const res = await fetch(`${baseURL}/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ token, role }),
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.message || 'Google login failed')

       
        await authStore.googleLogin(response.credential)

        toast.success('Login successful with Google')
        const userRole = authStore.role || 'employee'
        router.push(userRole === 'employer' ? '/employer' : '/')
    } catch (error) {
        console.error('Google login error:', error)
        toast.error(error.message)
    }
}

</script>


<template>
    <div class="min-h-screen grid grid-cols-1 md:grid-cols-2 ">

        <div class="hidden md:flex items-center justify-center">
            <img :src="loginImage" alt="image" class="w-3/4 h-auto" />
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
                        <p v-if="errorMessage === 'Please fill in all fields' && !form.email" class="text-red-500 text-xs mt-1">
                            {{ errorMessage }}
                        </p>
                        <p v-else-if="errorMessage === 'Please enter a valid email' && form.email" class="text-red-500 text-xs mt-1">
                            {{ errorMessage }}
                        </p>
                    </div>
                    
                    
                    <div class="relative">
                        <label class="block mb-1 font-medium">Password</label>
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.password"
                            class="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password" required :minlength="8" :maxlength="8" />
                        <i :class="`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`"
                            class="absolute right-5 top-10 text-gray-500 cursor-pointer"
                            @click="showPassword = !showPassword"></i>
                        <p v-if="errorMessage === 'Please fill in all fields' && !form.password" class="text-red-500 text-xs mt-1">
                            {{ errorMessage }}
                        </p>
                    </div>
                    <p v-if="errorMessage && errorMessage !== 'Please fill in all fields' && errorMessage !== 'Please enter a valid email'" class="text-red-500 text-center text-sm">{{ errorMessage }}</p>

                    <p class="text-center text-sm">
                        New to Hirely?
                        <router-link to="/register" class="text-green-500 font-semibold">
                            Register
                        </router-link>
                        for free
                    </p>

                    <button type="submit"
                        class="w-full bg-[#6ed473] text-white rounded-pill font-semibold py-2 transition duration-200 shadow-xl :hover:bg-[#0be43a] hover:shadow-slate-800 hover:scale-100">
                        Login
                    </button>


                    <div class="col-span-2 flex flex-col gap-4 mt-4">
                        <div>
                            <label class="block text-sm font-medium mb-1">Choose Role for Google Login</label>
                            <select v-model="selectedRole"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                <option disabled value="">Select a role</option>
                                <option value="employee">Employee</option>
                                <option value="employer">Employer</option>
                            </select>
                        </div>

                        <div class="flex items-center gap-2 justify-center">
                            <span class="text-sm">Or login with Google</span>
                            <GoogleLogin :callback="handleGoogleLogin" />
                        </div>
                    </div>

                </form>
            </div>
        </div>
    </div>
</template>
