import { nextTick, ref } from "vue";
import { MaybeElementRef, unrefElement } from "@vueuse/core";
import { set, get } from "lodash-es";

export function useFormValidation(formElement: MaybeElementRef) {
  const errors = ref({});
  const isTouched = ref(false);

  async function validate(): Promise<boolean> {
    isTouched.value = true;
    const formValidity = await checkFormValidity();
    return formValidity;
  }

  async function checkFormValidity() {
    await nextTick();
    clearErrors();
    const form = unrefElement(formElement) as HTMLFormElement;
    const fields = Array.from(form) as HTMLFormElement[];

    const formValidity = form.checkValidity();

    for (const field of fields) {
      const name = field.getAttribute("name");
      if (name && !field.validity.valid) {
        set(errors.value, name, {
          isValid: field.validity.valid,
          message: field.validationMessage,
        });
      }
    }
    return formValidity;
  }

  function clearErrors() {
    errors.value = {};
  }

  function reset() {
    isTouched.value = false;
    errors.value = {};
  }

  function hasError(errorPath: string) {
    const errorObject = get(errors.value, errorPath);
    return Boolean(errorObject);
  }

  function getErrorMessage(errorPath: string) {
    const errorObject = get(errors.value, errorPath);
    return errorObject?.message;
  }

  function onUpdate() {
    if (!isTouched.value) return;
    checkFormValidity();
  }

  return { errors, validate, hasError, onUpdate, clearErrors, getErrorMessage, reset };
}
