import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drive_v3, google } from 'googleapis';
import { Readable } from 'stream';

@Injectable()
export class GDriveService {
  private drive: drive_v3.Drive;
  private parentFolderId: string | null = null;

  constructor(private config: ConfigService) {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: config.get('GOOGLE_CLIENT_EMAIL'),
        private_key: config.get('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive'],
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async ensureFolderExists(folderName: string): Promise<string | null> {
    if (this.parentFolderId) {
      return this.parentFolderId;
    }

    const response = await this.drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
      fields: 'files(id, name)',
      spaces: 'drive',
    });

    if (response.data.files && response.data.files.length > 0) {
      this.parentFolderId =
        response.data.files && response.data.files[0]
          ? response.data.files[0].id || null
          : null;
      return this.parentFolderId;
    }

    const folderMetadata = {
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder',
    };

    const folder = await this.drive.files.create({
      requestBody: folderMetadata,
      fields: 'id',
    });

    this.parentFolderId = folder.data.id || null;
    await this.drive.permissions.create({
      fileId: folder.data.id || '',
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return this.parentFolderId;
  }

  async delete(fileId: string): Promise<void> {
    await this.drive.files.delete({ fileId });
  }

  async listFiles(): Promise<drive_v3.Schema$File[]> {
    const response = await this.drive.files.list({
      q: `'${this.parentFolderId}' in parents`,
      fields: 'files(id, name, webViewLink)',
    });

    return response.data.files || [];
  }

  async upload(
    fileData: {
      hash: string;
      filename: string;
      data: Buffer;
      mimeType: string;
    },
    options: { getIfExists?: boolean } = {
      getIfExists: false,
    },
  ): Promise<{ url: string; gdriveInfo: drive_v3.Schema$File }> {
    const folderId = this.config.get('GOOGLE_DRIVE_FOLDER');

    if (process.env.NODE_ENV !== 'production') {
      options.getIfExists = true;
    }

    if (folderId && options.getIfExists) {
      // Check if a file with the same name already exists in the parent folder
      const existingFiles = await this.drive.files.list({
        q: `'${folderId}' in parents and name='${fileData.hash}'`,
        fields: 'files(id, name, webViewLink)',
        spaces: 'drive',
      });

      if (existingFiles.data.files && existingFiles.data.files.length > 0) {
        // File already exists, return its info
        const existingFile = existingFiles.data.files[0];
        return {
          url: existingFile.webViewLink || '',
          gdriveInfo: existingFile,
        };
      }
    }

    // Create a readable stream from the file data buffer
    const readableStream = new Readable();
    readableStream.push(fileData.data);
    readableStream.push(null);

    // Upload the file to Google Drive
    const response = await this.drive.files.create({
      requestBody: {
        name: fileData.hash,
        originalFilename: fileData.filename,
        description: fileData.filename,
        mimeType: fileData.mimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileData.mimeType,
        body: readableStream,
      },
      fields: 'id, webViewLink',
    });

    // Make the file publicly accessible
    await this.drive.permissions.create({
      fileId: response.data.id || '',
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    return { url: response.data.webViewLink || '', gdriveInfo: response.data };
  }
}
