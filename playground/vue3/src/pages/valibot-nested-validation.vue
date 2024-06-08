<script lang="ts" setup>
import { h, reactive } from "vue";
import { useValibotValidation } from "shoka-validate/valibot";
import { useScrollToError } from "shoka-validate";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";

import FormItem from "@/components/NestedFormItem.vue";

const members = reactive([
  {
    firstName: "",
    isDobRequired: false,
    dob: null,
    gender: "",
  },
  {
    firstName: "",
    isDobRequired: true,
    dob: null,
    gender: "",
  },
  {
    firstName: "",
    isDobRequired: true,
    dob: null,
    gender: "",
  },
]);

const { toast } = useToast();

const { errors, validateAll } = useValibotValidation();

const scrollTo = useScrollToError({ offset: 40 });

const onValidate = async () => {
  const result = await validateAll();
  if (result.invalid) return scrollTo();
  toast({
    title: "Form valid!",
    description: h(
      "pre",
      { class: "mt-2 w-[340px] rounded-md bg-lime-600 p-4" },
      h("code", { class: "text-white" }, JSON.stringify(result.output, null, 2))
    ),
  });
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
      <pre>{{ members }}</pre>

      <p class="font-bold">Errors:</p>
      <pre
        class="mt-2 w-full rounded-md bg-rose-50 p-4"
      ><code class="w-full">{{ JSON.stringify(errors, null, 2) }}</code></pre>
    </div>
  </div>
</template>
