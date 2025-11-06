import { ListBucketsCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { v4 as uuid } from 'uuid'

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
  async uploadFile(file: Express.Multer.File, folder: string) {
    const uniqueKey = `${folder}/${uuid()}-${file.originalname}`

    // 2. Tạo đối tượng Upload
    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.S3_BUCKET_NAME,
        Key: uniqueKey,
        Body: file.buffer, // <--- DÙNG file.buffer từ RAM
        ContentType: file.mimetype,
      },
    })

    // 3. Thực thi
    try {
      console.log(`Uploading file: ${uniqueKey}...`)
      const response = await upload.done()

      return {
        key: uniqueKey,
        url: response.Location, // <--- ĐÂY LÀ URL S3
        etag: response.ETag,
      }
    } catch (error) {
      console.error(`❌ ERROR uploading file ${uniqueKey}:`, error)
      throw new Error(`S3 upload error: ${error?.message ?? String(error)}`)
    }
  }

  /**
   * Create a Presigned URL for the client to upload a file directly to S3
   * @param originalName Original file name (e.g., 'my-avatar.jpg')
   * @param contentType File type (e.g., 'image/jpeg')
   * @param fileSize File size (in bytes)
   */
  async createPresignedUrl(originalName: string, contentType: string, fileSize: number) {
    const MAX_SIZE = 5 * 1024 * 1024 // 5MB
    if (fileSize > MAX_SIZE) {
      throw new BadRequestException('File is too large (max 5MB)')
    }
    if (!contentType.startsWith('image/')) {
      throw new BadRequestException('Invalid file type, must be an image')
    }

    const uniqueKey = `images/${uuid()}-${originalName}` // example: 'images/uuid-my-avatar.jpg'

    // This command describes the exact file you allow to upload
    const command = new PutObjectCommand({
      Bucket: this.S3_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType, // S3 will validate this
      ContentLength: fileSize, // S3 will validate this
    })

    // 4. Sign the URL
    // Create a temporary link that is only valid for 5 minutes (300 seconds)
    try {
      const presignedUrl = await getSignedUrl(this.s3, command, {
        expiresIn: 300,
      })

      // 5. Calculate the public URL (if you set ACL: 'public-read')
      const publicUrl = `https://${this.S3_BUCKET_NAME}.s3.${this.S3_REGION}.amazonaws.com/${uniqueKey}`

      return {
        presignedUrl, // Link for client (Next.js) upload (PUT)
        key: uniqueKey, // File name on S3 (to save in DB)
        publicUrl, // Public URL (to display <img src...>)
      }
    } catch (error) {
      console.error('❌ Error creating presigned URL:', error)
      throw new Error('Could not create presigned URL')
    }
  }
}

// ... (Other methods like uploadFile, deleteFile will be implemented later)
