import { FormControl, FormGroup } from "@angular/forms";

type RequiredInputType = {
  name: string;
};

type OptionalInputType = {
  value: string | number;
  formGroup: FormGroup;
  formControl: FormControl;
  placeholder: string;
};

export type InputType = RequiredInputType & Partial<OptionalInputType>;
