<script setup lang="ts">

import Menubar from '@/components/Menubar.vue'
import { onMounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
onMounted(async () => {

})
</script>
<template>
    <Menubar>
        <template #end>
            <div class="w-full flex flex-row justify-end h-full">
                <Button class="self-center border-refugio-500 shadow-lg mr-3" label="Ingresar" @click="() => router.push('/login')"></Button>
            </div>
        </template>
    </Menubar>
    <router-view>
    </router-view>
</template>

<style scoped>

</style>