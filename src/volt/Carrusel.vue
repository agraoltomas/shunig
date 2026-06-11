<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type Ref, type ComputedRef } from 'vue'
import type { IMascota } from '@/lib/tipos/mascotas'
import type { Maybe } from '@/lib/tipos/generics'
import Dialog from '@/volt/Dialog.vue'
import paw from '@/assets/images/paw-solid-full.svg'
import { useRouter } from 'vue-router'

const props = defineProps<{ animales: IMascota[] }>()

const currentIndex = ref(0)

const currentPet: ComputedRef<IMascota | undefined> = computed(() => props.animales[currentIndex.value])
const router = useRouter()
const nextSlide = () => {
    currentIndex.value =
        (currentIndex.value + 1) % props.animales.length
}

const prevSlide = () => {
    currentIndex.value =
        (currentIndex.value - 1 + props.animales.length) % props.animales.length
}

// autoplay
const interval: Ref<Maybe<number>> = ref(null)

onMounted(() => {
    // interval.value = setInterval(() => {
    //     nextSlide()
    // }, 4000)
})


onBeforeUnmount(() => {
    if (interval.value) clearInterval(interval.value)
})
const showDialog = ref(false)

</script>
<template>
    <div class="rounded">
        <div class="content max-w-300 pt-6 m-auto">
            <div class="flex flex-row gap-3 relative align-items-center justify-center">
                <Button @click="prevSlide" icon="pi pi-arrow-left" class="max-h-fit! relative! my-auto!">
                </Button>
                <transition name="fade" mode="out-in" v-if="currentPet" class="bg-black/30">
                    <div class="rounded-lg w-105" :key="currentPet.nombre">
                        <Image pt:image="w-105 block! m-auto" v-if="currentPet.imagen" :src="currentPet.imagen"
                               :alt="currentPet.nombre" />
                        <div class="p-7 flex flex-col text-center">
                            <h2 class="text-2xl text-white">{{ currentPet.nombre }}</h2>
                            <span class="text-white">{{ currentPet.especie }}</span>
                            <Button class="my-3 w-fit text-center mx-auto" @click="() => showDialog = true">
                                Quiero adoptar
                            </Button>
                        </div>
                    </div>
                </transition>

                <!-- Flecha derecha -->
                <Button @click="nextSlide" icon="pi pi-arrow-right" class="max-h-fit! relative! my-auto!">
                </Button>

            </div>
        </div>
    </div>
    <Dialog v-model:visible="showDialog" pt:content="p-3 flex flex-col gap-3" modal class="w-96">
        <div class="rounded-full bg-surface-500 w-10 m-auto">
            <span class="text-center ">
                <img :src="paw" />
            </span>
        </div>
        <h1 class="text-2xl semibold py-3 text-wrap text-center">Para adoptar necesitas una cuenta</h1>
        <div class="text-center m-auto text-slate-500">¿Ya tenés una cuenta?</div>
        <Button class="w-fit m-auto" icon="pi pi-sign-in px-1" label="Iniciar sesión"
                @click="() => router.push('/login')"></Button>
        <div class="flex flex-row">
            <div class="grow pt-6 mr-3">
                <hr>
            </div>
            <div class="py-3 text-center">o</div>
            <div class="grow pt-6 ml-3">
                <hr>
            </div>
        </div>
        <div class="text-center m-auto text-slate-500">¿No tenés cuenta aún?</div>
        <Button :outlined="true" class="w-fit m-auto" icon="pi pi-user px-1" label="Registrarme"
                @click="() => router.push('/register?t=adopcion')"></Button>
    </Dialog>
</template>


<style scoped>


/* Animación */

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-enter-from {
    opacity: 0;
    transform: scale(0.95);
}

.fade-leave-to {
    opacity: 0;
    transform: scale(1.05);
}


</style>
