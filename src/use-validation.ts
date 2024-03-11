import {
  ref,
  watch,
  toValue,
  type MaybeRefOrGetter,
  provide,
  inject,
} from "vue";
import { groupBy, get, toPath } from "lodash-es";
import type { ZodTypeAny, ZodIssue } from "zod";

const ValidationApiContext = Symbol("ValidationApiContext");

export function useValidation<T extends MaybeRefOrGetter<ZodTypeAny>>(
  schema: T,
  data: MaybeRefOrGetter<Record<string, unknown>>,
  options?: { mode: "eager" | "lazy" }
) {
  const _options = Object.assign({}, { mode: "lazy" }, options);

  let unwatch: null | (() => void) = null;

  const isValid = ref(false);
  const errors = ref<Record<string, ZodIssue[]> | null>(null);

  watch(
    () => toValue(schema),
    async () => {
      if (unwatch === null) return;
      await validate();
    },
    { deep: true }
  );

  function validationWatch() {
    if (unwatch !== null) return;

    unwatch = watch(
      () => toValue(data),
      async () => {
        await validate();
      },
      { deep: true }
    );
  }

  async function validate() {
    clearErrors();
    const result = await toValue(schema).safeParseAsync(toValue(data));

    isValid.value = result.success;

    if (!result.success) {
      errors.value = groupBy(result.error.issues, "path");
      validationWatch();
    }

    return result.success;
  }

  function clearErrors() {
    errors.value = null;
  }

  function getErrorMessage(errorPath: string) {
    return get(errors.value, [toPath(errorPath).join(","), 0, "message"]);
  }

  function hasError(errorPath: string) {
    const errorObject = get(errors.value, toPath(errorPath).join(","));
    return Boolean(errorObject);
  }

  function externalErrors(key: string, message: unknown) {
    errors.value = { ...errors.value, [key]: [{ message }] } as Record<
      string,
      ZodIssue[]
    >;
  }

  if (_options.mode === "eager") {
    validationWatch();
  }

  const api = {
    errors,
    isValid,
    validate,
    hasError,
    clearErrors,
    externalErrors,
    getErrorMessage,
  };

  provide(ValidationApiContext, api);

  return {
    ...api,
  };
}

export function useValidator() {
  const api: Object = inject(ValidationApiContext) || {};

  return {
    ...api 
  }
}
