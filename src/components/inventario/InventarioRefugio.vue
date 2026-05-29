<script setup lang="ts">
import DataTable from '@/volt/DataTable.vue'
import { useModalStore } from '@/stores/modales.ts'
import type { IProducto } from '@/lib/tipos/productos'
import { useRouter } from 'vue-router'
import moment from 'moment'
import Alerta from "@/components/generales/Alerta.vue"
import { EAlerta } from '../generales/alertas'
import { computed, reactive } from 'vue'
import MultiSelect from '@/volt/MultiSelect.vue'
import type { IPatrocinador } from '@/lib/tipos/patrocinadores'
import axios from '@/lib/axios.ts'
import { useToast } from '@/lib/toast/toast.ts'

//Pagina principal del inventario del refugio, muestra una tabla con los datos de los productos generales

const router = useRouter()
const toast = useToast()
const modalesStore = useModalStore()
const props = defineProps<{
    productos: IProducto[]
    patrocinadores: IPatrocinador[]
}>()


// ALERTAS, veo que tipo de producto es
const obtenerAlertaStock = (producto: IProducto) =>{
    const tipoProducto = String(producto.tipo_producto).trim();
    const cantidad = Number(producto.cantidad);

    switch(tipoProducto){
        case "Alimento":
            if(cantidad < 10){
                return EAlerta.AlimentoBajo;
            }
            if(cantidad > 50){
                return EAlerta.AlimentoAlto;
            }
            return EAlerta.AlimentoModerado; 
        case "Medicamento":
            if(cantidad < 15){
                return EAlerta.MedicamentoBajo;
            }
            if(cantidad>30){
                return EAlerta.MedicamentoAlto;
            }
            return EAlerta.MedicamentoModerado;
        default:
            return null;
    }
}

const patrocinadoresPorProducto = reactive<Record<number, number[]>>({})

const opcionesPatrocinadores = computed(() => {
    return props.patrocinadores.map((patrocinador) => ({
        label: patrocinador.nombre,
        value: patrocinador.id_patrocinador
    }))
})

const solicitarDonacion = async (producto: IProducto) => {
    const patrocinadoresSeleccionados = patrocinadoresPorProducto[producto.id_producto] || []

    if (patrocinadoresSeleccionados.length === 0) {
        toast.add({ severity: 'warn', summary: 'Atención',detail: 'Debe seleccionar al menos un patrocinador'});
        return;
    }

    console.log('Solicitar donación', {
        id_producto: producto.id_producto,
        patrocinadores: patrocinadoresSeleccionados
    })

    const r = await axios.post("/solicitud-donacion", {
        id_producto: producto.id_producto,
        patrocinadores: patrocinadoresSeleccionados
    })
    if ([200, 201].includes(r.status)) {
        toast.add({
            severity: 'success',
            summary: 'Solicitud enviada',
            detail: 'Se enviaron los correos a los patrocinadores seleccionados'
        })

        patrocinadoresPorProducto[producto.id_producto] = []
    }
}


</script>

<template>
    <div>
        <DataTable :value="productos">
            <template #empty>
                <div class="m-auto text-gray-500 w-fit p-3">No hay resultados</div>
            </template>
            <template #header>
                <div class="flex flex-row bg-surface-50 gap-3">
                    <div class="flex flex-row py-1 pl-3">
                        <InputText class="rounded-e-none"></InputText>
                    </div>
                    <div class="my-auto flex w-full justify-between items-center">
                        <Button>Filtrar
                            <svg class="mt-1" width="14" height="14" viewBox="0 0 14 14" fill="none"
                                 xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path
                                    d="M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z"
                                    fill="currentColor"></path>
                            </svg>
                        </Button>
                        <Button icon="pi pi-plus" icon-pos="left" label="Agregar producto" 
                        @click="() => modalesStore.abrir('nuevoProducto')"></Button>
                    </div>
                </div>
            </template>
            <Column header="Código" field="codigo_producto" style="width:5%">
            </Column>
            <Column header="Producto" field="nombre" style="width:25%">
            </Column>
            <Column header="Tipo de producto" field="tipo_producto"  style="width:15%">
            </Column>
            <Column header="Cantidad total" field="cantidad" style="width:10%">
            </Column>
            <Column header="Última actualización" style="width:10%">
		    <template #body="{data: producto}">{{ 
                producto.fecha_modificacion ? moment.utc(producto.fecha_modificacion).format('DD-MM-YYYY') 
            : "-" }}</template></Column>
            <Column header="Alertas" style="width:17%">
                <template #body="{data: producto}">
                    <div>
                        <Alerta v-if="obtenerAlertaStock(producto)!==null" :tipo="obtenerAlertaStock(producto)!"></Alerta>
                        <span v-else>-</span>
                    </div>
                </template>            
            </Column>
            <Column header="Solicitar donación" style="width:17%">
                <template #body="{ data: producto }">
               <MultiSelect v-model="patrocinadoresPorProducto[producto.id_producto]" :options="opcionesPatrocinadores" 
               optionLabel="label" optionValue="value" placeholder="Seleccionar" filter class="w-full">
                    <template #value>
                        <span>Seleccionar</span>
                    </template>
                    <template #footer>
                        <div class="flex justify-end p-3 border-t border-surface-200">
                            <Button size="small" icon="pi pi-send" label="Solicitar" 
                            :disabled="!(patrocinadoresPorProducto[producto.id_producto]?.length)" 
                            @click.stop="solicitarDonacion(producto)"></Button>
                        </div>
                    </template>
                </MultiSelect>
                </template>            
            </Column>            
            <Column>
                <template #body="{data}">
                    <Button icon="pi pi-eye" @click="() => router.push(`/refugio/inventario/producto/${data.id_producto}`)"></Button>
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<style scoped>

</style>