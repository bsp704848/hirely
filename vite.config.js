import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),
    vuetify({ autoImport: true }) 
  ],
  // server: {
  //   host: '192.168.1.31', 
  //   port: 5173       
  // }
})
