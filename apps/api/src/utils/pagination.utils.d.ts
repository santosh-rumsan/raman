export interface PaginatedResult<T> {
    data: T[];
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
}
export type PaginateOptions = {
    page?: number | string;
    perPage?: number | string;
    transformRows?: (data: any[]) => any[];
};
export type PaginateFunction = <T, K>(model: any, args?: K, options?: PaginateOptions) => Promise<PaginatedResult<T>>;
export declare const paginate: PaginateFunction;
//# sourceMappingURL=pagination.utils.d.ts.map