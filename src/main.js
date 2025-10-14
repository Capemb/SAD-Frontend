// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Make sure the path is correct
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
const app = createApp(App)

app.use(router) // This tells your app to use the router

app.mount('#app')