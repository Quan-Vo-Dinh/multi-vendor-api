import path from 'path'

import {
  BadRequestException,
  Controller,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { FilesInterceptor } from '@nestjs/platform-express'
import type { Response } from 'express'

import { EnvConfig } from 'src/shared/config'
import { UPLOAD_DIR } from 'src/shared/constants/other.constant'
import { IsPublic } from 'src/shared/decorators/auth.decorator'

import { MediaService } from './media.service'

const ALLOWED_IMAGE_TYPES = /^image\/(jpg|jpeg|png|gif|webp)$/

@Controller('media')
export class MediaController {
  private readonly prefixUrl: string

  constructor(
    private readonly mediaService: MediaService,
    private readonly configService: ConfigService<EnvConfig>,
  ) {
    this.prefixUrl = this.configService.get('PREFIX_STATIC_URL', { infer: true })!
  }

  @Post('images/upload')
  @UseInterceptors(
    FilesInterceptor('files', 4, {
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
  uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
      }),
    )
    files: Express.Multer.File[],
  ) {
    console.log(
      'FILES RECEIVED:',
      files.map((f) => ({ name: f.originalname, mimetype: f.mimetype })),
    )
    return {
      message: 'Files uploaded successfully',
      files: files.map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        url: `${this.prefixUrl}${file.filename}`,
        size: file.size,
        mimetype: file.mimetype,
      })),
    }
  }

  @Get('static/:filename')
  @IsPublic()
  serveStaticFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(path.resolve(UPLOAD_DIR, filename), (error) => {
      if (error) {
        const notFound = new NotFoundException('File not found')
        res.status(notFound.getStatus()).send(notFound.getResponse())
      }
    })
  }
}
