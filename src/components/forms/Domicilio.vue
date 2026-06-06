<script setup lang="ts">
import Label from '@/components/forms/Label.vue'
import FormRow from '@/components/forms/FormRow.vue'
import CheckBox from '@/volt/CheckBox.vue'
import { onMounted } from 'vue'
import FormCol from '@/components/forms/FormCol.vue'
import type { Maybe } from '@/lib/tipos/generics'
import type { IDomicilio } from '@/lib/tipos/domicilio'
import { FormField} from "@primevue/forms"
import { domicilioSchema } from '@/validations/domicilio.ts'


const props = withDefaults(defineProps<{
    disabled?: boolean,
    label?: Maybe<string>|boolean,
    border?: boolean,
    class?: string,
    background?: boolean }>(), {
    disabled: false,
    label: "Domicilio",
    border: true,
    background: true});
const domicilio = defineModel<IDomicilio>("value",{
    default: {
        direccion: null,
        no_tiene_altura: false,
        codigo_postal: null,
        localidad: null,
        ciudad: null,
        provincia: null
    }
})
console.log(domicilio)
onMounted(() => {
    console.log(domicilio)
})
const validate = async () => {
    const r = await domicilioSchema.validate(domicilio)
    console.log(r)
}
</script>

<template>
    <Label v-if="label" :class="['text-2xl! m-auto  w-full text-center rounded-lg', background ? 'bg-surface-50' : ''] ">{{ typeof label == 'string' ? label : ''}}</Label>
    <div :class="[' rounded-lg py-3 flex flex-col gap-6',props.class,border ? 'border border-surface-300 px-3' : '']">
        <FormRow>
            <FormCol :span="6" :gap="4">
                <Label required>Dirección</Label>
                <div class="flex flex-row">
                    <FormField as-child name="domicilio.direccion">
                    <InputText v-model="domicilio.direccion" class="grow rounded-e-none"
                               placeholder="Ej. Palpa 2453"></InputText>
                    </FormField>
                    <FormField as-child name="domicilio.codigo_postal">
                    <InputText v-model="domicilio.codigo_postal" placeholder="CP: 1028"
                               class="shrink max-w-[23%] rounded-s-none"></InputText>
                    </FormField>
                </div>
                <div class="flex flex-row gap-3 min-h-12.5">
                    <Label required class="text-sm!">Mi domicilio no tiene altura</Label>
                    <FormField as-child name="domicilio.no_tiene_altura">
                    <CheckBox class="my-auto" v-model="domicilio.no_tiene_altura" binary></CheckBox>
                    </FormField>
                </div>
            </FormCol>
            <FormCol :span="6">
                <Label required>Localidad</Label>
                <FormField as-child name="domicilio.localidad">
                <InputText placeholder="Ej. CABA" v-model="domicilio.localidad"></InputText>
                </FormField>
                <div class="pb-7 text-white">.</div>

            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="6">
                <Label required>Ciudad</Label>
                <FormField as-child name="domicilio.ciudad">
                <InputText v-model="domicilio.ciudad" placeholder="Ej. CABA"></InputText>
                </FormField>
            </FormCol>
            <FormCol :span="6">
                <Label required>Provincia</Label>
                <FormField as-child name="domicilio.provincia">
                <InputText v-model="domicilio.provincia" placeholder="Ej. Buenos Aires"></InputText>
                </FormField>
            </FormCol>
        </FormRow>
    </div>

</template>

<style scoped>

</style>