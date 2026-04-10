import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import "@/assets/style/styles.css";
import 'primeicons/primeicons.css';
import Image from "primevue/image"
import Column from "primevue/column";
import InputText from "@/volt/InputText.vue"
import Message from "@/volt/Message.vue";

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  unstyled: true,
})
app.component('Image',Image)
app.component("Column",Column)
app.component("InputText", InputText)
app.component("Message", Message)
import {  ToastService } from 'primevue'
import { registerAll } from '@/volt/register.ts'

app.use(ToastService);
registerAll(app);

app.mount('#app')
