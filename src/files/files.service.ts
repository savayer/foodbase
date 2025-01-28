import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const B2 = require('backblaze-b2');

@Injectable()
export class FilesService {
  private readonly b2 = new B2({
    applicationKeyId: this.configService.get('S3_KEY_ID'),
    applicationKey: this.configService.get('S3_KEY'),
  });

  constructor(private readonly configService: ConfigService) {}

  async uploadFile(file: Express.Multer.File) {
    await this.b2.authorize();
    const uploadUrlResponse = await this.b2.getUploadUrl({
      bucketId: this.configService.get('S3_BUCKET_ID'),
    });

    const data = await this.b2.uploadFile({
      uploadUrl: uploadUrlResponse.data.uploadUrl,
      uploadAuthToken: uploadUrlResponse.data.authorizationToken,
      fileName: file.originalname,
      data: file.buffer,
      mime: file.mimetype,
    });

    return data.data;
  }
}
