<script setup lang="ts">
import {  type Ref, ref, useTemplateRef } from 'vue'
import Message from '@/volt/Message.vue'
import type { Maybe } from '@/lib/tipos/generics'
import { useModalStore } from '@/stores/modales.ts'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css';
const MAX_FILE_SIZE = 5 * 1024 * 1024
const fileInput = useTemplateRef('fileInput')

const file = defineModel<Maybe<File>>()
const error: Ref<Maybe<string>> = ref(null)



const props = withDefaults(defineProps<{ preview?: boolean, name?: string }>(), {
    preview: true,
})

const modals = useModalStore()
const cropping = ref(false)
const cropImage = async () => {
    console.log("before")
    cropping.value = true
    await new Promise(resolve => setTimeout(resolve, 1000))
}
const handleFileSelection = async (f: any) => {
    error.value = null
    await cropImage()
    if (!(fileInput.value) || !fileInput.value.files || fileInput.value.files.length == 0) return
    if (fileInput.value.files.length > 0) {
        const newFile = Array.from(fileInput.value.files)[0]
        if (newFile) {
            if (newFile.size > MAX_FILE_SIZE) {
                error.value = 'El archivo no puede ser mayor a 5MB'
            } else {
                file.value = newFile
            }
        }
    }

}
const openFilePicker = () => {
    fileInput.value?.click()
}

const sizeDisplay = (size: number): string => {
    let currSize = size
    if (currSize < 1000) {
        return `${currSize} B`
    }
    currSize = currSize / 1024
    if (currSize < 1000) {
        return `${currSize.toPrecision(3)} KB`
    }
    currSize = currSize / 1024
    if (currSize < 1000) {
        return `${currSize.toPrecision(3)} MB`
    }
    currSize = currSize / 1024
    return `${currSize.toPrecision(3)} GB`
}
const toURL = (f: File) => {
    return URL.createObjectURL(f)
}
</script>

<template>
    <div class="flex flex-col overflow-y-auto">
        <div class="flex flex-row gap-3 py-3">
                <input  hidden @change="handleFileSelection" type="file" ref="fileInput" />
            <div class="flex flex-row gap-3">
                <Button pt:label="max-h-fit" class="bg-refugio-500 hover:bg-refugio-300! hover:border-refugio-500 border-refugio-500" icon="pi pi-plus" :label="file ? 'Cambiar' : 'Subir imagen'" @click="openFilePicker"></Button>
            </div>
            <Message severity="error" v-if="error" fluid>{{ error }}</Message>
            <div v-else-if="!file" class="my-auto">
                No hay nada seleccionado
            </div>
            <div v-else class="flex flex-row gap-3">
                <div class="flex flex-row  my-auto">
                    <span class="rounded-lg max-w-60 bg-gray-100 p-1 overflow-hidden whitespace-nowrap text-ellipsis">
                        {{ file.name }}
                    </span>
                    <span class="rounded-lg bg-gray-100 p-1 ">
                     ({{ sizeDisplay(file.size) }})
                    </span>
                </div>
            </div>
        </div>

        <div v-if="cropping && file">
            <Cropper
                class="cropper"
                :src="toURL(file)"
                :stencil-props="{
                          aspectRatio: 4/5
                        }"
                @change="(d: Event) => {console.log(d)}"></Cropper>
        </div>
        <Image v-else-if="preview && file" class="size-32" :src="toURL(file)"></Image>
    </div>

</template>

<style scoped>

</style>