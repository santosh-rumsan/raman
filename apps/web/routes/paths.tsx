const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  DEPARTMENT: '/departments',
  PROJECT: '/projects',
  CATEGORY: '/category',
  EXPENSE: '/expenses',
  INVOICE: '/invoices',
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
  INVOICE: {
    HOME: `${ROOTS.INVOICE}`,
    ADD: `${ROOTS.INVOICE}/add`,
    DETAILS: (cuid: string) => `${ROOTS.INVOICE}/${cuid}`,
    EDIT: (cuid: string) => `${ROOTS.INVOICE}/${cuid}`,
    DISPOSITION: (challenge: string) =>
      `${ROOTS.PUBLIC}/invoices/${challenge}/disposition`,
    REIMBURSE: (cuid: string) => `${ROOTS.INVOICE}/${cuid}/reimburse`,
  },
};
