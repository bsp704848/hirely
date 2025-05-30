import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'primeicons/primeicons.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import router from './router'
import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEdit, faTrash, faPlus, faSave ,faArrowUp,faBars,faXmark,faFilter } from '@fortawesome/free-solid-svg-icons'

library.add(faEdit, faTrash, faPlus,faSave, faArrowUp,faBars,faXmark,faFilter)
const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Toast)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
