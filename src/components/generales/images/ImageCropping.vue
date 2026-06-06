<script setup lang="ts">

import { Cropper } from 'vue-advanced-cropper'
import { useFile } from '@/lib/utils/files.ts'
import { type Ref, ref, useTemplateRef } from 'vue'
import type { Maybe } from '@/lib/tipos/generics'
const props = defineProps<{image: File}>();
const emits = defineEmits<{ cropped: [image: string]}>()
const { file, toURL } = useFile(props.image);
const cropper = useTemplateRef("cropper")
const croppedImage: Ref<Maybe<string>> = ref(null);
const recortar = () => {
    const data = cropper.value?.getResult();
    if(!data)return;
    const {canvas} = data;
    if(!canvas)return;
    croppedImage.value = canvas.toDataURL();
}
const finalizar = () => {
    if(!croppedImage.value)return;
    emits('cropped',croppedImage.value)
}
</script>

<template>
    <div class="flex flex-col gap-3 " v-if="!croppedImage">
        <Cropper
            ref="cropper"
            class="cropper w-3/4 m-auto"
            :src="toURL()"
            :stencil-props="{
                          aspectRatio: 4/5
                        }">
        </Cropper>
        <div class="flex flex-row justify-center py-3 gap-3">
            <Button label="Recortar" @click="recortar"></Button>
        </div>
    </div>
    <div  class="w-fit max-w-[50vw] m-auto flex flex-col items-center" v-else>
        <Image :src="croppedImage">
        </Image>
        <div class="flex flex-row justify-center py-3">
            <Button variant="outlined" label="Rehacer" icon="pi pi-" @click="() => croppedImage = null"></Button>
            <Button label="Confirmar" @click="finalizar"></Button>
        </div>
    </div>
</template>

<style scoped>

</style>