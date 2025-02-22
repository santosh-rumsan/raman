'use client';

import { useLookUpList } from '@rumsan/raman-ui/queries/misc.query';
import { LookupData } from '@rumsan/raman/src/clients/misc.client';

export const findByName = <T extends keyof LookupData>(
  data: LookupData,
  type: T,
  lookupKey: string,
): LookupData[T][number] | undefined => {
  return data[type].find((item) => item.cuid === lookupKey);
};

export const useLookUp = <T extends keyof LookupData>() => {
  const { data } = useLookUpList();

  //if (!data) return undefined; // Explicitly return undefined when data is not available
  return {
    lookupByCuid: (group: T, cuid: string) =>
      data ? data[group]?.find((item) => item.cuid === cuid) : null,
  };
};
