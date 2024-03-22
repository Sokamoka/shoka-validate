<script setup lang="ts">
import { computed, h, reactive, ref } from "vue";
import { useValidation, useScrollToError } from "shoka-validate";
import { type ZodSchema, z } from "zod";
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
import { useToast } from "@/components/ui/toast/use-toast";

function nextFrame(cb: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(cb))
}

const { toast } = useToast();

const insurance = reactive({
  type: "",
  fiscalCode: "",
  checked: false,
});

const validationSchema = computed<ZodSchema>(() =>
  z.object({
    type: z.enum(["travel", "cancellation", "none"], {
      errorMap: () => ({ message: "You need to select a insurance type." }),
    }),
    ...(["travel", "cancellation"].includes(insurance.type) && {
      checked: z.literal<boolean>(true, {
        errorMap: () => ({ message: "Please accept terms and conditions" }),
      }),
      fiscalCode: z.string().length(6),
    }),
  })
);

const isAccordionOpened = ref("");

const { errors, validate, hasError, getErrorMessage } = useValidation(
  validationSchema,
  insurance
);
const scrollTo = useScrollToError({ offset: 40 });

const onValidate = async () => {
  const isValid = await validate();
  if (!isValid) {
    if (insurance.type === "travel" || insurance.type === "cancellation") {
      isAccordionOpened.value = "item-1";
      return nextFrame(() => scrollTo());
    }
    return scrollTo();
  }
  toast({
    title: "Form valid!",
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(insurance, null, 2))),

  });
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
        <RadioGroup v-model="insurance.type" :aria-invalid="hasError('type')">
          <div
            :class="[
              'flex items-center space-x-2',
              { 'text-red-500': hasError('type') },
            ]"
          >
            <RadioGroupItem id="option-one" value="travel" />
            <Label for="option-one">Travel</Label>
          </div>
          <div
            :class="[
              'flex items-center space-x-2',
              { 'text-red-500': hasError('type') },
            ]"
          >
            <RadioGroupItem id="option-two" value="cancellation" />
            <Label for="option-two">Cancellation</Label>
          </div>
          <div
            :class="[
              'flex items-center space-x-2',
              { 'text-red-500': hasError('type') },
            ]"
          >
            <RadioGroupItem id="option-none" value="none" />
            <Label for="option-none">None</Label>
          </div>
        </RadioGroup>
        <p v-if="hasError('type')" class="text-red-500 text-xs mt-3">
          {{ getErrorMessage("type") }}
        </p>
      </CardContent>
    </Card>

    <Accordion v-model="isAccordionOpened" type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent class="flex flex-col gap-5 p-5">
          <p>Yes. It adheres to the WAI-ARIA design pattern.</p>

          <section class="flex flex-col space-y-1.5 group">
            <Label
              for="fiscalCode"
              :class="{ 'text-red-500': hasError('fiscalCode') }"
              >Fiscal code</Label
            >
            <Input
              id="fiscalCode"
              v-model="insurance.fiscalCode"
              placeholder="Fiscal code"
              :aria-invalid="hasError('fiscalCode')"
              :class="{
                'border-red-500 bg-red-50 text-red-500': hasError('fiscalCode'),
              }"
            />
            <!-- :aria-invalid="hasError('name')"
              @input="onUpdate" -->
            <!-- <div v-if="hasError('name')" class="text-red-500 text-xs">
              {{ getErrorMessage("name") }}
            </div> -->
          </section>

          <section :aria-invalid="hasError('checked')">
            <div class="items-top flex gap-x-2">
              <Checkbox
                id="terms1"
                v-model:checked="insurance.checked"
                :class="{
                  'border-red-500 bg-red-50 text-red-500': hasError('checked'),
                }"
              />
              <div class="grid gap-1.5 leading-none">
                <label
                  for="terms1"
                  :class="[
                    'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                    { 'text-red-500': hasError('checked') },
                  ]"
                >
                  Accept terms and conditions
                </label>
                <p class="text-sm text-muted-foreground">
                  You agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
            <p v-if="hasError('checked')" class="text-red-500 text-xs">
              {{ getErrorMessage("checked") }}
            </p>
          </section>
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <Button @click="onValidate">Continue</Button>
  </div>

  <code>
    {{ insurance }}
  </code>
  <pre>
    {{ errors }}
  </pre>
</template>
