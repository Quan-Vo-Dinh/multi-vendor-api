import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { EnvConfig } from 'src/shared/config'

@Injectable()
export class S3Service {
  private s3: S3Client
  private readonly S3_REGION: string
  private readonly S3_ACCESS_KEY: string
  private readonly S3_SECRET_ACCESS_KEY: string
  private readonly S3_BUCKET_NAME: string

  constructor(private configService: ConfigService<EnvConfig>) {
    this.S3_REGION = this.configService.get('S3_REGION', { infer: true })!
    this.S3_ACCESS_KEY = this.configService.get('S3_ACCESS_KEY', { infer: true })!
    this.S3_SECRET_ACCESS_KEY = this.configService.get('S3_SECRET_ACCESS_KEY', { infer: true })!
    this.S3_BUCKET_NAME = this.configService.get('S3_BUCKET_NAME', { infer: true })!
    this.s3 = new S3Client({
      region: this.S3_REGION,
      credentials: {
        accessKeyId: this.S3_ACCESS_KEY,
        secretAccessKey: this.S3_SECRET_ACCESS_KEY,
      },
    })
  }

  async testListBuckets() {
    // 1. Create a "command" to list buckets
    const command = new ListBucketsCommand({}) // empty input

    try {
      // 2. Send the command using the S3 client
      const response = await this.s3.send(command)

      // 3. Handle the result
      console.log('✅ S3 connection successful!')
      console.log('Buckets list:', response.Buckets)
      return response.Buckets
    } catch (error) {
      console.error('❌ ERROR connecting to S3 or listing buckets:', error)
      // Inspect this error carefully — usually caused by wrong ACCESS_KEY, SECRET_KEY, or REGION
      throw new Error(`S3 connection error: ${error?.message ?? String(error)}`)
    }
  }

  // ... (Other methods like uploadFile, deleteFile will be implemented later)
}
