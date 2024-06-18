<script lang="ts" setup>
import { computed, reactive } from "vue";
// import * as v from "valibot";
import { format } from "date-fns";
import {
  useValibotValidation,
  object,
  RequiredString,
  RequiredDate,
  GenericSchema,
} from "shoka-validate/valibot";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import NestedRadioGroup from "./NestedRadioGroup.vue";

type Schema = {
  firstName: string;
  gender: string;
  dob?: string | Date;
};

const props = defineProps<{
  id: number;
  isDobRequired: boolean;
}>();

const firstName = defineModel<string>("firstName");
const dob = defineModel<Date | null>("dob");
const gender = defineModel<string>("gender");

const data = reactive({
  firstName,
  dob,
  gender,
});

const schema = computed(
  () =>
    object({
      firstName: RequiredString("firstName"),
      gender: RequiredString("gender"),
      ...(props.isDobRequired && {
        dob: RequiredDate("Date of Birth"),
      }),
    })
);

const { hasError, getErrorMessage, validate } = useValibotValidation(
  schema,
  data,
  {
    registerAs: `person${props.id}`,
  }
);

async function onNext() {
  const result = await validate();
  console.log(result);
}
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
        <Popover>
          <PopoverTrigger as-child>
            <Button
              id="dateOfBirth"
              :variant="'outline'"
              :aria-invalid="hasError(`person${props.id}.dob`)"
              :class="[
                'w-[280px] justify-start text-left font-normal block',
                {
                  'border-red-500 bg-red-50': hasError(`person${props.id}.dob`),
                },
              ]"
            >
              <span>{{ dob ? format(dob, "PPP") : "Pick a date" }}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-0">
            <Calendar v-model="dob" />
          </PopoverContent>
        </Popover>
        <!-- <Input
          id="dateOfBirth"
          v-model="dob"
          placeholder="Date Of Birth"
          :class="{
            'border-red-500 bg-red-50': hasError(`person${props.id}.dob`),
          }"
          :aria-invalid="hasError(`dob`)"
        /> -->
        <div
          v-if="hasError(`person${props.id}.dob`)"
          class="text-red-500 text-xs"
        >
          {{ getErrorMessage(`person${props.id}.dob`) }}
        </div>
      </section>

      <NestedRadioGroup v-model:gender="gender" :id />

      <Button variant="secondary" @click="onNext">Next</Button>
    </CardContent>
  </Card>
</template>
