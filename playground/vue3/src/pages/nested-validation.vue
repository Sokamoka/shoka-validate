<script lang="ts" setup>
import { computed, reactive } from "vue";
import { useValidation } from "shoka-validate";
import { type ZodSchema, z } from "zod";
import { Button } from "@/components/ui/button";

import FormItem from "@/components/FormItem.vue";

const members = reactive([
  {
    firstName: "John",
  },
  {
    firstName: "Mark",
  },
  {
    firstName: "",
  },
]);

const validationSchema = computed<ZodSchema>(() =>
  z.array(
    z.object({
      firstName: z.string().min(1, "The name field is required"),
    })
  )
);

const { errors, validate } = useValidation(validationSchema, members);

const onValidate = async () => {
  const isValid = await validate();
  console.log(isValid);
};
</script>

<template>
  <div class="grid grid-cols-2 gap-5">
    <div>
      <ul class="space-y-5">
        <li v-for="(member, index) in members" :key="index">
          <FormItem v-model:firstName="member.firstName" :id="index" />
        </li>

        <li>
          <Button @click="onValidate">Next</Button>
        </li>
      </ul>
    </div>

    <div>
      <pre>
        {{ members }}
      </pre>
      <pre>
        {{ errors }}
      </pre>
    </div>
  </div>
</template>
