import { FileAttachment } from '@rumsan/raman/types';

export type FileAttachmentWithBuffer = FileAttachment & { buffer?: Buffer };
