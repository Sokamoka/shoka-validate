import {
  ref,
  watch,
  toValue,
  provide,
  onMounted,
  inject,
  type MaybeRefOrGetter,
  type Ref,
} from "vue";
import { groupBy, get, set } from "lodash-es";
import { safeParseAsync } from "valibot";
import type { BaseSchema, SchemaIssue } from "valibot";

type MaybeRefOrGetterArray<T> = MaybeRefOrGetter<T> | MaybeRefOrGetter<T>[];

type ValidateElements = {
  valid: boolean;
  invalid: boolean;
  output: any;
};

type ValidationReturns = Promise<ValidateElements>;

type ValidationFn = () => Promise<ValidateElements>;

interface Errors {
  [key: string]: Errors | SchemaIssue[];
}

type Api = {
  errors: Ref<Errors | null>;
  validate: () => Promise<ValidateElements>;
  hasError: (path: string) => boolean;
  clearErrors: () => void;
  externalErrors: (key: string, message: unknown) => void;
  getErrorMessage: (errorPath: string) => string;
  register: (fn: ValidationFn) => void;
  validateAll: () => Promise<ValidateElements>;
};

const ValidationApiContext = Symbol("ValidationApiContext");

function useValidationApiContext(): Api {
  let context = inject(ValidationApiContext, null);
  if (context === null) {
    let err = new Error(`<Is missing a parent useValibotValidation composable.`);
    if (Error.captureStackTrace)
      // @ts-ignore
      Error.captureStackTrace(err, ValidationApiContext);
    throw err;
  }
  return context as Api;
}

export function useValibotValidation<T extends MaybeRefOrGetter<BaseSchema>>(
  schema?: T,
  data?: MaybeRefOrGetterArray<Record<string, unknown>>,
  options?: { mode?: "eager" | "lazy"; registerAs?: string }
) {
  const _options = Object.assign({}, { mode: "lazy", registerAs: "" }, options);

  let unwatch: null | (() => void) = null;

  const errors = ref<Errors | null>(null);
  const validations = ref<ValidationFn[]>([]);

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

  async function validate(): ValidationReturns {
    if (schema === undefined) throw Error("Need Schema");

    if (_options.registerAs) {
      set(api.errors.value || {}, _options.registerAs, null);
    } else {
      api.errors.value = null;
    }
    const result = await safeParseAsync(toValue(schema), toValue(data));

    if (!result.success) {
      const valiErrors = groupBy(result.issues, (i) =>
        (i.path || []).map((ii) => ii.key).join(".")
      );
      api.errors.value = {
        ...api.errors.value,
        ...(_options.registerAs
          ? { [_options.registerAs]: valiErrors }
          : valiErrors),
      };
      validationWatch();
    }

    return {
      valid: result.success,
      invalid: !result.success,
      output: result.output,
    };
  }

  function clearErrors() {
    api.errors.value = null;
  }

  function getErrorMessage(errorPath: string): string {
    return String(get(api.errors.value, [errorPath, 0, "message"].join(".")));
  }

  function hasError(errorPath: string): boolean {
    const errorObject = get(api.errors.value, errorPath);
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

  async function validateAll(): ValidationReturns {
    const result = await Promise.all(
      validations.value.map((v: ValidationFn) => v())
    );
    const finalResult = result.every((item: ValidateElements) => item.valid);

    return {
      valid: finalResult,
      invalid: !finalResult,
      output: result.map((item) => item.output),
    };
  }

  let api: Api = {
    errors,
    validate,
    hasError,
    clearErrors,
    validateAll,
    externalErrors,
    getErrorMessage,
    register: (fn: ValidationFn) => {
      validations.value.push(fn);
    },
  };
  const injectedApi = inject(ValidationApiContext, null);
  if (injectedApi) {
    api = injectedApi as Api;
    onMounted(() => api.register(validate));
  } else {
    provide(ValidationApiContext, api);
  }

  return {
    errors,
    validate,
    hasError,
    clearErrors,
    validateAll,
    externalErrors,
    getErrorMessage,
  };
}

export function useValidationErrors(): Api {
  const api: Api = useValidationApiContext();

  return {
    ...api,
  };
}
