<script setup lang="ts">
import { computed } from "vue";
import {
  NavigationMenu,
  NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // NavigationMenuViewport,
} from "@/components/ui/navigation-menu";

import { useRouter } from "vue-router/auto";

const router = useRouter();
const routes = computed(() =>
  router
    .getRoutes()
    .filter(
      (route) =>
        route.path !== "/" &&
        !route.path.includes(":") &&
        !route.children.length
    )
);
</script>

<template>
  <NavigationMenu>
    <NavigationMenuList>
      <NavigationMenuItem>
        <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul class="grid min-w-56 gap-3 p-4">
            <li v-for="route in routes">
              <RouterLink :to="route.path" v-slot="{ href, isActive }">
                <a :href="href" :class="{ 'text-indigo-500': isActive }">{{
                  href
                }}</a>
              </RouterLink>
            </li>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
</template>
