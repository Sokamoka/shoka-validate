<script lang="ts" setup>
import { useValidation } from "wizz-validate";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const props = defineProps<{
  id: number;
}>();

const firstName = defineModel<string>("firstName");

const { hasError, getErrorMessage } = useValidation();
</script>

<template>
  <Card>
    <CardContent class="grid grid-cols-1 pt-6">
      <section class="flex flex-col space-y-1.5">
        <Label
          for="firstName"
          :class="{ 'text-red-500 ': hasError(`${props.id}.firstName`) }"
          >First name</Label
        >
        <Input
          id="firstName"
          v-model="firstName"
          placeholder="First name"
          :class="{
            'border-red-500 bg-red-50': hasError(`${props.id}.firstName`),
          }"
          :aria-invalid="hasError(`${props.id}.firstName`)"
        />
        <div
          v-if="hasError(`${props.id}.firstName`)"
          class="text-red-500 text-xs"
        >
          {{ getErrorMessage(`${props.id}.firstName`) }}
        </div>
      </section>
    </CardContent>
  </Card>
</template>
