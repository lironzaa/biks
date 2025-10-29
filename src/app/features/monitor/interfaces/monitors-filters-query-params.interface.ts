interface MonitorsFiltersQueryParamsBase {
  ids?: string | string[] | null | undefined;
  name?: string | null | undefined;
  page?: string;
}

export interface MonitorsFiltersQueryParams extends MonitorsFiltersQueryParamsBase {
  isPassed?: boolean | string | null;
  isFailed?: boolean | string | null;
}

export interface MonitorsFiltersFormPatchValues extends MonitorsFiltersQueryParamsBase {
  isPassed?: boolean | null;
  isFailed?: boolean | null;
}
