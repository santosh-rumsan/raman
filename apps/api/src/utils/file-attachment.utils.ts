import { FileAttachment } from '@rumsan/raman/types';
import { GDriveService } from './gdrive.utils';
import { createIpfsHash } from './ipfs.utils';

export const UploadFileToGdrive = async (
  file: Express.Multer.File,
  record: any,
  gdrive: GDriveService,
) => {
  const attachment: FileAttachment = {
    hash: await createIpfsHash(file.buffer),
    url: null,
    filename: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    cloudStorage: 'gdrive',
  };

  const { url, gdriveInfo } = await gdrive.upload({
    hash: attachment.hash,
    filename: attachment.filename,
    data: file.buffer,
    mimeType: file.mimetype,
  });

  attachment.url = url;

  attachment.cloudStorageId = gdriveInfo.id ?? undefined;

  record =
    typeof record === 'string' || record == null
      ? []
      : (record as [FileAttachment]);

  const updatedRecord = record.map((attachmentItem: FileAttachment) =>
    attachmentItem.hash === attachment.hash
      ? {
          ...attachmentItem,
          url: attachment.url,
          cloudStorageId: attachment.cloudStorageId,
        }
      : attachmentItem,
  );

  if (
    !record.some(
      (attachmentItem: FileAttachment) =>
        attachmentItem.hash === attachment.hash,
    )
  ) {
    updatedRecord.push(attachment);
  }

  return updatedRecord;
};
