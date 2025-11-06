import {
  BadRequestException,
  Controller,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FilesInterceptor } from '@nestjs/platform-express'
import multer from 'multer'

import { EnvConfig } from 'src/shared/config'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { S3Service } from 'src/shared/services/S3.service'

import { MediaService } from './media.service'

const ALLOWED_IMAGE_TYPES = /^image\/(jpg|jpeg|png|gif|webp)$/

@Controller('media')
export class MediaController {
  private readonly prefixUrl: string

  constructor(
    private readonly mediaService: MediaService,
    private readonly configService: ConfigService<EnvConfig>,
    private readonly s3Service: S3Service,
  ) {
    this.prefixUrl = this.configService.get('PREFIX_STATIC_URL', { infer: true })!
  }

  @Post('images/upload')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, callback) => {
        if (!ALLOWED_IMAGE_TYPES.test(file.mimetype)) {
          callback(new BadRequestException('Invalid file type. Only image files are allowed.'), false)
        } else {
          callback(null, true)
        }
      },
    }),
  )
  async uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    files: Express.Multer.File[],
  ) {
    console.log(
      'FILES RECEIVED (IN MEMORY):',
      files.map((f) => ({ name: f.originalname, size: f.size })),
    )

    try {
      const dateFolder = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const uploadDir = `images/${dateFolder}`

      const uploadPromises = files.map((file) => {
        return this.s3Service.uploadFile(file, uploadDir)
      })

      const results = await Promise.all(uploadPromises)

      // 4. Trả về kết quả từ S3
      return {
        message: 'Files uploaded successfully to S3',
        files: results.map((res, index) => ({
          originalName: files[index].originalname,
          key: res.key, // Tên file trên S3
          url: res.url, // URL S3 công khai
          mimetype: files[index].mimetype,
        })),
      }
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`)
    }
  }

  @IsPublic()
  @Get('s3-test/list-buckets')
  async testS3Connection() {
    return this.s3Service.testListBuckets()
  }
}
