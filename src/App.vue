<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import Toast from '@/volt/Toast.vue'

const router = useRouter()

onMounted(() => {
    router.push('/login')
})

</script>

<template>
  <Toast />
  <router-view ></router-view>
    <div  class=" hidden col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-7 col-span-8 col-span-9 col-span-10 col-span-11 col-span-12"></div>
    <Toast></Toast>
</template>

<style>
body {
    background-color: var(--p-surface-300);
}
</style>
