<script setup lang="ts">
import Label from '@/components/forms/Label.vue'
import FormRow from '@/components/forms/FormRow.vue'
import CheckBox from '@/volt/CheckBox.vue'
import { onMounted, type Ref, ref, watch } from 'vue'
import FormCol from '@/components/forms/FormCol.vue'
import AutoComplete from '@/volt/AutoComplete.vue'
import type { Maybe } from '@/lib/tipos/generics'
import type { IDomicilio } from '@/lib/tipos/domicilio'
import { FormField} from "@primevue/forms"
import { domicilioSchema } from '@/validations/domicilio.ts'
import { debounce } from 'lodash'
import { useAxios } from '@/lib/axios.ts'
import type { AutoCompleteOptionSelectEvent } from 'primevue/autocomplete'

const {axios} = useAxios()

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
        altura: null,
        no_tiene_altura: false,
        localidad: null,
        provincia: null
    }
})
onMounted(() => {
    console.log(domicilio)
})
const validate = async () => {
    const r = await domicilioSchema.validate(domicilio)
    console.log(r)
}
const direcciones = ref([])

const buscar = debounce(async (d: Event) => {
    if(!dire.value || dire.value.length < 3)return;
    try{
        const r = await axios.value.get('https://apis.datos.gob.ar/georef/api/direcciones',{
            params: {
                direccion: dire.value
            }
        })
        console.log(r)
        direcciones.value = r.data.direcciones
    }catch (error){
        validationFailed.value = true
    }
}, 1000,{trailing: true})
const highlight = (match: string, haystack: string) =>{
    const regex = new RegExp(`(${match})`, 'gi');
    return haystack.replace(regex, '<b>$1</b>');
}

const direccion: Ref<Maybe<object>> = ref(null)
const dire: Ref<Maybe<string>> =ref(null)
watch(() => direccion.value, () => {
    console.log(direccion.value)
})
const loadDire = (e: AutoCompleteOptionSelectEvent) => {
    interface TipoApi {
        id: string, nombre: string
    }
    interface ValorApi {
        unidad: string, valor: string
    }
    const ndire: {
        altura: ValorApi,
        calle: TipoApi,
        departamento:TipoApi,
        localidad_censal: TipoApi,
        nomenclatura: string,
        provincia: TipoApi
    } = e.value
    dire.value = ndire.nomenclatura
    domicilio.value.direccion = `${ndire.calle.nombre} ${ndire.altura.valor}`
    domicilio.value.altura = ndire.altura.valor
    domicilio.value.provincia = ndire.provincia.nombre
    domicilio.value.localidad = ndire.localidad_censal.nombre
}

const validationFailed = ref(false)
</script>


<template>
    <Label v-if="label" :class="['text-2xl! m-auto  w-full text-center rounded-lg', background ? 'bg-surface-50' : ''] ">{{ typeof label == 'string' ? label : ''}}</Label>
    <div :class="[' rounded-lg py-3 flex flex-col gap-6',props.class,border ? 'border border-surface-300 px-3' : '']">
        <FormRow>
            <FormCol :span="6" :gap="4">
                <Label required>Dirección</Label>
                <div class="flex flex-row">
                    <AutoComplete fluid v-model="dire" :suggestions="direcciones"  option-label="nomenclatura" class="grow" pt:root="rounded-e-none!"
                               placeholder="Ej. Palpa 2453" @complete="buscar" @option-select="loadDire">
                        <template #option="{option}">
                            <p v-if="dire" v-html="highlight(dire,option.nomenclatura)"></p>
                        </template>
                    </AutoComplete>
                </div>
                <div class="flex flex-row gap-3 min-h-12.5">
                    <Label required class="text-sm!">Mi domicilio no tiene altura</Label>
                    <CheckBox class="my-auto" v-model="domicilio.no_tiene_altura" binary></CheckBox>
                </div>
            </FormCol>
            <FormCol :span="6">
                <Label required>Localidad</Label>
                <InputText :disabled="!validationFailed" placeholder="Ej. CABA" :value="domicilio.localidad"></InputText>
                <div class="pb-7 text-white">.</div>
            </FormCol>
        </FormRow>
        <FormRow>
            <FormCol :span="6">
                <Label required>Provincia</Label>
                <InputText :disabled="!validationFailed" v-model="domicilio.provincia" placeholder="Ej. Buenos Aires"></InputText>
            </FormCol>
        </FormRow>
    </div>

</template>

<style scoped>

</style>