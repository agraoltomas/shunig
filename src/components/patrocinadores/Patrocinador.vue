<script setup lang="ts">
import { ref, reactive, type Reactive } from 'vue'
import type { IPatrocinador } from '@/lib/tipos/patrocinadores'
import moment from 'moment'
import DataBlock from '@/components/generales/DataBlock.vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { useModalStore } from '@/stores/modales'

const toast = useToast();
const modalesStore = useModalStore();

const props = defineProps<{
    patrocinador: IPatrocinador
}>()

const emits = defineEmits<{
    actualizado: [patrocinador: IPatrocinador]
    eliminado: []
}>();

const editando = ref(false)

const newValues: Reactive<{ [K in keyof IPatrocinador]?: any }> = reactive({})

const updateNew = (campo: keyof IPatrocinador, valor: any) => {
    newValues[campo] = valor
}

const actualizarPatrocinador = async () => {
    console.log('Valores modificados del patrocinador:', newValues)
    const r = await axios.patch(`/patrocinador/${props.patrocinador.id_patrocinador}`, 
        {...newValues
        });
    if([200,201].includes(r.status)){
        const patrocinadorActualizado = r.data.data;
        toast.add({severity:"success", summary:"Éxito!", detail: 
        `${patrocinadorActualizado.nombre} se modificó exitosamente`
        })
        editando.value = false;
        emits('actualizado', patrocinadorActualizado)
    }
}

const eliminarPatrocinador = async()=>{
}
</script>

<template>
    <div class="flex justify-center mt-3">
    <Panel
        v-if="patrocinador"
        class="border-white! border-0 overflow-auto m-3 w-[60%]"
        pt:header="p-0!">
        
        <template #header>
            <div class="w-full h-full">
                <div
                    v-if="editando"
                    class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white"
                >
                    <InputText
                        :value="patrocinador.nombre"
                        @update:model-value="(valor) => updateNew('nombre', valor)"
                    />
                </div>

                <div
                    v-else
                    class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white"
                >
                    {{ patrocinador.nombre }}
                </div>
            </div>
        </template>

        <div v-if="editando" class="flex justify-center">
            <div class="flex flex-col mx-6 gap-3 pt-5 ">
            <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold">
                Fecha de alta | {{ moment(patrocinador.fecha_alta).format('DD-MM-YYYY') }}
            </div>

            <FormRow class="text-start text-lg font-semibold">
                <FormCol modo="horizontal" :span="12">
                    <Label>Contacto</Label>
                    <InputText
                        fluid
                        :value="patrocinador.contacto"
                        @update:model-value="(valor) => updateNew('contacto', valor)"
                    />
                </FormCol>
            </FormRow>

            <FormRow class="text-start text-lg font-semibold">
                <FormCol modo="horizontal" :span="12">
                    <Label>Email</Label>
                    <InputText
                        fluid
                        :value="patrocinador.email"
                        @update:model-value="(valor) => updateNew('email', valor)"
                    />
                </FormCol>
            </FormRow>

            <FormRow class="text-start text-lg font-semibold">
                <FormCol :span="12">
                    <Label>Descripción</Label>
                    <Textarea
                        :model-value="patrocinador.descripcion"
                        @update:model-value="(valor) => updateNew('descripcion', valor)"
                    />
                </FormCol>
            </FormRow>
        </div></div>

        <div v-else class="flex justify-center">
            <div class="flex flex-col mx-6 gap-3 pt-5 ">
            <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold">
                Fecha de alta | {{ moment(patrocinador.fecha_alta).format('DD-MM-YYYY') }}
            </div>

            <DataBlock label="Contacto" :data="patrocinador.contacto" />

            <hr class="border-surface-500/80!" />

            <DataBlock label="Email" :data="patrocinador.email" />

            <hr class="border-surface-500/80!" />

            <DataBlock label="Descripción" :data="patrocinador.descripcion" />
            </div>
        </div>

        <div class="flex justify-end gap-3 px-6 py-4">
            <Button
                v-if="editando"
                icon="pi pi-check"
                label="Guardar"
                @click="actualizarPatrocinador"
            />

            <Button
                :icon="editando ? 'pi pi-times' : 'pi pi-pencil'"
                :label="editando ? 'Cancelar' : 'Editar'"
                @click="() => editando = !editando"
            />
            <DangerButton v-if="!editando" icon="pi pi-trash" label="Eliminar" 
            @click="() => modalesStore.abrir('eliminar', {
                nombre: patrocinador.nombre,
                endpoint: `/patrocinador/${patrocinador.id_patrocinador}`,
                volverPrincipal: '/refugio/patrocinadores'
            })"></DangerButton>
        </div>

    </Panel>
</div>
</template>

<style scoped>
</style>