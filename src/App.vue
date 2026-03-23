<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import Toast from "@/volt/Toast.vue"
const router = useRouter();
onMounted(() => {
   router.push('/login');
})
</script>

<template>
  <Toast/>
  <router-view></router-view>
</template>

<style scoped></style>
