// File nay dùng để upload file từ client lên Cloudinary bằng cách sử dụng dữ liệu file dạng Buffer do multer cung cấp khi upload thông qua @FileInterceptor()

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export interface CloudinaryResponse {
  url: string;
  publicId: string;
}

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    // Cấu hình cloudinary
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadMultipleFile(
    files: Express.Multer.File[],
  ): Promise<CloudinaryResponse[]> {
    const uploadPromise = files.map((file) => this.uploadSingleFile(file));
    return Promise.all(uploadPromise); // Upload song song
  }

  async uploadSingleFile(
    file: Express.Multer.File,
  ): Promise<CloudinaryResponse> {
    // Hàm này dùng để upload file lên cloudinary và trả về một Promise chứa secure_url từ cloudinray
    // Phương thức dùng để upload file
    return new Promise((resolve, reject) => {
      if (!file || !(file instanceof Object) || !('buffer' in file)) {
        reject(new Error('File or file buffer is missing'));
        return;
      }
      const uploadStream = cloudinary.uploader.upload_stream(
        // Upload dữ liệu dạng buffer
        {
          folder: this.configService.get<string>('CLOUDINARY_UPLOAD_FOLDER'), // Cấu hình tên folder trên cloudinary
        },
        (error, result) => {
          if (error) {
            // Nếu có lỗi thì trả về reject
            reject(new Error(error.message || 'Cloudinary upload failed'));
          } else {
            // Nếu thành công thì trả về url
            if (result?.secure_url) {
              resolve({
                url: result?.secure_url,
                publicId: result.public_id,
              });
            } else {
              reject(new Error('Không lấy được secure_url từ cloudinary'));
            }
          }
        },
      );
      uploadStream.end(file?.buffer); // Upload file dạng Buffer lên cloudinary
    });
  }

  async deleteFiles(publicIds: string[]) {
    return Promise.all(
      publicIds.map(async (publicId) => await this.deleteFile(publicId)),
    );
  }

  async deleteFile(publicId: string) {
    return new Promise((resolve, reject) => {
      void cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          if (error instanceof Error) {
            return reject(new Error(error.message || 'Xóa hình ảnh thất bại'));
          }
        }
        resolve(result);
      });
    });
  }
}
