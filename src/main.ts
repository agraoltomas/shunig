import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

import "@/assets/styles.css";



const app = createApp(App)
app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
  unstyled: true,
})
import Tabs from '@/volt/Tabs.vue'
import TabList from '@/volt/TabList.vue'
import Tab from '@/volt/Tab.vue'
import TabPanels from '@/volt/TabPanels.vue'
import TabPanel from '@/volt/TabPanel.vue'
import InputText from '@/volt/InputText.vue'
import Password from '@/volt/Password.vue'
import Button from '@/volt/Button.vue'
import { ToastService } from 'primevue';

app.use(ToastService);
app.component('InputText', InputText)
app.component('Tabs', Tabs)
app.component('TabPanels', TabPanels)
app.component('Password', Password)
app.component('TabPanel', TabPanel)
app.component('Tab',Tab)
app.component('TabList',TabList)
app.component('Button',Button)

app.mount('#app')
