<script setup lang="ts">
import { useValidationErrors } from "shoka-validate/valibot";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const props = defineProps<{
  id: number;
}>();

const gender = defineModel<string>("gender");

const { hasError, getErrorMessage } = useValidationErrors();
</script>

<template>
  <section>
    <Label :for="`gender-${props.id}`" :class="{ 'text-red-500 ': hasError(`person${props.id}.gender`) }"
      >Gender</Label
    >
    <RadioGroup v-model="gender" :id="`gender-${props.id}`" :aria-invalid="hasError(`person${props.id}.gender`)">
          <div
            :class="[
              'flex items-center space-x-2',
              { 'text-red-500': hasError(`person${props.id}.gender`) },
            ]"
          >
            <RadioGroupItem :id="`gender-${props.id}-male`" value="male" />
            <Label :for="`gender-${props.id}-male`">Male</Label>
          </div>
          <div
            :class="[
              'flex items-center space-x-2',
              { 'text-red-500': hasError(`person${props.id}.gender`) },
            ]"
          >
            <RadioGroupItem :id="`gender-${props.id}-female`" value="female" />
            <Label :for="`gender-${props.id}-female`">Female</Label>
          </div>
        </RadioGroup>
    <div v-if="hasError(`person${props.id}.gender`)" class="text-red-500 text-xs">
      {{ getErrorMessage(`person${props.id}.gender`) }}
    </div>
  </section>
</template>
