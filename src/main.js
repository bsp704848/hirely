import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import 'primeicons/primeicons.css'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import router from './router'
import GoogleLoginPlugin from 'vue3-google-login'

import { createPinia } from 'pinia'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faEdit,faCalendarWeek, faInfoCircle, faBriefcase, faClock, faMoneyBill, faUsers,
    faBuilding, faEnvelope, faPhone, faMapMarkerAlt, faCheckCircle ,faTrash, faPlus, faSave, faArrowUp, faBars, faXmark,faLocationDot,faList,faIndianRupee, faFontAwesomeFlag ,} from '@fortawesome/free-solid-svg-icons'
import vuetify from './plugins/vuetify'

library.add(faEdit, faTrash, faInfoCircle, faBriefcase,faCalendarWeek, faClock, faMoneyBill, faUsers,
    faBuilding, faEnvelope, faPhone, faMapMarkerAlt, faCheckCircle,faPlus,faSave, faArrowUp,faBars,faXmark,faLocationDot,faList,faIndianRupee,faFontAwesomeFlag)

const app = createApp(App)
.use(GoogleLoginPlugin, {
   clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
  })
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(Toast);
app.component('font-awesome-icon', FontAwesomeIcon)
app.use(vuetify)
app.mount('#app')
