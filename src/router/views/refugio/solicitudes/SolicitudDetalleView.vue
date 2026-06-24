<script setup lang="ts">

import { onMounted, type Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { rutas_api } from '@/rutas_api.ts'
import { useAxios } from '@/lib/axios.ts'
import { useResponse } from '@/lib/utils/response.ts'
import type { ISolicitudCompleta } from '@/lib/tipos/solicitud.ts'
import Footer from '@/components/generales/Footer.vue'
import type { Maybe } from '@/lib/tipos/generics'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useSolicitudesStore } from '@/stores/solicitudes.ts'
import { useToast } from "@/lib/toast/toast.ts"
import SolicitudDetalle from '@/components/solicitud/SolicitudDetalle.vue'
import LoadingOverlay from '@/components/generales/LoadingOverlay.vue'
import { useLoadingComposable } from '@/lib/utils/loading.ts'

const route = useRoute()
const toast = useToast()
const router = useRouter()
const { axios } = useAxios()
const { unwrap } = useResponse()
const { aceptar, rechazar} = useSolicitudesStore()

const solicitud: Ref<Maybe<ISolicitudCompleta>> = ref(null)
const {loading} = useLoadingComposable()

onMounted(async () => {
    try {
        const r = await unwrap(axios.value.get(rutas_api.solicitud.GET(<string>route.params.id)))
        console.log(r)
        solicitud.value = r.data
    } catch (e) {

    }

})
const aceptarSolicitud = async () => {
    if(!solicitud.value || !confirm('Aceptar solicitud?'))return;
    const ok = await aceptar(solicitud.value.id_solicitud)
    if(ok){
        toast.add({detail: "Solicitud aceptada", severity: "success"})
        router.go(-1)
    }else{
        toast.add({detail: "error aceptando solicitud", severity: "error"})
    }
}
const rechazarSolicitud = async () => {
    if(!solicitud.value || !confirm('Aceptar solicitud?'))return;
    const ok = await rechazar(solicitud.value.id_solicitud)
    if(ok){
        toast.add({detail: "Solicitud rechazada", severity: "success"})
        router.go(-1)
    }else{
        toast.add({detail: "error rechazando solicitud", severity: "error"})
    }
}
</script>

<template>
    <LoadingOverlay :loading="loading">
        <SolicitudDetalle v-if="solicitud" :solicitud="solicitud" context="refugio" @aceptar="aceptarSolicitud" @rechazar="rechazarSolicitud"/>
    </LoadingOverlay>
</template>

<style scoped>

</style>