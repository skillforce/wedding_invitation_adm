<script setup lang="ts">
import { useRouter } from 'vue-router'
import Button from 'primevue/button'

const router = useRouter()
</script>

<template>
  <div class="guests-page">
    <p>Guests moved into Dashboard.</p>
    <Button label="Open dashboard" @click="router.push('/dashboard')" />
  </div>
</template>

<style scoped>
.guests-page {
  display: grid;
  gap: 1rem;
}
</style>
