<script setup lang="ts">
import { type Ref, ref, useTemplateRef } from 'vue'
import Message from '@/volt/Message.vue'
import type { Maybe } from '@/lib/tipos/generics'
import { useModalStore } from '@/stores/modales.ts'
import 'vue-advanced-cropper/dist/style.css'
import Dialog from '@/volt/Dialog.vue'
import ImageCropping from '@/components/generales/images/ImageCropping.vue'
import { useFile } from '@/lib/utils/files.ts'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const fileInput = useTemplateRef('fileInput')

const file = defineModel<Maybe<File>>()
const error: Ref<Maybe<string>> = ref(null)



const props = withDefaults(defineProps<{ preview?: boolean, name?: string }>(), {
    preview: true,
})

const fileTools = useFile()
const modals = useModalStore()
const cropping = ref(false)
const cropImage = async () => {
    cropping.value = true
}

const handleFileSelection = async (f: any) => {
    error.value = null
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
    await cropImage()
}
const openFilePicker = () => {
    fileInput.value?.click()
}

const setCropping = async (b64:string ) => {

    await fileTools.fromBase64(b64)
    if(!fileTools.file)return
    file.value = fileTools.file.value
    cropping.value = false
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
                <Button pt:label="max-h-fit" icon="pi pi-plus" :label="file ? 'Cambiar' : 'Subir imagen'" @click="openFilePicker"></Button>
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
        <Image v-if="preview && file" class="size-32" :src="toURL(file)"></Image>
    </div>
    <Dialog v-model:visible="cropping" modal @close="() => {file = null}">
        <template #header>
            <div class="text-xl font-semibold m-auto w-fit text-gray-500 p-3">Recortar imagen</div>
        </template>
        <template #default>
            <div v-if="cropping && file">
                <ImageCropping :image="file" @cropped="(i) => setCropping(i)"></ImageCropping>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>

</style>