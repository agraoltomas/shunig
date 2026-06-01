<script setup lang="ts">
    import { computed } from 'vue'
    import type { IDatosSolicitud } from '@/lib/tipos/solicitud.ts'

    const props = defineProps<{ solicitud: IDatosSolicitud }>()
    const estadoIcono = computed(() => {
        console.log(props.solicitud)
        switch (props.solicitud.id_estado) {
            case "1":
                return 'pi-check'
            case "2":
                return 'pi-clock'
            case "3":
                return 'pi-times'
        }
    })

    const estadoClase = computed(() => {
        switch (props.solicitud.id_estado) {
            case "1":
                return 'bg-[#DFF5E6] text-[#22784A]'
            case "2":
                return 'bg-[#FFEFCC] text-[#B57C00]'
            case "3":
                return 'bg-[#FCE0E0] text-[#BE3434]'
        }
    })

</script>

<template>
    <div :class="['self-start py-2 px-4 flex flex-row gap-1 rounded-2xl', estadoClase]">
        <span :class="['py-1 pi',estadoIcono]"></span> {{ solicitud.estado }}
    </div>
</template>

<style scoped>

</style>