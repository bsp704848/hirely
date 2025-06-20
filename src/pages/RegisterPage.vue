<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/authStore'
import signupImage from '../assets/signup2.svg'
import { GoogleLogin } from 'vue3-google-login'

const form = ref({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
})

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()
const baseURL = import.meta.env.VITE_API_BASE_URL

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const errorMessage = ref('')

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

const validatePassword = (password) => {

    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return re.test(password);
}

const handleSubmit = async () => {
    if (!form.value.username || !form.value.email || !form.value.password || !form.value.confirmPassword || !form.value.role) {
        errorMessage.value = 'Please fill in all fields'
        return
    }
    if (!validateEmail(form.value.email)) {
        errorMessage.value = 'Please enter a valid email'
        return
    }
    if (!validatePassword(form.value.password)) {
        errorMessage.value = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character'
        return
    }
    if (form.value.password !== form.value.confirmPassword) {
        errorMessage.value = 'Passwords do not match'
        return
    }
    errorMessage.value = '';

    const newUser = {
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
        role: form.value.role,
    };

    try {
        await authStore.register(newUser);
        authStore.logout();
        toast.success(`${newUser.username} registered successfully as ${newUser.role}`);
        router.push('/login');
        form.value = { username: '', email: '', password: '', confirmPassword: '', role: '' };
    } catch (error) {
        toast.error(error.message);
    }
}

const handleGoogleLoginSuccess = async (response) => {
    const token = response.credential
    console.log('Google Token:', token)

    try {
        const res = await fetch(`${baseURL}/api/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (!res.ok) throw new Error(data.message || 'Google login failed')


        authStore.setUser(data.user)

        toast.success('Login successful with Google')
        router.push('/')
    } catch (error) {
        console.error('Google login error:', error)
        toast.error(error.message)
    }
}


</script>

<template>
    <div class="min-h-screen grid grid-cols-1 md:grid-cols-2">

        <div class="hidden md:flex items-center justify-center">
            <img :src="signupImage" alt="image" class="w-3/4 h-auto" />
        </div>

        <div class="flex items-center justify-center p-8">
            <div class="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 class="text-2xl font-bold mb-6 text-center">Create your Account ...</h2>
                <form @submit.prevent="handleSubmit" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-sm font-medium mb-1">Username</label>
                        <input type="text" v-model="form.username" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Your username" />
                    </div>

                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-sm font-medium mb-1">Email</label>
                        <input type="email" v-model="form.email" required
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Your email" />
                    </div>

                    <div class="col-span-2">
                        <label class="block text-sm font-medium mb-1">Role</label>
                        <select v-model="form.role"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
                            <option disabled value="">Select</option>
                            <option value="employee">Employee</option>
                            <option value="employer">Employer</option>
                        </select>
                    </div>

                    <div class="col-span-2 md:col-span-1 relative">
                        <label class="block text-sm font-medium mb-1">Password</label>
                        <input :type="showPassword ? 'text' : 'password'" v-model="form.password" required
                            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Password" />
                        <i :class="`pi ${showPassword ? 'pi-eye-slash' : 'pi-eye'}`"
                            class="absolute right-3 top-10 text-gray-500 cursor-pointer"
                            @click="showPassword = !showPassword"></i>
                    </div>

                    <div class="col-span-2 md:col-span-1 relative">
                        <label class="block text-sm font-medium mb-1">Confirm Password</label>
                        <input :type="showConfirmPassword ? 'text' : 'password'" v-model="form.confirmPassword" required
                            class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            placeholder="Confirm Password" />
                        <i :class="`pi ${showConfirmPassword ? 'pi-eye-slash' : 'pi-eye'}`"
                            class="absolute right-3 top-10 text-gray-500 cursor-pointer"
                            @click="showConfirmPassword = !showConfirmPassword"></i>
                    </div>

                    <p v-if="errorMessage" class="col-span-2 text-red-500 text-center text-sm">{{ errorMessage }}</p>
                    <p class="col-span-2 text-center text-sm">Already Registered ? <router-link to="/login"
                            class="text-green-500 font-semibold">Login</router-link> here</p>


                    <button type="submit"
                        class="col-span-2 w-full bg-[#4cbb42] text-white rounded-pill font-semibold py-2 transition duration-200 shadow-xl :hover:bg-[#0be43a] hover:shadow-slate-800 hover:scale-100">
                        Register
                    </button>

                </form>
                <div class="flex justify-center mt-8">
                    <p class="flex items-center gap-2 text-sm">
                        Login with Google
                        <GoogleLogin :callback="handleGoogleLoginSuccess" />
                        <i @click="handleGoogleLogin" class="pi pi-google text-2xl text-green-500"></i>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
