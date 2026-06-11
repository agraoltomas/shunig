<script setup lang="ts">
    import paw from "@/assets/images/paw-solid-full-purple.svg"
</script>

<template>
    <div class="flex flex-row h-50 text-center  mt-5 bg-[#edeff0]/40 border-t-0.5 border-t-slate-500/40 shadow-black shadow-lg pt-7 pb-3 px-5 justify-around">
        <div class="flex flex-col">
            <div class="flex flex-row gap-1 align-bottom">
                <img class="w-15" :src="paw" alt="Pata">
                <span class=" text-3xl vertical-bottom h-fit self-center">Shunig</span>
            </div>
        </div>
        <div>
            <span class="text-lg font-semibold">Navegación</span>
        </div>
        <div>
            <span class="text-lg font-semibold">Ayuda</span>
        </div>
        <div>
            <span class="text-lg font-semibold">Seguinos</span>
        </div>
    </div>
</template>

<style scoped>

</style>