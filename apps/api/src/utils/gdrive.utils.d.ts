import { ConfigService } from '@nestjs/config';
import { drive_v3 } from 'googleapis';
export declare class GDriveService {
    private config;
    private drive;
    private parentFolderId;
    constructor(config: ConfigService);
    ensureFolderExists(folderName: string): Promise<string | null>;
    delete(fileId: string): Promise<void>;
    listFiles(): Promise<drive_v3.Schema$File[]>;
    upload(fileData: {
        hash: string;
        filename: string;
        data: Buffer;
        mimeType: string;
    }, options?: {
        getIfExists?: boolean;
    }): Promise<{
        url: string;
        gdriveInfo: drive_v3.Schema$File;
    }>;
}
//# sourceMappingURL=gdrive.utils.d.ts.map