<script setup lang="ts">
import { computed, reactive } from "vue";
import { useValidation } from "wizz-validate";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type ZodSchema, z } from "zod";

const insurance = reactive({
  type: "",
  checked: false,
});

const validationSchema = computed<ZodSchema>(() =>
  z.object({
    type: z.enum(["travel", "cancelation", "none"], {
      required_error: "You need to select a notification type.",
    }),
    ...(["travel", "cancelation"].includes(insurance.type) && {
      checked: z.literal<boolean>(true),
    }),
  })
);

const { errors, validate } = useValidation(validationSchema, insurance);

const onValidate = async () => {
  const isValid = await validate();
  console.log(isValid);
};
</script>
<template>
  <div class="grid grid-cols-1 gap-5">
    <Card>
      <CardHeader>
        <CardTitle>Travel Insurance</CardTitle>
        <CardDescription
          >Be prepared and travel as safely as possible</CardDescription
        >
      </CardHeader>
      <CardContent>
        <RadioGroup v-model="insurance.type">
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="option-one" value="travel" />
            <Label for="option-one">Travel</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="option-two" value="cancelation" />
            <Label for="option-two">Cancelation</Label>
          </div>
          <div class="flex items-center space-x-2">
            <RadioGroupItem id="option-none" value="none" />
            <Label for="option-none">None</Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>

    <Accordion type="single">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent class="flex flex-col gap-5 p-5">
          <p>Yes. It adheres to the WAI-ARIA design pattern.</p>

          <section class="flex flex-col space-y-1.5 group">
            <!-- <Label for="name" :class="{ 'text-red-500': hasError('name') }"
              >Name</Label
            > -->
            <!-- v-model="form.name" -->
            <Input id="name" name="name" placeholder="Name of your project" />
            <!-- :class="{
                'border-red-500 bg-red-50 text-red-500': hasError('name'),
              }" -->
            <!-- :aria-invalid="hasError('name')"
              @input="onUpdate" -->
            <!-- <div v-if="hasError('name')" class="text-red-500 text-xs">
              {{ getErrorMessage("name") }}
            </div> -->
          </section>

          <section class="items-top flex gap-x-2">
            <Checkbox
              id="terms1"
              :checked="insurance.checked"
              @update:checked="() => (insurance.checked = !insurance.checked)"
            />
            <div class="grid gap-1.5 leading-none">
              <label
                for="terms1"
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Accept terms and conditions
              </label>
              <p class="text-sm text-muted-foreground">
                You agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </section>
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <Button @click="onValidate">Continue</Button>
  </div>

  <pre>
    {{ insurance }}
  </pre>
  <pre>
    {{ errors }}
  </pre>
</template>
