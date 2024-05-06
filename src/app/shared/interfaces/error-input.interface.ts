export type MinMaxLengthValues = { requiredLength: number, actualLength: number };
export type MinValues = { min: number, actual: string };
export type MaxValues = { max: number, actual: string };
export type ErrorFunction = (
  fieldValues?: MinMaxLengthValues | MinValues | MaxValues,
  controlName?: string
) => string;

export const DefaultErrorMessages: Record<string, ErrorFunction> = {
  required: () => "The field is required",
  email: () => "Email address is not valid!",
  pattern: () => "The field does not have a valid format.",
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  min: (fieldValues: MinValues) => `The field min value is ${ fieldValues.min }, current value is ${ fieldValues.actual }.`,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  max: (fieldValues: MaxValues) => `The field max value is ${ fieldValues.max }, current value is ${ fieldValues.actual }.`,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  minlength: (fieldValues: MinMaxLengthValues) => `The field must have at least ${ fieldValues.requiredLength } characters.`,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  maxlength: (fieldValues: MinMaxLengthValues) => `The field must have a maximum of ${ fieldValues.requiredLength } characters.`,
};
