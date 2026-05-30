<script setup lang="ts">

import { type Reactive, reactive, ref } from 'vue'
import type { IProducto } from '@/lib/tipos/productos'
import { Form } from '@primevue/forms'
import axios from '@/lib/axios.ts'
import type { Maybe } from '@/lib/tipos/generics'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'

import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import TableSelect from '@/components/forms/TableSelect.vue'
import { useToast } from '@/lib/toast/toast.ts'
import Label from '@/components/forms/Label.vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'

//Cuando doy de alta un producto general 


const toast = useToast();

type Optional<T> = { [K in keyof T]: Maybe<T[K]> }
const initialValues = reactive({
    nombre: null,
    id_tipo_producto: null,
    descripcion: null,
    id_unidad_stock: null,
    medida: null,
    cantidad_alerta_baja: null,
    cantidad_alerta_moderada: null,
    alerta_stock_activa: true
})

interface ProductoData {
    nombre: Maybe<string>,
    id_tipo_producto: Maybe<number>,
    descripcion: Maybe<string>,
    id_unidad_stock: Maybe<number>,
    medida: Maybe<string>,
    cantidad_alerta_baja: Maybe<number>,
    cantidad_alerta_moderada: Maybe<number>,
    alerta_stock_activa: boolean
}


const emits = defineEmits<{close: []}>();
const ingresarProducto = async (d: any) => {
        const r = await axios.post(`/producto/`, {
            ...d.values,
            id_tipo_producto: initialValues.id_tipo_producto,
            id_unidad_stock: initialValues.id_unidad_stock,
            alerta_stock_activa: initialValues.alerta_stock_activa
        });
        if([200,201].includes(r.status)){
            toast.add({severity:"success", summary:"Éxito!", detail: `${d.values.nombre} se ha dado de alta exitosamente`})
            emits('close')
        }
}

const resolver = ({ values }: { values: Partial<Optional<IProducto>> }) => {
    const errors: { [K in keyof ProductoData]: { message: string }[] } = {
        nombre: [], id_tipo_producto: [], descripcion:[], 
        id_unidad_stock:[], medida:[], cantidad_alerta_baja: [], 
        cantidad_alerta_moderada:[], alerta_stock_activa:[]
    }

    if (!values.nombre) {
        errors.nombre.push({ message: 'El nombre es obligatorio' })
    }
    if (!values.id_tipo_producto) {
        errors.id_tipo_producto.push({ message: 'Seleccione el tipo de producto' })
    }
   
    if(!initialValues.id_unidad_stock){
       errors.id_unidad_stock.push({ message: 'Seleccione la unidad del producto' }) 
    }
    if(!values.medida){
      errors.medida.push({ message: 'Ingrese la medida del producto' })      
    }
    if (values.cantidad_alerta_baja === null || values.cantidad_alerta_baja === undefined) {
        errors.cantidad_alerta_baja.push({ message: 'Ingrese la cantidad minima de producto que debe tener' })
    }
    if (values.cantidad_alerta_moderada === null || values.cantidad_alerta_moderada === undefined) {
        errors.cantidad_alerta_moderada.push({ message: 'Ingrese la cantidad moderada del producto que hay que tener en cuenta' })
    } else if (Number(values.cantidad_alerta_moderada) <= Number(values.cantidad_alerta_baja)) {
        errors.cantidad_alerta_moderada.push({ message: 'La alerta moderada debe ser mayor a la baja' })
    }
    return {
        values, // (Optional) Used to pass current form values to submit event.
        errors
    }
}

</script>

<template>
    <Form v-slot="$form" :initialValues :resolver @submit="ingresarProducto" class="flex flex-col gap-4 w-full">
        <!--        <div class="flex flex-col gap-7">-->
        <FormRow class="w-full">
            <FormCol :span="6">
                <Label for="nombre" required>Nombre</Label>
                <InputText id="nombre" fluid name="nombre"></InputText>
                <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.nombre.error?.message }}
                </Message>
            </FormCol>      
             <FormCol :span="6">
                <Label for="tipoProducto" required>Tipo de producto</Label>
                <TableSelect id="tipoProducto" name="id_tipo_producto" v-model="initialValues.id_tipo_producto" :tipo="TablaEstatica.Producto"></TableSelect>
                <Message v-if="$form.id_tipo_producto?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.id_tipo_producto.error?.message }}
                </Message>
            </FormCol>      
        </FormRow>
        <FormRow class="w-full">
            <FormCol :span="6">
                <Label for="unidadStock" required>Unidad</Label>
                <TableSelect id="unidadStock" name="id_unidad_stock" 
                v-model="initialValues.id_unidad_stock" :tipo="TablaEstatica.UnidadStock"></TableSelect>
                <Message v-if="$form.id_unidad_stock?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.id_unidad_stock.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="6">
                <Label for="medida" required>Medida</Label>
                <InputText id="medida" fluid name="medida" 
                placeholder="Por ejemplo: 10 kg, 15 cc, 500 mg"></InputText>
            </FormCol>
        </FormRow>
        <FormRow class="w-full">
            <FormCol :span="4">
                <Label for="cantidadAlertaBaja" required>Cantidad mínima</Label>
                <InputNumber id="cantidadAlertaBaja" fluid name="cantidad_alerta_baja" />
                <Message v-if="$form.cantidad_alerta_baja?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.cantidad_alerta_baja.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="4">
                <Label for="cantidadAlertaModerada" required>Cantidad moderada</Label>
                <InputNumber id="cantidadAlertaModerada" fluid name="cantidad_alerta_moderada"></InputNumber>
                <Message v-if="$form.cantidad_alerta_moderada?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.cantidad_alerta_moderada.error?.message }}
                </Message>
            </FormCol>
            <FormCol :span="4">
                <Label for="alertaStockActiva">Alertas</Label>
                <div class="flex items-center gap-2 h-[42px]">
                <ToggleSwitch id="alertaStockActiva" v-model="initialValues.alerta_stock_activa"></ToggleSwitch>
                <span>{{ initialValues.alerta_stock_activa ? 'Sí' : 'No' }}</span>
                </div>   
            </FormCol>
        </FormRow>
        <FormRow class="w-full">           
            <FormCol :span="12">
                <Label for="descripcion">Descripción</Label>
                <InputText id="descripcion" fluid name="descripcion"></InputText>
                <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
                    {{ $form.descripcion.error?.message }}
                </Message>
            </FormCol>
        </FormRow>
        
        <div class="flex flex-row justify-end gap-3">
            <Button type="submit" icon="pi pi-save" label="Guardar" icon-pos="right"></Button>
        </div>
    </Form>
</template>

<style scoped>
</style>