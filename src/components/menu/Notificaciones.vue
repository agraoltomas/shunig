<script setup lang="ts">
import OverlayBadge from '@/volt/OverlayBadge.vue'
import { type Ref, ref } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'
const quantity: Ref<Maybe<number>> = ref(10)
</script>

<template>
    <Button :badge="quantity" icon="pi pi-bell"></Button>
<!--    <OverlayBadge severity="danger" :value="null"  size="sm all">-->
<!--        <div  class="pi pi-bell text-white self-center h-fit"></div>-->
<!--    </OverlayBadge>-->
</template>

<style scoped>

</style>