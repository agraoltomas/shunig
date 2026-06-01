<script setup lang="ts">
import type { User } from '@/lib/tipos/usuarios'
import { useAxios } from '@/lib/axios.ts'
import { onMounted, type Ref, ref } from 'vue'
import { useResponse } from '@/lib/utils/response.ts'
import { rutas_api } from '@/rutas_api.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
import DangerButton from '@/volt/DangerButton.vue'
import { useToast } from "@/lib/toast/toast.ts"

interface UsuarioRefugio extends User{
    created_at: string,
    usuario_rechazado: boolean
}

const { axios} = useAxios()
const {unwrap, tryLogError} = useResponse()
const toast = useToast()
const {refugio} = useRefugioStore()
const usuarios: Ref<UsuarioRefugio[]> = ref([])
const loadUsuarios = async () => {
    const r = await unwrap<UsuarioRefugio[]>(axios.value.get(rutas_api.refugio.USUARIOS(refugio.id_refugio.toString())));
    console.log(r.data);
    usuarios.value = r.data;
}
onMounted(async () => {
    if(!refugio) return
    await loadUsuarios()
});
const rechazar = async (u: UsuarioRefugio) => {
    if(!confirm(`Confirma que rechaza al usuario ${u.email}?`))return;
    if(!refugio) return
    try {
        const r = await unwrap(axios.value.post(rutas_api.refugio.RECHAZAR_USUARIO(refugio.id_refugio.toString()), {
            id_usuario: u.id_usuario
        }));
        if(r.ok){
            toast.add({ detail: r.message, severity: "success"})
            await loadUsuarios()
        }
    }catch(err) {
        tryLogError(<Error>err, toast)
    }
}
</script>

<template>
    <div class="flex flex-col">
        <DataTable :value="usuarios">
            <Column header="Nombre">
                <template #body="{data}">
                    {{ data['nombre']}} {{data['apellido']}}
                </template>
            </Column>
            <Column header="Mail" field="email">
            </Column>
            <Column>
                <template #body="{data}">
                    <DangerButton @click="() => rechazar(data)" size="small" v-if="!data['usuario_rechazado']" icon="pi pi-times" label="Rechazar"></DangerButton>
                    <div v-else class="bg-surface-400 px-3 py-1 rounded-lg text-white font-semibold text-md">Rechazado</div>
                </template>
            </Column>
        </DataTable>
<!--        <Select class="" :options="usuarios" :option-label="(u: UsuarioRefugio) => `${u.nombre} ${u.apellido} - ${u.email}`" >-->
<!--        </Select>-->
<!--        <div class="flex flex-row flex-wrap w-max-96">-->
<!--            <Tag v-for="user in [...usuarios,...usuarios,...usuarios]">{{ user.nombre }}{{user.apellido}}<div class="pi pi-times"></div></Tag>-->
<!--        </div>-->
    </div>
</template>

<style scoped>

</style>