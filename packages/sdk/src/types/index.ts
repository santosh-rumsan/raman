// export * from './account.type';
// export * from './accountTransaction.type';
// export * from './category.type';
// export * from './client.type';
// export * from './department.type';
// export * from './enums';
// export * from './expense.type';
// export * from './invoice.type';
// export * from './project.type';
// export * from './salary.type';
// export * from './salaryDraft.type';
// export * from './userDetails.type';

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
