import { createApp } from 'vue'
import './style.css'
import axios from 'axios';
import router from './router/router';
import App from './App.vue'

axios.defaults.baseURL = "http://localhost:8080"
axios.defaults.headers.get['Accepts'] = 'application/json'

createApp(App)
  .use(router)
  .mount('#app')