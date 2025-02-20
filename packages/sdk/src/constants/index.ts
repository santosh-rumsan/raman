export * from './events';
export * from './subjects';

export const APP = {
  JWT_BEARER: 'JWT',
};

export const allowedDomain = [
  'rumsan.com',
  'rumsan.net',
  'esatya.io',
  'agriclear.io',
  'hamrolifebank.org',
  'rahat.io',
  'gmail.com',
];

export const EMAIL_TEMPLATES = {
  LOGIN: 'login',
  INVOICE: 'invoice',
};

//TODO: should be in @rumsan/sdk
export const ACTIONS = {
  MANAGE: 'manage',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  READ: 'read',
};

export const DRAFT_STATUS = {
  OPEN: 'Open',
  CLOSED: 'Closed',
};
export const SALARY_STATUS = {
  PAID: 'PAID',
  UNPAID: 'UNPAID',
};
