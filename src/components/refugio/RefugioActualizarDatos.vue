<script setup lang="ts">

import Domicilio from '@/components/forms/Domicilio.vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import { ref } from 'vue'
import Separador from '@/components/generales/Separador.vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import { Form } from '@primevue/forms'
import type { FormSubmitEvent } from '@primevue/forms/form'
import { useAxios } from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { useRouter } from 'vue-router'


const props = defineProps<{ class?: string }>()
const { refugio, reloadRefugio } = useRefugioStore()
const router = useRouter()
const domicilio = ref(refugio?.domicilio)
const { axios } = useAxios()
const toast = useToast()
const actualizarDomicilio = async (c: FormSubmitEvent) => {
    if (!refugio) return
    console.log(c, c.values, c.valid)
    if (!confirm('Actualizar domicilio?')) return
    try {
        const r = await axios.value.patch(`/refugio/${refugio?.id_refugio}`, {
            domicilio: c.values.domicilio
        })
        toast.add({ detail: 'Domicilio actualizado exitosamente', severity: 'success' })
        await reloadRefugio()
    } catch (error) {
    }
}
const actualizarDatosDeContacto = async (c: FormSubmitEvent) => {
    if (!refugio) return
    if (!confirm('Actualizar datos de contacto?')) return
    const r = await axios.value.patch(`/refugio/${refugio?.id_refugio}`, {
        email: c.values.mail,
        telefono: c.values.telefono
    })
    toast.add({ detail: 'datos actualizados exitosamente', severity: 'success' })
    await
        reloadRefugio()
}
</script>

<template>
    <Form v-slot="$form" :class="['p-3 flex flex-col gap-3', props.class]"
          :initial-values="{ domicilio: refugio.domicilio}" @submit="actualizarDomicilio">
        <Separador />
        <Domicilio label="Actualizar datos de domicilio" :background="false" :border="false"
                   v-model:value="domicilio"></Domicilio>
        <div class="flex flex-row justify-center">
            <Button label="Actualizar" type="submit"></Button>
        </div>
    </Form>
    <Separador />
    <Form :initial-values="{ mail: refugio?.email, telefono: refugio?.telefono}" @submit="actualizarDatosDeContacto">
        <h1 class="font-semibold mb-3 text-2xl text-center">Actualizar datos de contacto</h1>
        <FormRow>
            <FormCol :span="6">
                <Label>Mail</Label>
                <InputText name="mail"></InputText>
            </FormCol>
            <FormCol :span="6">
                <Label>Teléfono</Label>
                <InputText name="telefono"></InputText>
            </FormCol>
        </FormRow>
        <div class="mt-3 flex flex-row justify-center">
            <Button label="Actualizar" type="submit"></Button>
        </div>
    </Form>

</template>

<style scoped>

</style>