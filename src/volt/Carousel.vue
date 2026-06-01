<script setup lang="ts">
import Carousel from 'primevue/carousel'

import { type CarouselPassThroughOptions } from 'primevue/carousel'
const pt: CarouselPassThroughOptions  = {
    content: "flex flex-row",
    viewport: "flex flex-row"
}
</script>

<template>
    <Carousel :pt="pt">
        <slot name="item"></slot>
    </Carousel>
</template>

<style scoped>

</style>