import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import RegisterPage from '../components/RegisterPage.vue'
import LoginPage from '../components/LoginPage.vue'
import EmployerDashboard from '../pages/EmployerDashboard.vue'
import HomePage from '../pages/HomePage.vue'
import JobForm from '../components/JobForm.vue'
import JobList from '../components/JobList.vue' 
import JobDetails from '../pages/JobDetails.vue'
import AboutPage from '../pages/AboutPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
import EmployerJobListPage from '../pages/EmployerJobListPage.vue'

const routes = [
  { path: '/',name:'HomePage', component: HomePage  },
  { path: '/register',name:'RegisterPage', component: RegisterPage },
  { path: '/login',name:'LoginPage', component: LoginPage },
  { path: '/employer', name: 'EmployerDashboard', component: EmployerDashboard , meta: { requiresAuth: true, role: 'employer' }},
  { path: '/addJob',name:'JobForm', component: JobForm , meta: { requiresAuth: true, role: 'employer' } },
  { path: '/jobs', component: JobList },
  { path: '/job/:id', component: JobDetails , meta: { requiresAuth: true, role: 'employee' } },
  { path: '/about', component: AboutPage },
  { path: '/employerjoblist/:id', component: EmployerJobListPage , meta: { requiresAuth: true, role: 'employer' }  },
  { path: '/:pathMatch(.*)*', component: NotFoundPage },

]

export const router = createRouter({
  history: createWebHistory(),
  routes, 
  scrollBehavior() {
    return { top: 0 }
  }
}) 


router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = authStore.isLoggedIn
  const role = authStore.role

  if (to.meta.requiresAuth && !isLoggedIn) {
    return next('/login')
  }

  if (to.meta.role && to.meta.role !== role) {
    return next('/')
  }

  next()
}) 

export default router