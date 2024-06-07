<script lang="ts" setup>
import { reactive } from "vue";
import { useValibotValidation } from "shoka-validate/valibot";
import { useScrollToError } from "shoka-validate";
import { Button } from "@/components/ui/button";

import FormItem from "@/components/NestedFormItem.vue";

const members = reactive([
  {
    firstName: "",
    isDobRequired: false,
    dob: "",
    gender: "",
  },
  {
    firstName: "",
    isDobRequired: true,
    dob: "",
    gender: "",
  },
  {
    firstName: "",
    isDobRequired: true,
    dob: "",
    gender: "",
  },
]);


const { errors, validateAll } = useValibotValidation();

const scrollTo = useScrollToError({ offset: 40 });

const onValidate = async () => {
  const result = await validateAll();
  console.log('validateAll:', result);
  if (result.invalid) return scrollTo();
};
</script>

<template>
  <div class="grid grid-cols-2 gap-5">
    <div>
      <ul class="space-y-5">
        <li v-for="(member, index) in members" :key="index">
          <FormItem
            :id="index"
            v-model:firstName="member.firstName"
            v-model:dob="member.dob"
            v-model:gender="member.gender"
            :isDobRequired="member.isDobRequired"
          />
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
