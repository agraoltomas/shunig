import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import PrimeVue from 'primevue/config'
import "@/assets/style/styles.css";
import 'primeicons/primeicons.css';
import router from './router'
import {  ToastService } from 'primevue'
import { registerAll } from '@/volt/register.ts'
import ElementPlusX from 'vue-element-plus-x';
const app = createApp(App)
app.use(createPinia())

app.use(ElementPlusX);
import "vue-element-plus-x/styles/index.css"
app.use(router)
app.use(PrimeVue, {
  unstyled: true,
})
app.use(ToastService);
registerAll(app);
// @ts-ignore

app.mount('#app')
