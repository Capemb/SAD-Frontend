// main.js
import { createApp } from 'vue'
import App from './App.vue'
import api, { setAuthToken } from './http/api'
import router from './router' // Make sure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
const app = createApp(App)

app.use(router) // This tells your app to use the router
const token = localStorage.getItem('auth_token_usuario')
if (token) {
  setAuthToken(token)
}

app.mount('#app')