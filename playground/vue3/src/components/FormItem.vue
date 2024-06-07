<script lang="ts" setup>
import { useValibotValidation } from "shoka-validate/valibot";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const props = defineProps<{
  id: number;
  isDobRequired: boolean;
}>();

const firstName = defineModel<string>("firstName");
const dob = defineModel<string>("dob");

const { hasError, getErrorMessage } = useValibotValidation();
</script>

<template>
  <Card>
    <CardContent class="grid grid-cols-1 pt-6 gap-5">
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

      <section v-if="isDobRequired" class="flex flex-col space-y-1.5">
        <Label
          for="dateOfBirth"
          :class="{ 'text-red-500 ': hasError(`${props.id}.dob`) }"
          >Date Of Birth</Label
        >
        <Input
          id="dateOfBirth"
          v-model="dob"
          placeholder="Date Of Birth"
          :class="{
            'border-red-500 bg-red-50': hasError(`${props.id}.dob`),
          }"
          :aria-invalid="hasError(`${props.id}.dob`)"
        />
        <div
          v-if="hasError(`${props.id}.dob`)"
          class="text-red-500 text-xs"
        >
          {{ getErrorMessage(`${props.id}.dob`) }}
        </div>
      </section>
    </CardContent>
  </Card>
</template>
