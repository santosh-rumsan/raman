const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  DEPARTMENT: '/departments',
  PROJECT: '/projects',
  CATEGORY: '/category',
  EXPENSE: '/expenses',
  RECEIPT: '/receipts',
  PUBLIC: '/public',
  ACCOUNTS: '/accounts',
};

export const PATHS = {
  AUTH: {
    LOGIN: `${ROOTS.AUTH}/login`,
  },
  DASHBOARD: {
    HOME: ROOTS.DASHBOARD,
  },
  DEPARTMENT: {
    HOME: `${ROOTS.DEPARTMENT}`,
  },
  CATEGORY: {
    HOME: `${ROOTS.CATEGORY}`,
  },
  PROJECT: {
    HOME: `${ROOTS.PROJECT}`,
  },
  ACCOUNTS: {
    HOME: `${ROOTS.ACCOUNTS}`,
    TXNS: (cuid: string) => `${ROOTS.ACCOUNTS}/${cuid}/transactions`,
  },
  EXPENSE: {
    HOME: `${ROOTS.EXPENSE}`,
    ADD: `${ROOTS.EXPENSE}/add`,
    DETAILS: (cuid: string) => `${ROOTS.EXPENSE}/${cuid}`,
    VERIFY: (cuid: string) => `${ROOTS.EXPENSE}/${cuid}/verification`,
    EDIT: (cuid: string) => `${ROOTS.EXPENSE}/${cuid}`,
  },
  RECEIPT: {
    HOME: `${ROOTS.RECEIPT}`,
    ADD: `${ROOTS.RECEIPT}/add`,
    DETAILS: (cuid: string) => `${ROOTS.RECEIPT}/${cuid}`,
    EDIT: (cuid: string) => `${ROOTS.RECEIPT}/${cuid}`,
    DISPOSITION: (challenge: string) =>
      `${ROOTS.PUBLIC}/receipts/${challenge}/disposition`,
    REIMBURSE: (cuid: string) => `${ROOTS.RECEIPT}/${cuid}/reimburse`,
  },
};
