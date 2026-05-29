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

//Cuando doy de alta un producto general 


const toast = useToast();

type Optional<T> = { [K in keyof T]: Maybe<T[K]> }
const initialValues = reactive({
    nombre: null,
    id_tipo_producto: null,
    descripcion: null
})

interface ProductoData {
    nombre: Maybe<string>,
    id_tipo_producto: Maybe<number>,
    descripcion: Maybe<string>
}


const emits = defineEmits<{close: []}>();
const ingresarProducto = async (d: any) => {
        const r = await axios.post(`/producto/`, {
            ...d.values
        });
        if([200,201].includes(r.status)){
            toast.add({severity:"success", summary:"Éxito!", detail: `${d.values.nombre} se ha dado de alta exitosamente`})
            emits('close')
        }
}

const resolver = ({ values }: { values: Partial<Optional<IProducto>> }) => {
    const errors: { [K in keyof ProductoData]: { message: string }[] } = {
        nombre: [], id_tipo_producto: [], descripcion:[]
    }

    if (!values.nombre) {
        errors.nombre.push({ message: 'El nombre es obligatorio' })
    }
    if (!values.id_tipo_producto) {
        errors.id_tipo_producto.push({ message: 'Seleccione el tipo de producto' })
    }
    if (!values.descripcion) {
        errors.descripcion.push({ message: 'Ingrese una descripción para el producto' })
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
            <FormCol :span="12">
                <Label for="descripcion" required>Descripción</Label>
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