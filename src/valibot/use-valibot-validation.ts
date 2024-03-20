import {
  ref,
  watch,
  toValue,
  type MaybeRefOrGetter,
  provide,
  inject,
} from "vue";
import { groupBy, get } from "lodash-es";
import { safeParseAsync } from "valibot";
import type { AnySchema, SchemaIssue } from "valibot";

const ValidationApiContext = Symbol("ValidationApiContext");

function useValidationApiContext() {
  let context = inject(ValidationApiContext, null);
  if (context === null) {
    let err = new Error(`<Is missing a parent useValidation composable.`);
    // @ts-ignore
    if (Error.captureStackTrace) Error.captureStackTrace(err, ValidationApiContext);
    throw err;
  }
  return context;
}

export function useValibotValidation<T extends MaybeRefOrGetter<AnySchema>>(
  schema?: T,
  data?: MaybeRefOrGetter<Record<string, unknown>>,
  options?: { mode: "eager" | "lazy" }
) {
  const _options = Object.assign({}, { mode: "lazy" }, options);

  let unwatch: null | (() => void) = null;

  const isValid = ref(false);
  const errors = ref<Record<string, SchemaIssue[]> | null>(null);

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
    if (schema === undefined) return;
    clearErrors();
    const result = await safeParseAsync(toValue(schema), toValue(data));

    isValid.value = result.success;

    if (!result.success) {
      errors.value = groupBy(result.issues, (i) =>
        (i.path || []).map((ii) => ii.key).join(".")
      );
      validationWatch();
    }

    return result.success;
  }

  function clearErrors() {
    errors.value = null;
  }

  function getErrorMessage(errorPath: string) {
    return get(errors.value, [errorPath, 0, "message"]);
  }

  function hasError(errorPath: string) {
    const errorObject = get(errors.value, errorPath);
    return Boolean(errorObject);
  }

  function externalErrors(key: string, message: unknown) {
    errors.value = { ...errors.value, [key]: [{ message }] } as Record<
      string,
      SchemaIssue[]
    >;
  }

  if (_options.mode === "eager") {
    validationWatch();
  }

  let api = {
    errors,
    isValid,
    validate,
    hasError,
    clearErrors,
    externalErrors,
    getErrorMessage,
  };
  const injectedApi = inject(ValidationApiContext, null);
  if (injectedApi) {
    api = injectedApi;
  } else {
    provide(ValidationApiContext, api);
  }

  return {
    ...api,
  };
}

export function useValidationErrors() {
  const api: Object = useValidationApiContext();

  return {
    ...api,
  };
}
