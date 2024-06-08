import * as v from 'valibot';

// export const Object = (schema: v.AnySchema) => v.object(schema);

export const Password = v.string([
  v.minLength(8, 'Your password is too short.'),
  v.maxLength(30, 'Your password is too long.'),
  v.regex(/[a-z]/, 'Your password must contain a lowercase letter.'),
  v.regex(/[A-Z]/, 'Your password must contain a uppercase letter.'),
  v.regex(/[0-9]/, 'Your password must contain a number.'),
]);

export const RequiredString = () => v.string([v.minLength(1, "The name field is required")]);
export const RequiredDate = (key: string) =>  v.date(`Please add ${key}`);
