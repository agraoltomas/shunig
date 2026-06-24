<script setup lang="ts">
    import paw from "@/assets/images/paw-solid-full-purple.svg"
</script>
<!--footer-->
<template>
    <footer class="w-full mt-5 bg-[#edeff0]/40 border-t-0.5 border-t-slate-500/40 shadow-black shadow-lg">
        <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center lg:text-left">
                <div class="flex flex-col items-center lg:items-start"> 
                    <div class="flex flex-row gap-2 items-center">
                        <img class="w-15" :src="paw" aria-hidden="true">
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
    </div>
    </footer>
</template>

<style scoped>

</style>