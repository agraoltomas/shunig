<script setup lang="ts">

import { onMounted, type Ref, ref } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()
const { axios } = useAxios()
const { unwrap } = useResponse()
const toast = useToast()

const solicitud: Ref<Maybe<ISolicitudCompleta>> = ref(null)

onMounted(async () => {
    try {
        const r = await unwrap(axios.value.get(rutas_api.solicitud.GET(<string>route.params.id)))
        console.log(r)
        solicitud.value = r.data
    } catch (e) {

    }

})
</script>

<template>
    <SolicitudDetalle v-if="solicitud" :solicitud="solicitud"/>
    <Footer></Footer>
</template>

<style scoped>

</style>