<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import shuni from "@/assets/images/chatbot2.png"
import paw from "@/assets/images/paw-solid-full.svg"
import ChatBox from '@/components/chatbot/ChatBox.vue'
const showing = ref(false);
const showDialog = ref(true);

// onMounted(() => {
//     setTimeout(() => {
//         showDialog.value = false;
//     },5000)
// })
const icono = useTemplateRef("icono")
onBeforeMount(() => {
    console.log(icono)
    icono.value?.addEventListener("mouseover", () => {
        console.log("mouseover", icono)
        showDialog.value = true;
    })
    icono.value?.addEventListener("mouseout", () => {
        console.log("mouseout", icono)
        showDialog.value = false;
    })
})
const toggleChat = () => {
    showing.value = !showing.value;
    showDialog.value = false;
}
</script>

<template>
    <div class="fixed bottom-5 left-5 m-3 z-9999">
        <div ref="icono" class="rounded-full bg-transparent cursor-pointer" @click="toggleChat">
            <div v-if="showDialog"
                 class="relative bg-refugio-500 text-white font-semibold p-3 w-fit  rounded-lg bottom-0 left-9 after:content-[''] after:absolute after:bottom-[-1em] after:left-1 after:left-10 after:w-5 after:h-5 after:border-t-20 after:border-t-refugio-500 after:border-r-20 after:border-r-transparent">
                <div class="flex flex-row gap-3">¡Hola!<img class="w-5" :src="paw"/></div>
                <div class="flex flex-row gap-3">Soy SHUNI</div>
                <div>¿En qué puedo ayudarte?</div>
            </div>
            <div v-if="!showing" class="bg-white rounded-full ">
                <img   class="w-20" :src="shuni"  alt="SHUNI"/>
            </div>
            <div v-else class="rounded-full bg-refugio-500 text-white font-semibold p-3 w-fit">
                <i class="pi pi-times text-3xl"></i>
            </div>
        </div>
    </div>
    <div :hidden="!showing">
        <ChatBox @close="() => showing = false"></ChatBox>
    </div>
</template>

<style scoped>

</style>