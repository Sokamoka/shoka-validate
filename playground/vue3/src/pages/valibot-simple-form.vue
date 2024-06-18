<script setup lang="ts">
import { reactive, computed } from "vue";
import {
  useValibotValidation,
  object,
  RequiredString,
  Email,
} from "shoka-validate/valibot";
import { useScrollToError } from "shoka-validate";
// import * as v from "valibot";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Switch from "@/components/ui/switch/Switch.vue";
import { useToast } from "@/components/ui/toast/use-toast";

const { toast } = useToast();

type FormSchema = {
  name: string;
  email: string;
  userName: string;
  framework?: string;
  isFrameworkRequired: boolean;
  address: {
    street: string;
    city: string;
  };
};

const form = reactive<FormSchema>({
  name: "",
  email: "",
  userName: "",
  framework: undefined,
  isFrameworkRequired: false,
  address: {
    street: "",
    city: "",
  },
});

// const validationSchema = computed(() =>
//   object({
//     name: RequiredString("name"),
//     email: Email,
//     userName: RequiredString("username"),
//     ...(form.isFrameworkRequired && {
//       framework: RequiredString("Framework"),
//     }),
//     address: object({
//       street: RequiredString("street"),
//       city: RequiredString("city"),
//     }),
//   })
// );

const schema = computed(() =>
  form.isFrameworkRequired
    ? object({
        name: RequiredString("name"),
        email: Email,
        userName: RequiredString("username"),
        framework: RequiredString("Framework"),
        address: object({
          street: RequiredString("street"),
          city: RequiredString("city"),
        }),
      })
    : object({
        name: RequiredString("name"),
        email: Email,
        userName: RequiredString("username"),
        address: object({
          street: RequiredString("street"),
          city: RequiredString("city"),
        }),
      })
);

const {
  errors,
  getErrorMessage,
  hasError,
  clearErrors,
  validate,
  externalErrors,
} = useValibotValidation(schema, form);

const scrollTo = useScrollToError({ offset: 40 });

async function onValidate() {
  const { invalid } = await validate();
  if (invalid) return scrollTo();
  try {
    await externalAsyncData();
  } catch (error) {
    return externalErrors("userName", error);
  }
  toast({
    title: "Register Success",
  });
}

function onReset() {
  clearErrors();
}

function externalAsyncData() {
  return new Promise((resolve, reject) => {
    if (form.userName === "akos") return reject("This username is reserved");
    resolve(true);
  });
}
</script>
<template>
  <Card class="w-[350px] mx-auto">
    <CardHeader>
      <CardTitle>Registration</CardTitle>
      <CardDescription>Register user </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <div class="grid items-center w-full gap-4">
          <section class="flex flex-col space-y-1.5">
            <Label for="name" :class="{ 'text-red-500 ': hasError('name') }"
              >Name</Label
            >
            <Input
              id="name"
              data-wv-name="name"
              v-model="form.name"
              placeholder="Name of your project"
              :class="{ 'border-red-500 bg-red-50': hasError('name') }"
              :aria-invalid="hasError('name')"
            />
            <div v-if="hasError('name')" class="text-red-500 text-xs">
              {{ getErrorMessage("name") }}
            </div>
          </section>

          <section class="flex flex-col space-y-1.5">
            <Label for="email" :class="{ 'text-red-500 ': hasError('name') }"
              >E-mail</Label
            >
            <Input
              id="email"
              data-wv-name="email"
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
              for="user-name"
              :class="{ 'text-red-500 ': hasError('userName') }"
              >User Name</Label
            >
            <Input
              id="user-name"
              v-model="form.userName"
              placeholder="User Name"
              :class="{
                'border-red-500 bg-red-50': hasError('userName'),
              }"
              :aria-invalid="hasError('userName')"
            />
            <div v-if="hasError('userName')" class="text-red-500 text-xs">
              {{ getErrorMessage("userName") }}
            </div>
          </section>

          <section class="flex items-center space-x-2">
            <Switch
              id="framework-required"
              v-model:checked="form.isFrameworkRequired"
            >
            </Switch>
            <Label for="framework-required">Framework Requierd</Label>
          </section>

          <section class="flex flex-col space-y-1.5">
            <Label
              for="framework"
              :class="{ 'text-red-500': hasError('framework') }"
              >Framework</Label
            >
            <Select v-model="form.framework">
              <SelectTrigger
                id="framework"
                :class="{
                  'border-red-500 bg-red-50': hasError('framework'),
                }"
                :aria-invalid="hasError('framework')"
              >
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="nuxt"> Nuxt.js </SelectItem>
                <SelectItem value="next"> Next.js </SelectItem>
                <SelectItem value="sveltekit"> SvelteKit </SelectItem>
                <SelectItem value="astro"> Astro </SelectItem>
              </SelectContent>
            </Select>
            <div v-if="hasError('framework')" class="text-red-500 text-xs">
              {{ getErrorMessage("framework") }}
            </div>
          </section>

          <h2 class="text-md font-bold">Address</h2>
          <section class="flex flex-col space-y-1.5">
            <Label
              for="street"
              :class="{ 'text-red-500 ': hasError('address.street') }"
              >Street</Label
            >
            <Input
              id="street"
              data-wv-name="address-street"
              v-model="form.address.street"
              placeholder="Street"
              :class="{
                'border-red-500 bg-red-50': hasError('address.street'),
              }"
              :aria-invalid="hasError('address.street')"
            />
            <div v-if="hasError('address.street')" class="text-red-500 text-xs">
              {{ getErrorMessage("address.street") }}
            </div>
          </section>

          <section class="flex flex-col space-y-1.5">
            <Label
              for="city"
              :class="{ 'text-red-500 ': hasError('address.city') }"
              >City</Label
            >
            <Input
              id="city"
              data-wv-name="address-city"
              v-model="form.address.city"
              placeholder="City"
              :class="{ 'border-red-500 bg-red-50': hasError('address.city') }"
              :aria-invalid="hasError('address.city')"
            />
            <div v-if="hasError('address.city')" class="text-red-500 text-xs">
              {{ getErrorMessage("address.city") }}
            </div>
          </section>
        </div>
      </form>
    </CardContent>
    <CardFooter class="flex justify-between px-6 pb-6">
      <Button variant="outline" @click="onReset"> Reset </Button>
      <Button @click="onValidate">Register</Button>
    </CardFooter>
  </Card>

  <pre>{{ form }}</pre>
  <pre>{{ errors }}</pre>
</template>
