<script setup lang="ts">
import Dialog from "@/volt/Dialog.vue"
import { onMounted, type Ref, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAxios } from '@/lib/axios.ts'
import { useAuthStore } from '@/stores/auth.ts'
import { useRefugioStore } from '@/stores/refugio.ts'
import type { IRefugio } from '@/lib/tipos/refugio'
import type { Maybe } from '@/lib/tipos/generics'
const show = ref(true);
const router = useRouter();
const axiosService = useAxios();
const authStore = useAuthStore()
const refugioStore = useRefugioStore()
const refugio: Ref<Maybe<IRefugio>> = ref(null);
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
            <Button @click="() => router.push('/usuario')" size="large" class="w-72" >Voluntario / Adoptante</Button>
            <Button :disabled="!refugioStore.refugio" @click="() => router.push('/refugio')" size="large" class="w-72" >Refugio</Button>
        </div>
    </Dialog>
</template>

<style scoped>

</style>