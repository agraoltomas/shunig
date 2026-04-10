<script setup lang="ts">
import Menubar from "@/components/Menubar.vue";
import banner from "@/assets/images/banner-shunig.png";
import SecondaryButton from '@/volt/SecondaryButton.vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
const router = useRouter();
onMounted(() => {
    router.push("/login");
})
</script>

<template>
    <Menubar class="bg-primary-700">
        <template #end>
            <div class="h-full w-full flex items-center justify-center pr-10">
                <SecondaryButton class="self-center" @click="() => router.push('/login')">
                    Ingresar
                </SecondaryButton>
            </div>
        </template>
    </Menubar>
    <div class="w-full text-center ">
<!--        <Image :src="banner" class="m-auto! inline-block"></Image>-->
    </div>
</template>

<style scoped>
</style>