import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import slugify from 'slugify';

@Injectable()
export class FilesService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  processFileName(fileName: string) {
    return `${Date.now()}-${slugify(fileName, { lower: true })}`;
  }

  async uploadFile(file: Express.Multer.File, fileName?: string) {
    return await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: fileName || `${Date.now()}-${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      }) as any,
    );
  }

  async deleteImage(fileName: string) {
    return await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: fileName,
      }),
    );
  }
}
