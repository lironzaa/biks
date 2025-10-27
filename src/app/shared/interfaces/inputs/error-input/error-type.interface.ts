export interface MinLengthError { requiredLength: number; actualLength: number; }
export interface MaxLengthError { requiredLength: number; actualLength: number; }
export interface MinMaxError { min?: number; max?: number; actual: number; }