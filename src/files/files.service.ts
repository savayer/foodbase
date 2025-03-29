import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import slugify from 'slugify';
import * as sharp from 'sharp';

@Injectable()
export class FilesService {
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_S3_REGION'),
  });

  constructor(private readonly configService: ConfigService) {}

  processFileName(fileName: string) {
    return `${Date.now()}-${slugify(fileName, { lower: true })}`;
  }

  async optimizeImage(
    buffer: Buffer,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'jpeg' | 'png' | 'webp';
    } = {},
  ): Promise<{ buffer: Buffer; contentType: string }> {
    const {
      width = 1200,
      height = 1200,
      quality = 80,
      format = 'jpeg',
    } = options;

    let optimizedImage = sharp(buffer).rotate().resize({
      width,
      height,
      fit: 'inside',
      withoutEnlargement: true,
    });

    switch (format) {
      case 'jpeg':
        optimizedImage = optimizedImage.jpeg({ quality });
        return {
          buffer: await optimizedImage.toBuffer(),
          contentType: 'image/jpeg',
        };
      case 'png':
        optimizedImage = optimizedImage.png({ quality });
        return {
          buffer: await optimizedImage.toBuffer(),
          contentType: 'image/png',
        };
      case 'webp':
        optimizedImage = optimizedImage.webp({ quality });
        return {
          buffer: await optimizedImage.toBuffer(),
          contentType: 'image/webp',
        };
      default:
        optimizedImage = optimizedImage.jpeg({ quality });
        return {
          buffer: await optimizedImage.toBuffer(),
          contentType: 'image/jpeg',
        };
    }
  }

  async uploadFile(file: Express.Multer.File, fileName?: string) {
    // Оптимизируем изображение перед загрузкой
    const optimizedImage = await this.optimizeImage(file.buffer, {
      width: 1200,
      height: 1200,
      quality: 80,
      format: 'jpeg',
    });

    return await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
        Key: fileName || `${Date.now()}-${file.originalname}`,
        Body: optimizedImage.buffer,
        ContentType: optimizedImage.contentType,
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
