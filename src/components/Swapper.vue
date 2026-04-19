<script setup lang="ts">
import Dialog from "@/volt/Dialog.vue"
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAxios } from '@/lib/axios.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
const show = ref(true);
const router = useRouter();
const axiosService = useAxios();
const authStore = useAuthStore()
const refugioStore = useRefugioStore()
onMounted(async () => {
    console.log(axiosService.axios.value)
    if(!authStore.user)return;
    await refugioStore.loadContextRefugio(authStore.user);
})
</script>

<template>
    <Dialog v-model:visible="show" modal :closable="false">
        <div class="flex flex-col gap-4">
            <span class="text-2xl font-semibold m-auto text-center">Ingresar como</span>
            <Button size="large" class="w-72" disabled>Voluntario</Button>
            <Button size="large" class="w-72" disabled>Adoptante</Button>
            <Button @click="() => router.push('/refugio')" size="large" class="w-72" >Refugio</Button>
        </div>
    </Dialog>
</template>

<style scoped>

</style>