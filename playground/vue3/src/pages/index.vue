<script lang="ts" setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router/auto';

const router = useRouter();
const routes = computed(() =>
  router.getRoutes().filter((route) => route.path !== '/' && !route.path.includes(':') && !route.children.length)
);
</script>

<template>
  <div>
    <ul>
      <li v-for="route in routes">
        <RouterLink :to="route.path" v-slot="{ href }">{{
          href
        }}</RouterLink>
      </li>
    </ul>
  </div>
</template>
