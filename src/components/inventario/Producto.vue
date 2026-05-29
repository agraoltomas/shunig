<script setup lang="ts">
import { ref, reactive, onMounted, computed} from 'vue'
import type { IProducto } from '@/lib/tipos/productos'
import type {IStock} from "@/lib/tipos/stock"
import moment from 'moment'
import DataBlock from '@/components/generales/DataBlock.vue'
import DataTable from '@/volt/DataTable.vue'
import FormRow from '@/components/forms/FormRow.vue'
import FormCol from '@/components/forms/FormCol.vue'
import Label from '@/components/forms/Label.vue'
import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'
import { useModalStore } from '@/stores/modales'
import { Form, type FormResolverOptions} from '@primevue/forms'
import type { FormSubmitEvent } from '@primevue/forms/form'
import { TablaEstatica } from '@/lib/tipos/estaticos.ts'
import TableSelect from '@/components/forms/TableSelect.vue'
import { useRouter } from 'vue-router'

//Muestra todos los datos del producto general

const toast = useToast();
const modalesStore = useModalStore();
const router = useRouter();

const props = defineProps<{
    producto: IProducto
}>()

const emits = defineEmits<{
    actualizado: [producto: IProducto]
    eliminado: []
}>();

const editando = ref(false);
//const form: TemplateRef<typeof Form> = useTemplateRef("form");

const articulosDelStock = ref<IStock[]>([]);

//sumo la cantidad de los articulos
const cantidadTotal = computed(()=> {
    return articulosDelStock.value.reduce((total, articulo)=>{
        return total + Number(articulo.cantidad || 0)
    }, 0)
})  

//agrego todo el stock al producto general
const agregarStockProducto = async () => {
    const r = await axios.get(`/stock/producto/${props.producto.id_producto}`)
    if(r.status === 200){
        articulosDelStock.value = r.data.data;
    }
}

onMounted(async () =>{
    await agregarStockProducto();
})


const valores = reactive({
    nombre: props.producto.nombre,
    id_tipo_producto: props.producto.id_tipo_producto,
    descripcion: props.producto.descripcion
})

const actualizarProducto = async (e: FormSubmitEvent) => {
    if (!props.producto) return;
    console.log('Valores modificados del producto:', valores)
    const r = await axios.patch(`/producto/${props.producto.id_producto}`, e.values);
    if([200,201].includes(r.status)){
        const productoActualizado = r.data.data;
        Object.assign(valores, {
            nombre: productoActualizado.nombre,
            id_tipo_producto: productoActualizado.id_tipo_producto,
            descripcion: productoActualizado.descripcion
        });
        toast.add({severity:"success", summary:"Éxito!", detail: 
        `${e.values.nombre} se modificó exitosamente`
        })
        editando.value = false;
        emits('actualizado', productoActualizado)
    }
}

const resolver = ({ values }: FormResolverOptions) => {
    const errors: { [K in keyof typeof valores]: { message: string }[] } = {
        nombre: [], id_tipo_producto: [], descripcion: []
    }

    if (!values.nombre) {
        errors.nombre.push({ message: 'El nombre es obligatorio' })
    }
    if (!values.id_tipo_producto) {
        errors.id_tipo_producto.push({ message: 'Seleccione un tipo de producto' })
    }
    if (!values.descripcion) {
        errors.descripcion.push({ message: 'Ingrese una descripción' })
    }
    return {
        values, // (Optional) Used to pass current form values to submit event.
        errors
    }
}

</script>

<template>
    <div class="flex flex-col items-center mt-3">
    <Panel v-if="producto" class="border-white! border-0 overflow-auto m-3 w-[60%]" pt:header="p-0!">        
        <template #header>
            <div class="w-full h-full">
               <div class="bg-surface-800 w-full h-full text-center text-4xl font-bold pl-3 py-4 text-white">
                        {{ editando ? valores.nombre : producto.nombre }}
                </div>
            </div>
        </template>

        <div v-if="editando" class="flex justify-center">
            <Form ref="form" v-slot="$form" :initialValues="valores" :resolver @submit="actualizarProducto" 
            class="flex flex-col mx-6 gap-3 pt-5">

            <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold">
                Fecha de alta | {{ moment(producto.fecha_alta).format('DD-MM-YYYY') }}
            </div>

            <FormRow class="text-start text-lg font-semibold">
                <FormCol modo="horizontal" :span="12">
                    <Label>Nombre</Label>
                    <InputText fluid name="nombre"></InputText>
                    <Message v-if="$form.nombre?.invalid" severity="error" size="small" variant="simple">
                        {{ $form.nombre.error?.message }}
                    </Message>
                </FormCol>
                <FormCol modo="horizontal" :span="12">
                    <Label>Tipo de producto</Label>
                    <TableSelect name="id_tipo_producto" :tipo="TablaEstatica.Producto"></TableSelect>
                    <Message v-if="$form.id_tipo_producto?.invalid" severity="error" size="small" variant="simple">
                         {{ $form.id_tipo_producto.error?.message }}
                        </Message>
                </FormCol>
                <FormCol modo="horizontal" :span="12">
                    <Label>Descripción</Label>
                    <InputText fluid name="descripcion"></InputText>
                    <Message v-if="$form.descripcion?.invalid" severity="error" size="small" variant="simple">
                                {{ $form.descripcion.error?.message }}
                    </Message>
                </FormCol>
            </FormRow>

        


            <div class="flex justify-end gap-3 px-6 py-4">
                <Button type="submit" icon="pi pi-check" label="Guardar"/>
                <Button icon="pi pi-times" label="Cancelar" @click="editando = false" />
           
            </div>
        </Form>
        </div>

        <div v-else class="px-6 pt-5">
            <div class="flex flex-row gap-4 mb-5">
                 <div class="rounded-lg bg-surface-300 px-2 py-1 text-lg font-semibold w-fit">
                    Código de producto | {{ producto.codigo_producto }}
                </div>
                <div class="rounded-lg bg-gray-200 px-2 py-1 text-lg font-semibold w-fit">
                    Fecha de alta | {{ moment(producto.fecha_alta).format('DD-MM-YYYY') }}
                </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <DataBlock label="Tipo de producto" :data="producto.tipo_producto"></DataBlock>
                <DataBlock label="Cantidad total" :data="cantidadTotal"></DataBlock>                
            </div>          
            <hr class="border-surface-500/80! my-3" />
            <div>
                <DataBlock label="Descripción" :data="producto.descripcion"></DataBlock>
            </div>         
        </div>
        
        <div v-if="!editando" class="flex justify-between items-center">
            <Button class="mx-4" icon="pi pi-undo" label="Volver" @click="$router.go(-1)"></Button>
            <div class="flex justify-end gap-3 px-6 py-4">
                <Button icon="pi pi-pencil" label="Editar" @click="editando = true" />
                <DangerButton icon="pi pi-trash" label="Eliminar" @click="modalesStore.abrir('eliminar', {
                    nombre: producto.nombre,
                    endpoint: `/producto/${producto.id_producto}`,
                    volverPrincipal: '/refugio/inventario'})">
                </DangerButton>
            </div>
        </div>
        
    </Panel>

    <!--Stock-->
    <Panel v-if="producto && !editando" class="border-white! border-0 overflow-auto m-3 w-[60%]"  pt:header="p-0!">
        <template #header>
            <div class="w-full h-full">
               <div class="w-full h-full text-center text-3xl font-semibold pl-3 py-4 ">Stock
                </div>
            </div>
        </template>
        <div class="pb-5">
        <DataTable :value="articulosDelStock">
            <template #empty>
                <div class="m-auto text-gray-500 w-fit p-3">
                    No hay artículos cargados en stock
                </div>
            </template>
            <Column header="Código artículo" field="codigo_articulo" style="width:15%"></Column>
            <Column header="Marca" field="marca" style="width:18%"></Column>

            <Column header="Fecha vencimiento" style="width:15%">
                <template #body="{ data: articulo }">
                    {{ articulo.fecha_vencimiento ? moment.utc(articulo.fecha_vencimiento).format('DD-MM-YYYY') : '' }}
                </template>
            </Column>
            <Column header="Cantidad" field="cantidad" style="width:10%"></Column>
            <Column  style="width:10%">
                <template #body="{data}">
                    <Button icon="pi pi-eye" @click="() => modalesStore.abrir('verArticuloStock', { articulo: data, 
                        actualizaStock: agregarStockProducto, eliminaStock: agregarStockProducto
                     })"></Button>
                </template>
            </Column>
           
        </DataTable>

        <div class="flex justify-end mt-4">
            <Button icon="pi pi-plus" icon-pos="left" label="Agregar artículo al stock" 
            @click="modalesStore.abrir('nuevoArticuloStock', { id_producto: producto.id_producto })"></Button>
        </div>
    </div>
    </Panel>
    </div>
</template>

<style scoped>
</style>