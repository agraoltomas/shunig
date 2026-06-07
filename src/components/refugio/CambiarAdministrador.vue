<script setup lang="ts">
import Select from '@/volt/Select.vue'
</script>

<template>
    <div class="w-[75vw] m-auto flex flex-col gap-4 mt-5 mb-15">
        <div class="shadow-[0_0_10px_rgba(0,0,0,0.18)] rounded-2xl p-5 bg-white">
            <div class="flex flex-row justify-between items-center gap-4 pb-4 mb-5 border-b border-gray-200">
                <div>
                    <div class="font-bold text-2xl">
                        Cambiar usuario administrador
                    </div>

                    <div class="text-gray-500 mt-1">
                        Seleccioná el usuario que quedará como administrador principal del refugio.
                    </div>
                </div>

                <div class="rounded-full bg-primary-200/30 w-20 h-20 flex items-center justify-center">
                    <i class="pi pi-user-edit text-primary-500 text-3xl"></i>
                </div>
            </div>

            <div class="flex flex-row gap-3">
                <Select
                    fluid
                    class="grow"
                    placeholder="Seleccionar usuario administrador"
                />

                <Button
                    icon="pi pi-check"
                    label="Confirmar"
                    class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>