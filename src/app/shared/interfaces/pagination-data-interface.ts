export interface PaginationData {
  currentPage: number;
  itemsCount: number;
  totalPages: number;
  nextPage: number;
  hasNextPage: boolean;
  previousPage: number;
  hasPreviousPage: boolean;
  itemsPerPage: number;
  from: number;
  to: number;
  isPaginated: boolean;
}
