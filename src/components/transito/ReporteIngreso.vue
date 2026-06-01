<script setup lang="ts">

import Label from '@/components/forms/Label.vue'
import FileUpload from '@/components/forms/FileUpload.vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import { useFile } from '@/lib/utils/files.ts'
import { computed, type Ref, ref } from 'vue'
import type { Maybe, MessageResponse } from '@/lib/tipos/generics'
import type { IMascota } from '@/lib/tipos/mascotas'
import { useAxios } from '@/lib/axios.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useToast } from '@/lib/toast/toast.ts'

const props = defineProps<{ mascota: Maybe<IMascota> }>()
const { file, asBase64 } = useFile()
const detalle: Ref<Maybe<string>> = ref('Esta semana Logan se robo 3 zapatos de mi armario y los destruyo. Se nota que esta con ansiedad. Nosotros tratamos de no dejarlo solo, pero al estar trabajando, el necesita atencion de nosotros.')
const { axios } = useAxios()
const toast = useToast()
const emit = defineEmits<{ cargado: [] }>()
const validar = computed(() => {
    return !!detalle.value
        && detalle.value.length <= 200
        && detalle.value.length > 100
        && !!file.value
})
const ingresarReporte = async () => {
    if (!props.mascota) return
    if (!validar.value) return
    if (!(props.mascota.transito || props.mascota.adopcion)) return
    const ruta = props.mascota.transito ? rutas_api.transito : rutas_api.adopcion
    try {
        const r = await axios.value.post(ruta.reporte.CARGAR({ id_mascota: props.mascota.id_animal }), {
            detalle: detalle.value,
            imagen: await asBase64()
        })
        const response: MessageResponse<any> = r.data
        toast.add({ detail: response.message, severity: 'success' })
        emit('cargado')
    } catch (e) {

    }
}
</script>

<template>
    <div class="flex flex-col gap-3">
        <FormRow>
            <FormCol :span="12">
                <Label required>Detalle</Label>
                <Textarea maxlength="200" minlength="100" size="large" class="min-h-36" min
                          v-model="detalle"></Textarea>
            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="12">
                <Label required>Subir foto</Label>
                <FileUpload v-model="file"></FileUpload>
            </FormCol>
        </FormRow>
        <div>
            <Button label="Cargar" :disabled="!validar" @click="ingresarReporte"></Button>
        </div>
    </div>
</template>

<style scoped>

</style>