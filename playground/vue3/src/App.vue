<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import HeaderMenu from './components/HeaderMenu.vue';
</script>

<template>
  <div class="max-w-screen-md mx-auto pt-10">
    <div class="fixed top-0 left-0 p-3">
      <HeaderMenu />
    </div>
    <RouterView />
    <Toaster />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
