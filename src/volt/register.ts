
import Tabs from '@/volt/Tabs.vue'
import TabList from '@/volt/TabList.vue'
import Tab from '@/volt/Tab.vue'
import TabPanels from '@/volt/TabPanels.vue'
import TabPanel from '@/volt/TabPanel.vue'
import InputText from '@/volt/InputText.vue'
import Password from '@/volt/Password.vue'
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import DangerButton from '@/volt/DangerButton.vue'
import ContrastButton   from '@/volt/ContrastButton.vue'
import Panel from "@/volt/Panel.vue"
import InputNumber from '@/volt/InputNumber.vue'
import Textarea from '@/volt/Textarea.vue'
import Image from "primevue/image"
import Column from "primevue/column";
import Message from "@/volt/Message.vue";
import Select from "@/volt/Select.vue"


import type { App } from 'vue'
export const registerAll = (app: App): App => {
    app.component('InputText', InputText)
    app.component('Tabs', Tabs)
    app.component('TabPanels', TabPanels)
    app.component('Password', Password)
    app.component('TabPanel', TabPanel)
    app.component('Tab',Tab)
    app.component('TabList',TabList)
    app.component('Button',Button)
    app.component('Panel',Panel)
    app.component('SecondaryButton',SecondaryButton);
    app.component('DangerButton',DangerButton);
    app.component('ContrastButton',ContrastButton);
    app.component('InputNumber',InputNumber)
    app.component("Message", Message)
    app.component("Select", Select)
    app.component('Textarea', Textarea)
    app.component('Image',Image)
    app.component("Column",Column)


    return app;
}