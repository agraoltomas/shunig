<script setup lang="ts">
import Dialog from "@/volt/Dialog.vue"
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAxios } from '@/lib/axios.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
import { useLoadingComposable } from '@/lib/utils/loading.ts'
import ProgressSpinner from '@/volt/ProgressSpinner.vue'

const show = ref(true);
const router = useRouter();
const axiosService = useAxios();
const authStore = useAuthStore()
const { refugio, loadContextRefugio } = useRefugioStore()
const {loading, stopLoading, startLoading } = useLoadingComposable()
onMounted(async () => {
    startLoading()
    console.log(axiosService.axios.value)
    if(!authStore.user)return router.push('/login');
    await loadContextRefugio(authStore.user);
    if(!refugio) return router.push('/usuario');

})
</script>

<template>
    <Dialog v-model:visible="show" modal :closable="false">
        <div v-if="loading" class="w-20">
            <ProgressSpinner style="height: 40px"></ProgressSpinner>
        </div>
        <div v-else class="flex flex-col gap-4">
            <span class="text-2xl font-semibold m-auto text-center">Ingresar como</span>
            <Button @click="() => router.push('/usuario')" size="large" class="w-72" >Voluntario / Adoptante</Button>
            <Button v-if="refugio" @click="() => router.push('/refugio')" size="large" class="w-72" >Refugio</Button>
        </div>
    </Dialog>
</template>

<style scoped>

</style>