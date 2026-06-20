<script setup lang="ts">
import type { IDomicilio } from '@/lib/tipos/domicilio'
import { computed, onMounted, type Ref, ref } from 'vue'
import { getDistanceTo, toUnit } from '@/lib/utils/maps.ts'
import type { Maybe } from '@/lib/tipos/generics'

const props = defineProps<{ domicilio: IDomicilio }>()
const distance: Ref<Maybe<number>> = ref(null)
onMounted(async () => {
    const d = await getDistanceTo(props.domicilio)
    distance.value = d ?? 0
})

</script>

<template>
    <div v-if="distance" class="font-bold">{{ toUnit(distance) }}</div>
</template>

<style scoped>

</style>