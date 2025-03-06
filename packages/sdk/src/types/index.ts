export * from '@rumsan/raman/types/account.type';
export * from '@rumsan/raman/types/accountTxn.type';
export * from '@rumsan/raman/types/category.type';
export * from '@rumsan/raman/types/client.type';
export * from '@rumsan/raman/types/department.type';
export * from '@rumsan/raman/types/enums';
export * from '@rumsan/raman/types/expense.type';
export * from '@rumsan/raman/types/invoice.type';
export * from '@rumsan/raman/types/project.type';
export * from '@rumsan/raman/types/salary.type';
export * from '@rumsan/raman/types/salaryDraft.type';
export * from '@rumsan/raman/types/userDetails.type';

export type FileAttachment = {
  hash: string;
  filename: string;
  size: number;
  mimeType: string;
  url?: string | null;
  previewUrl?: string;
  cloudStorage?: string;
  cloudStorageId?: string;
};
