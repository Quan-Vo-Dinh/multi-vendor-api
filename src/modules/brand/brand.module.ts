import { Module } from '@nestjs/common'

import { SharedModule } from 'src/shared/shared.module'

import { BrandController } from './brand.controller'
import { BrandService } from './brand.service'
import { BrandTranslationRepository } from './repo/brand-translation.repo'
import { BrandRepository } from './repo/brand.repo'

@Module({
  imports: [SharedModule],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository, BrandTranslationRepository],
  exports: [BrandService, BrandRepository, BrandTranslationRepository],
})
export class BrandModule {}
