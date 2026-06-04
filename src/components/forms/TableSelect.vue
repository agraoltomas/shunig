<script setup lang="ts">
import type { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import { onMounted, type Ref, ref } from 'vue'
import axios from '@/lib/axios.ts'
import Select from "@/volt/Select.vue"
const model = defineModel();


const props = defineProps<{ tipo: TablaEstatica, name?: string, fluid?: boolean, placeholder?: string }>();
interface ITablaEstatica {
    id: number,

}

const data: Ref<ITablaEstatica[]> = ref([]);
onMounted(async () => {
    const r = await axios.get(`/${props.tipo}/`);
    if(r.status === 200) {
        data.value = r.data.map((d: any) =>({
            // AAAAAAAAAA
            id: isNaN(Number(d[`id_${props.tipo}`])) ? 0 : Number(d[`id_${props.tipo}`]),
            descripcion: d['descripcion'],
        }));
        console.log(r.data);
    }
})
</script>

<template>
    <Select :fluid :name="name" :placeholder="placeholder" v-model="model" :options="data" option-label="descripcion" option-value="id"></Select>
</template>

<style scoped>

</style>