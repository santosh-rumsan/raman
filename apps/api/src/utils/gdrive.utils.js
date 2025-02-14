"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GDriveService = void 0;
const common_1 = require("@nestjs/common");
const googleapis_1 = require("googleapis");
const stream_1 = require("stream");
let GDriveService = (() => {
    let _classDecorators = [(0, common_1.Injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var GDriveService = class {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            GDriveService = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        config;
        drive;
        parentFolderId = null;
        constructor(config) {
            this.config = config;
            const auth = new googleapis_1.google.auth.GoogleAuth({
                credentials: {
                    client_email: config.get('GOOGLE_CLIENT_EMAIL'),
                    private_key: config.get('GOOGLE_PRIVATE_KEY').replace(/\\n/g, '\n'),
                },
                scopes: ['https://www.googleapis.com/auth/drive'],
            });
            this.drive = googleapis_1.google.drive({ version: 'v3', auth });
        }
        async ensureFolderExists(folderName) {
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
        async delete(fileId) {
            await this.drive.files.delete({ fileId });
        }
        async listFiles() {
            const response = await this.drive.files.list({
                q: `'${this.parentFolderId}' in parents`,
                fields: 'files(id, name, webViewLink)',
            });
            return response.data.files || [];
        }
        async upload(fileData, options = {
            getIfExists: false,
        }) {
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
            const readableStream = new stream_1.Readable();
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
    };
    return GDriveService = _classThis;
})();
exports.GDriveService = GDriveService;
