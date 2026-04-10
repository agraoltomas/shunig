<script setup lang="ts">
import Dialog from "@/volt/Dialog.vue"
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const show = ref(true);
const router = useRouter();
</script>

<template>
    <Dialog v-model:visible="show" modal :closable="false">
        <div class="flex flex-col gap-4">
            <span class="text-2xl font-semibold m-auto text-center">Ingresar como</span>
            <Button size="large" class="w-72" disabled>Voluntario</Button>
            <Button size="large" class="w-72" disabled>Adoptante</Button>
            <Button @click="() => router.push('/refugio')" size="large" class="w-72" >Admin. de Refugio</Button>
        </div>
    </Dialog>
</template>

<style scoped>

</style>