import { ValidationErrors } from "@angular/forms";

export type MinMaxLengthValues = { requiredLength: number, actualLength: number };
export type MinValues = { min: number, actual: string };
export type MaxValues = { max: number, actual: string };

export type ErrorFunction = (values: MinMaxLengthValues | MinValues | MaxValues) => string;

export const DefaultErrorMessages: Record<string, ErrorFunction> = {
  required: () => "The field is required",
  email: () => "Email address is not valid!",
  pattern: () => "The field does not have a valid format.",
  min: (values) => {
    if ("min" in values) {
      return `The field min value is ${ values.min }, current value is ${ values.actual }.`;
    } else {
      return "The field value is below the minimum allowed.";
    }
  },
  max: (values) => {
    if ("max" in values) {
      return `The field max value is ${ values.max }, current value is ${ values.actual }.`;
    } else {
      return "The field value is above the maximum allowed.";
    }
  },
  minlength: (values) => {
    if ("requiredLength" in values) {
      return `The field must have at least ${ values.requiredLength } characters.`;
    } else {
      return "The field value is too short.";
    }
  },
  maxlength: (values) => {
    console.log(values);
    if ("requiredLength" in values) {
      return `The field must have a maximum of ${ values.requiredLength } characters.`;
    } else {
      return "The field value is too long.";
    }
  }
};

export type CustomErrorMessages = Record<string, ErrorFunction>;

export function getErrorMessage(error: ValidationErrors, customErrors: CustomErrorMessages = {}): string {
  const errorName = Object.keys(error)[0];
  const errorValues = error[errorName];

  if (customErrors && customErrors[errorName]) return customErrors[errorName](errorValues);

  const errorMessageGenerator = DefaultErrorMessages[errorName];
  if (errorMessageGenerator) return errorMessageGenerator(errorValues);

  return "An unknown error occurred";
}
