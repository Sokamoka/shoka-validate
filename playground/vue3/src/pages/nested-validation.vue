<script lang="ts" setup>
import { reactive } from 'vue';
import FormItem from '@/components/FormItem.vue';

const members = reactive([
  {
    firstName: 'John'
  },
  {
    firstName: 'Mark'
  },
  {
    firstName: 'James'
  }
])
</script>

<template>
  <div class="grid grid-cols-2">
    <ul class="space-y-10">
      <li v-for="member in members">
        <FormItem v-model:firstName="member.firstName" />
      </li>
    </ul>

    <div>
      <pre>
        {{ members }}
      </pre>
    </div>
  </div>
</template>
