<script setup lang="ts">

import Menubar from '@/components/Menubar.vue'
import { onMounted } from 'vue'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useRouter } from 'vue-router'
const router = useRouter();
onMounted(() => {
    const refugioStore = useRefugioStore();
    if(refugioStore.refugio){
        router.push("")
    }
})
</script>

<template>
    <Menubar/>
    <router-view></router-view>
</template>

<style scoped>

</style>