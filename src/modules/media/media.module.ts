// media.module.ts
import { Module } from '@nestjs/common'

import { S3Service } from 'src/shared/services/S3.service'

import { MediaController } from './media.controller'
import { MediaService } from './media.service'
// S3Service đã được import ở AppModule (global) hoặc import ở đây
// import { S3Service } from 'src/shared/services/S3.service'

@Module({
  imports: [
    // BỎ HẾT MULTER CONFIG Ở ĐÂY
  ],
  controllers: [MediaController],
  providers: [
    MediaService,
    S3Service, // Bỏ ở đây nếu S3Service đã là global
  ],
})
export class MediaModule {
  // Mày cũng không cần check 'existsSync' nữa vì mình đéo xài UPLOAD_DIR
  constructor() {}
}
