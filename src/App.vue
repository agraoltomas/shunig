<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { onMounted } from 'vue'
import Toast from '@/volt/Toast.vue'
import Modales from '@/components/Modales.vue'
import { useAuthStore } from '@/stores/auth.ts'

const router = useRouter()
const route = useRoute()
console.log(router, route)
const authStore = useAuthStore()
onMounted(() => {
    const route = window.location.hash.substring(1);
    if(route != "/"){
        router.push(route);
    }else{
        if(!authStore.user){
            router.push('/login')
        }else{

        }
    }
})

</script>

<template>
  <Toast />
  <router-view ></router-view>
    <div  class=" hidden col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-7 col-span-8 col-span-9 col-span-10 col-span-11 col-span-12 gap-1 gap-2 gap-3 gap-4 gap-5 gap-6 gap-7 after:content-['*']"></div>
    <Toast></Toast>
    <Modales></Modales>
</template>

<style>
body {
    background-color: var(--p-surface-300);
}
</style>
