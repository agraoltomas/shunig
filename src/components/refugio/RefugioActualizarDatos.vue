<script setup lang="ts">
import Domicilio from '@/components/forms/Domicilio.vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import { ref } from 'vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import { Form } from '@primevue/forms'
import type { FormSubmitEvent } from '@primevue/forms/form'
import { useAxios } from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import ContenedorTitulo from '@/components/generales/ContenedorTitulo.vue'

const props = defineProps<{ class?: string }>()

const { refugio, reloadRefugio } = useRefugioStore()
const domicilio = ref(refugio?.domicilio)
const { axios } = useAxios()
const toast = useToast()

const actualizarDomicilio = async (c: FormSubmitEvent) => {
    if (!refugio) return

    if (!confirm('Actualizar domicilio?')) return

    await axios.value.patch(`/refugio/${refugio.id_refugio}`, {
        domicilio: c.values.domicilio
    })

    toast.add({
        detail: 'Domicilio actualizado exitosamente',
        severity: 'success'
    })

    await reloadRefugio()
}

const actualizarDatosDeContacto = async (c: FormSubmitEvent) => {
    if (!refugio) return

    if (!confirm('Actualizar datos de contacto?')) return

    await axios.value.patch(`/refugio/${refugio.id_refugio}`, {
        email: c.values.mail,
        telefono: c.values.telefono
    })

    toast.add({
        detail: 'Datos actualizados exitosamente',
        severity: 'success'
    })

    await reloadRefugio()
}
</script>

<template>
    <div :class="['w-[75vw] m-auto flex flex-col gap-4 mt-5 mb-15', props.class]">
        <div class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white">
            <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
                <div>
                    <div class="font-bold text-2xl">
                        Datos del refugio
                    </div>

                    <div class="text-gray-500 mt-1">
                        Administrá el domicilio y los datos de contacto visibles del refugio.
                    </div>
                </div>

                <div class="rounded-full bg-primary-200/30 w-20 h-20 flex items-center justify-center">
                    <i class="pi pi-home text-primary-500 text-3xl"></i>
                </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
                <div class="rounded-xl border border-gray-200 p-4">
                    <div class="text-sm text-gray-500">Refugio</div>
                    <div class="text-xl font-bold text-gray-700">
                        {{ refugio?.nombre || '-' }}
                    </div>
                </div>

                <div class="rounded-xl border border-gray-200 p-4">
                    <div class="text-sm text-gray-500">Email</div>
                    <div class="text-xl font-bold text-gray-700">
                        {{ refugio?.email || '-' }}
                    </div>
                </div>

                <div class="rounded-xl border border-gray-200 p-4">
                    <div class="text-sm text-gray-500">Teléfono</div>
                    <div class="text-xl font-bold text-gray-700">
                        {{ refugio?.telefono || '-' }}
                    </div>
                </div>
            </div>
        </div>

        <Form
            v-slot="$form"
            :initial-values="{ domicilio: refugio?.domicilio }"
            @submit="actualizarDomicilio"
            class="flex flex-col gap-4"
        >
            <ContenedorTitulo
                title="Domicilio"
                icon="pi pi-map-marker"
                class="m-1"
            >
                <Domicilio
                    label="Actualizar datos de domicilio"
                    :background="false"
                    :border="false"
                    v-model:value="domicilio"
                />

                <div class="flex flex-row justify-end pt-3">
                    <Button
                        type="submit"
                        icon="pi pi-check"
                        label="Actualizar domicilio"
                        class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                    />
                </div>
            </ContenedorTitulo>
        </Form>

        <Form
            :initial-values="{ mail: refugio?.email, telefono: refugio?.telefono }"
            @submit="actualizarDatosDeContacto"
            class="flex flex-col gap-4"
        >
            <ContenedorTitulo
                title="Datos de contacto"
                icon="pi pi-envelope"
                class="m-1"
            >
                <FormRow class="w-full">
                    <FormCol :span="6">
                        <Label for="mail">
                            Mail
                        </Label>

                        <InputText
                            id="mail"
                            fluid
                            name="mail"
                            placeholder="Ej: refugio@email.com"
                        />
                    </FormCol>

                    <FormCol :span="6">
                        <Label for="telefono">
                            Teléfono
                        </Label>

                        <InputText
                            id="telefono"
                            fluid
                            name="telefono"
                            placeholder="Ej: 11 5555-5555"
                        />
                    </FormCol>
                </FormRow>

                <div class="flex flex-row justify-end pt-3">
                    <Button
                        type="submit"
                        icon="pi pi-check"
                        label="Actualizar contacto"
                        class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                    />
                </div>
            </ContenedorTitulo>
        </Form>
    </div>
</template>

<style scoped>
</style>