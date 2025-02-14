"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCurrentUser = void 0;
const addCurrentUser = (payload, ctx) => {
    return {
        ...payload,
        updatedBy: ctx.currentUserId,
    };
};
exports.addCurrentUser = addCurrentUser;
