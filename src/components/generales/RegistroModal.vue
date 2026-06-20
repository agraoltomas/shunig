<script setup lang="ts">

import paw from '@/assets/images/paw-solid-full.svg'
import Modal from '@/components/modal/Modal.vue'
import { useRouter } from 'vue-router'
import type { Maybe } from '@/lib/tipos/generics'
import type { RouteLocationRaw } from 'vue-router/dist/router-BbqN7H95'
const router = useRouter()
const toURL = (url: Maybe<string>) => {
    if(!url)return null
    return decodeURIComponent(url)
}
const navigate = (path: string, to: Maybe<string>) => {
    const route: RouteLocationRaw = { path}
    if(to){
        route.query = {
            to: toURL(to)
        }
    }
    router.push(route)

}
</script>


<template>
    <Modal nombre="registro" title="">
        <template #default="{closeFn, context}">
            <div class="rounded-full bg-surface-500 w-10 m-auto">
            <span class="text-center ">
                <img :src="paw" />
            </span>
            </div>
            <h1 class="text-2xl semibold py-3 text-wrap text-center">Para adoptar necesitas una cuenta</h1>
            <div class="text-center m-auto text-slate-500">¿Ya tenés una cuenta?</div>
            <div class=" flex flex-col py-3">
                <Button class="w-fit m-auto" icon="pi pi-sign-in px-1" label="Iniciar sesión"
                        @click="() => {navigate('/login', context.registro?.to??null); closeFn()}"></Button>
            </div>
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
            <div class="flex flex-col py-3">
                <Button :outlined="true" class="w-fit m-auto" icon="pi pi-user px-1" label="Registrarme"
                        @click="() =>{navigate('/register', context.registro?.to??null); closeFn()}"></Button>
            </div>
        </template>
    </Modal>
</template>

<style scoped>

</style>