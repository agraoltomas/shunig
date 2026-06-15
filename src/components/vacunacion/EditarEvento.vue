<script setup lang="ts">

import FormCol from '@/components/forms/FormCol.vue'
import type { IEventoVacunacion } from '@/lib/tipos/vacunacion.ts'
import { reactive } from 'vue'
import moment from 'moment'
import DatePicker from '@/volt/DatePicker.vue'
import Label from '@/components/forms/Label.vue'
import FormRow from '@/components/forms/FormRow.vue'
const props = defineProps<{evento: IEventoVacunacion}>()
const emits = defineEmits<{ close: [] }>()
const data = reactive({
    ...props.evento,
     fecha_evento: moment(props.evento.fecha_evento).toDate(),
})
</script>

<template>
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
        <Button label="Guardar" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" icon="pi pi-save"></Button>
    </div>
</template>

<style scoped>

</style>