<script lang="ts" setup>
import { computed, reactive } from "vue";
import * as v from "valibot";
import { useValibotValidation } from "shoka-validate/valibot";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import NestedRadioGroup from "./NestedRadioGroup.vue";

const props = defineProps<{
  id: number;
  isDobRequired: boolean;
}>();

const firstName = defineModel<string>("firstName");
const dob = defineModel<string>("dob");
const gender = defineModel<string>("gender");

const data = reactive({
  firstName,
  dob,
  gender,
});

const schema = computed(() =>
  v.object({
    firstName: v.string("The name field is required", [v.minLength(1)]),
    gender: v.string("The gender field is required", [v.minLength(1)]),
    ...(props.isDobRequired && {
      dob: v.string("The name field is required", [v.minLength(1)]),
    }),
  })
);

const { hasError, getErrorMessage } = useValibotValidation(schema, data, {
  registerAs: `person${props.id}`,
});
</script>

<template>
  <Card>
    <CardContent class="grid grid-cols-1 pt-6 gap-5">
      <section class="flex flex-col space-y-1.5">
        <Label
          for="firstName"
          :class="{ 'text-red-500 ': hasError(`person${props.id}.firstName`) }"
          >First name</Label
        >
        <Input
          id="firstName"
          v-model="firstName"
          placeholder="First name"
          :class="{
            'border-red-500 bg-red-50': hasError(`person${props.id}.firstName`),
          }"
          :aria-invalid="hasError(`person${props.id}.firstName`)"
        />
        <div
          v-if="hasError(`person${props.id}.firstName`)"
          class="text-red-500 text-xs"
        >
          {{ getErrorMessage(`person${props.id}.firstName`) }}
        </div>
      </section>

      <section v-if="isDobRequired" class="flex flex-col space-y-1.5">
        <Label
          for="dateOfBirth"
          :class="{ 'text-red-500 ': hasError(`person${props.id}.dob`) }"
          >Date Of Birth</Label
        >
        <Input
          id="dateOfBirth"
          v-model="dob"
          placeholder="Date Of Birth"
          :class="{
            'border-red-500 bg-red-50': hasError(`person${props.id}.dob`),
          }"
          :aria-invalid="hasError(`dob`)"
        />
        <div
          v-if="hasError(`person${props.id}.dob`)"
          class="text-red-500 text-xs"
        >
          {{ getErrorMessage(`person${props.id}.dob`) }}
        </div>
      </section>

      <NestedRadioGroup v-model:gender="gender" :id />
    </CardContent>
  </Card>
</template>
