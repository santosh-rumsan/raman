import { tRC } from '@rumsan/sdk/types';

export const addCurrentUser = (payload, ctx: tRC) => {
  return {
    ...payload,
    updatedBy: ctx.currentUserId,
  };
};
