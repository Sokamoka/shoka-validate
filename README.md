# Shoka Validate

Object base Form validation

## ZOD base vue3 composable

```js
import { reactive } from "vue";
import { z } from "zod";
import { useValidation } from "shoka-validate";

const form = reactive({
  name: "",
  email: "",
});

const validationSchema = z.object({
  name: z.string().min(1, "The name field is required"),
  email: z.string().email("Please enter a valid email"),
});

const {
  errors,
  getErrorMessage,
  hasError,
  clearErrors,
  validate,
  externalErrors,
  scrollToFirstError,
} = useValidation(validationSchema, form);
```
