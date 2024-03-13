<script lang="ts" setup>
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";

const firstName = defineModel<string>("firstName");
</script>

<template>
  <Card>
    <CardContent class="grid grid-cols-3 pt-6">
      <section class="flex flex-col space-y-1.5">
        <!-- <Label for="name" :class="{ 'text-red-500 ': hasError('name') }"
          >Name</Label
        > -->
        <Input id="name" v-model="firstName" placeholder="Name" />
        <!-- :class="{ 'border-red-500 bg-red-50': hasError('name') }"
          :aria-invalid="hasError('name')" -->
        <!-- <div v-if="hasError('name')" class="text-red-500 text-xs">
          {{ getErrorMessage("name") }}
        </div> -->
      </section>
    </CardContent>
  </Card>
</template>
