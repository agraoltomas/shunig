import { createApp } from 'vue'
import { createPinia } from 'pinia'


import App from './App.vue'
import PrimeVue from 'primevue/config'
import "@/assets/style/styles.css";
import 'primeicons/primeicons.css';
import Image from "primevue/image"
import Column from "primevue/column";
import InputText from "@/volt/InputText.vue"
import Message from "@/volt/Message.vue";
import Select from "@/volt/Select.vue"
const app = createApp(App)
app.use(createPinia())
console.log("!!!")
import router from './router'
app.use(router)
app.use(PrimeVue, {
  unstyled: true,
})
app.component('Image',Image)
app.component("Column",Column)
app.component("InputText", InputText)
app.component("Message", Message)
app.component("Select", Select)
import {  ToastService } from 'primevue'
import { registerAll } from '@/volt/register.ts'

app.use(ToastService);
registerAll(app);

app.mount('#app')
