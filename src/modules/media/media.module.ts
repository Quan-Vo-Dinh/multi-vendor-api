import path from 'path'

import { Module } from '@nestjs/common'
import { MulterModule } from '@nestjs/platform-express'
import multer from 'multer'

import { generateRandomFileName } from 'src/shared/helpers'

import { MediaController } from './media.controller'
import { MediaService } from './media.service'

const UPLOAD_DIR = path.resolve('upload')

console.log('Upload directory:', UPLOAD_DIR)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const newFileName = generateRandomFileName(file.originalname)
    cb(null, newFileName)
  },
})

@Module({
  imports: [
    MulterModule.register({
      storage: storage,
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
