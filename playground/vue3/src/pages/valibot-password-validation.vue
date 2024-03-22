<script setup lang="ts">
import { reactive, watch, shallowRef, h } from "vue";
import * as v from "valibot";
import type ValiSchema from "valibot";
import { useValibotValidation, Password } from "wizz-validate/valibot";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";

const passwordRules = shallowRef({
  length: false,
  numberAndLetter: false,
  upperAndLower: false,
});

const form = reactive({
  email: "",
  password: "",
});

const ValidationSchema: ValiSchema = v.object({
  email: v.string([v.minLength(1), v.email()]),
  password: Password,
});

const { errors, getErrorMessage, hasError, validate } = useValibotValidation(
  ValidationSchema,
  form
);

const { toast } = useToast();

watch(() => form.password, checkPassword, { immediate: true });

function checkPassword(value) {
  const passwordSchema = v.pick(ValidationSchema, ["password"]);
  const result = v.safeParse(passwordSchema, { password: value });
  // console.log(result);

  passwordRules.value = {
    length: !(result.issues || []).some((issue) =>
      ["min_length", "max_length"].includes(issue.context)
    ),
    numberAndLetter: !(result.issues || []).some(
      ({ expected }) => expected === "/[0-9]/"
    ),
    upperAndLower: !(result.issues || []).some((issue) =>
      ["/[a-z]/", "/[A-Z]/"].includes(issue.expected)
    ),
  };
}

const onValidate = async () => {
  const { invalid, output } = await validate();
  if (invalid) {
    // return scrollTo();
    return;
  }
  toast({
    title: "Form valid!",
    description: h(
      "pre",
      { class: "mt-2 w-[340px] rounded-md bg-slate-950 p-4" },
      h("code", { class: "text-white" }, JSON.stringify(output, null, 2))
    ),
  });
};
</script>

<template>
  <Card class="w-[550px] mx-auto">
    <CardHeader>
      <CardTitle>Registration</CardTitle>
      <CardDescription>Register user </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <section class="flex flex-col space-y-1.5">
            <Label for="email" :class="{ 'text-red-500 ': hasError('email') }"
              >E-mail</Label
            >
            <Input
              id="email"
              type="email"
              v-model="form.email"
              placeholder="E-mail"
              :class="{ 'border-red-500 bg-red-50': hasError('email') }"
              :aria-invalid="hasError('email')"
            />
            <div v-if="hasError('email')" class="text-red-500 text-xs">
              {{ getErrorMessage("email") }}
            </div>
          </section>

          <section class="flex flex-col space-y-1.5">
            <Label
              for="password"
              :class="{ 'text-red-500 ': hasError('password') }"
              >Password</Label
            >

            <ul class="mt-3 p-5 bg-slate-100 rounded-md">
              <li
                :class="[
                  'text-sm',
                  passwordRules.length ? 'text-green-500' : 'text-gray-400',
                ]"
              >
                min. 7, max. 16 characters,
              </li>
              <li
                :class="[
                  'text-sm',
                  passwordRules.numberAndLetter
                    ? 'text-green-500'
                    : 'text-gray-400',
                ]"
              >
                both number and letters are obligatory,
              </li>
              <li
                :class="[
                  'text-sm',
                  passwordRules.upperAndLower
                    ? 'text-green-500'
                    : 'text-gray-400',
                ]"
              >
                we accept upper and lower-case letters, numbers and special
                characters.
              </li>
            </ul>

            <Input
              id="password"
              type="text"
              v-model="form.password"
              placeholder="Password"
              :class="{ 'border-red-500 bg-red-50': hasError('password') }"
              :aria-invalid="hasError('password')"
            />
            <div v-if="hasError('password')" class="text-red-500 text-xs">
              {{ getErrorMessage("password") }}
            </div>
          </section>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <!-- <Button variant="outline" @click="onReset"> Reset </Button> -->
      <Button @click="onValidate">Next</Button>
    </CardFooter>
  </Card>

  <pre>{{ errors }}</pre>
</template>