<script setup lang="ts">

import FormCol from '@/components/forms/FormCol.vue'
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import { reactive, type Ref, ref } from 'vue'
import moment from 'moment'
import DatePicker from '@/volt/DatePicker.vue'
import Label from '@/components/forms/Label.vue'
import FormRow from '@/components/forms/FormRow.vue'
import { rutas_api } from '@/rutas_api.ts'
import { useResponse } from '@/lib/utils/response.ts'
import { useAxios } from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
const props = defineProps<{evento: IEventoVacunacion}>()
const emits = defineEmits<{ close: [] }>()
const {unwrap, tryLogError}=useResponse()
const toast = useToast()
const {axios}=useAxios()
const data = reactive({
    ...props.evento,
     fecha_evento: moment(props.evento.fecha_evento).toDate(),
})
const save = async () => {
    if(!(data.fecha_evento||data.cupo_maximo)){
        errores.value.push("ingrese al menos un dato");
        return
    }
    try{
        const r = await unwrap(axios.value.put(rutas_api.eventos_vacunacion.UPDATE(props.evento.id_evento_vacunacion),{
            fecha_evento: moment(data.fecha_evento).utc().format("DD/MM/YYYY"),
            cupo_maximo: data.cupo_maximo
        }))
        console.log(r.data)
        toast.add({ severity: "success", detail: r.message })
        emits('close')
    }catch (error){
        tryLogError(<Error>error, toast)
    }
}
const errores: Ref<string[]> = ref([])
</script>

<template>
    <Message></Message>
    <FormRow>
        <FormCol :span="12" >
            <Label><i class="pi pi-calendar p-1"></i> Fecha del evento</Label>
            <DatePicker v-model="data.fecha_evento"></DatePicker>
        </FormCol>
        <FormCol :span="12" >
            <Label>Cupo máximo</Label>
            <InputNumber show-buttons :min="parseInt(data.inscriptos)" v-model="data.cupo_maximo"></InputNumber>
        </FormCol>
    </FormRow>
    <div class="flex flex-row gap-3 justify-end py-3">
        <Button label="Cancelar" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" icon="pi pi-times" @click="$emit('close')"></Button>
        <Button label="Guardar" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" icon="pi pi-save" @click="save"></Button>
    </div>
</template>

<style scoped>

</style>