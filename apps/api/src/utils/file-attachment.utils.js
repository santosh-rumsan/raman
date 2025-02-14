"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadFileToGdrive = void 0;
const ipfs_utils_1 = require("./ipfs.utils");
const UploadFileToGdrive = async (file, record, gdrive) => {
    const attachment = {
        hash: await (0, ipfs_utils_1.createIpfsHash)(file.buffer),
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
            : record;
    const updatedRecord = record.map((attachmentItem) => attachmentItem.hash === attachment.hash
        ? {
            ...attachmentItem,
            url: attachment.url,
            cloudStorageId: attachment.cloudStorageId,
        }
        : attachmentItem);
    if (!record.some((attachmentItem) => attachmentItem.hash === attachment.hash)) {
        updatedRecord.push(attachment);
    }
    return updatedRecord;
};
exports.UploadFileToGdrive = UploadFileToGdrive;
