<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.ts'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const logout = async () => {
    authStore.logout()
    await router.push('/login')

}
</script>

<template>
    <Button icon="pi pi-sign-out" @click="logout"></Button>
</template>

<style scoped>

</style>