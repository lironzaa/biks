import { Observable } from "rxjs";

import { DataFiltersFormValues } from "../interfaces/data-filters-form-values";

export const filterPartialDateRangeValue = () => {
  return (source: Observable<Partial<DataFiltersFormValues>>) => new Observable<Partial<DataFiltersFormValues>>(observer => {
    return source.subscribe({
      next(formValues) {
        if (formValues.dateRange && formValues.dateRange.startDate && !formValues.dateRange.endDate) {
          formValues.dateRange = null;
          observer.next(formValues);
          return;
        }
        if (formValues.dateRange && !formValues.dateRange.startDate && formValues.dateRange.endDate) {
          formValues.dateRange = null;
          observer.next(formValues);
          return;
        }
        if (formValues.dateRange && !formValues.dateRange.startDate && !formValues.dateRange.endDate) {
          formValues.dateRange = null;
          observer.next(formValues);
          return;
        }
        observer.next(formValues);
      },
      error(err): void {
        observer.error(err);
      },
      complete(): void {
        observer.complete();
      }
    });
  });
}
