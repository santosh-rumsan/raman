import { FileAttachment } from '@rumsan/raman/types';
import { GDriveService } from './gdrive.utils';
import { createIpfsHash } from './ipfs.utils';
import { FileAttachmentWithBuffer } from './types';

export const UploadFileToGdrive = async (
  file: FileAttachmentWithBuffer,
  gdrive: GDriveService,
) => {
  if (!file.buffer)
    return {
      file,
      cloudInfo: {
        storage: 'gdrive',
      },
    };

  const { url, gdriveInfo } = await gdrive.upload({
    hash: file.hash || (await createIpfsHash(file.buffer)),
    filename: file.filename,
    data: file.buffer,
    mimeType: file.mimeType,
  });

  file.url = url;
  const newFile: FileAttachment = {
    hash: file.hash,
    url,
    filename: file.filename,
    size: file.buffer.length,
    mimeType: file.mimeType,
  };

  return {
    file: newFile,
    cloudInfo: {
      storage: 'gdrive',
      id: gdriveInfo.id,
    },
  };
};
