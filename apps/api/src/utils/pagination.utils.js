"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const paginator = (defaultOptions) => {
    return async (model, args = { where: undefined }, options) => {
        const page = Number(options?.page || defaultOptions?.page) || 1;
        const perPage = Number(options?.perPage || defaultOptions?.perPage) || 10;
        const skip = page > 0 ? perPage * (page - 1) : 0;
        const [total, data] = await Promise.all([
            model.count({ where: args.where }),
            model.findMany({
                ...args,
                take: perPage,
                skip,
            }),
        ]);
        const lastPage = Math.ceil(total / perPage);
        const meta = {
            total,
            lastPage,
            currentPage: page,
            perPage,
        };
        if (options?.transformRows) {
            return {
                data: options.transformRows(data),
                ...meta,
            };
        }
        return {
            data,
            ...meta,
        };
    };
};
exports.paginate = paginator({ perPage: 10 });
