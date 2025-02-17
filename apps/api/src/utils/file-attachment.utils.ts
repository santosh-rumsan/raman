import { FileAttachment } from '@rumsan/raman/types';
import { GDriveService } from './gdrive.utils';
import { createIpfsHash } from './ipfs.utils';

export const UploadFileToGdrive = async (
  file: Express.Multer.File,
  gdrive: GDriveService,
) => {
  const gFile: FileAttachment = {
    hash: await createIpfsHash(file.buffer),
    url: null,
    filename: file.originalname,
    size: file.size,
    mimeType: file.mimetype,
    cloudStorage: 'gdrive',
  };

  const { url, gdriveInfo } = await gdrive.upload({
    hash: gFile.hash,
    filename: gFile.filename,
    data: file.buffer,
    mimeType: file.mimetype,
  });
  gFile.url = url;
  gFile.cloudStorageId = gdriveInfo.id ?? undefined;

  return gFile;
};
