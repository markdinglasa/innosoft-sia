import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { BadRequestException } from '../../../common/exceptions'
import { UploadFileDto } from './dto'

export interface ISysStorageService {
  uploadFile(file: Buffer, data: UploadFileDto): Promise<string>
  getFileUrl(key: string): Promise<string>
  deleteFile(key: string): Promise<void>
  getSignedUrl(key: string, expiresIn?: number): Promise<string>
  getSignedDownloadUrl(key: string, fileName?: string, expiresIn?: number): Promise<string>
}

export class SysStorageService implements ISysStorageService {
  private _client: S3Client
  private _bucketName: string
  private _logger = console // Simple logger using console for now

  constructor() {
    this._bucketName = process.env.AWS_S3_BUCKET || ''
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const region = process.env.AWS_REGION || 'us-east-1'

    if (!this._bucketName || !accessKeyId || !secretAccessKey) {
      const missing: string[] = []
      if (!this._bucketName) missing.push('AWS_S3_BUCKET')
      if (!accessKeyId) missing.push('AWS_ACCESS_KEY_ID')
      if (!secretAccessKey) missing.push('AWS_SECRET_ACCESS_KEY')
      
      throw new BadRequestException(
        `Cloud storage is not properly configured. Missing: ${missing.join(', ')}`
      )
    }

    this._client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  /**
   * Helper to extract S3 key from a full URL if provided.
   */
  private extractKeyFromUrl(urlOrKey: string): string {
    if (!urlOrKey) return ''
    if (!urlOrKey.startsWith('http')) return urlOrKey

    try {
      const url = new URL(urlOrKey)
      let pathname = url.pathname.startsWith('/') ? url.pathname.slice(1) : url.pathname
      
      // If the bucket name is in the path (path-style URL), remove it
      if (pathname.startsWith(`${this._bucketName}/`)) {
        pathname = pathname.replace(`${this._bucketName}/`, '')
      }
      
      return pathname
    } catch {
      return urlOrKey
    }
  }

  /**
   * Uploads a file to AWS S3.
   * Returns the file key.
   */
  async uploadFile(file: Buffer, data: UploadFileDto): Promise<string> {
    const { fileName, contentType, folder } = data
    const key = folder ? `${folder}/${fileName}` : fileName

    try {
      const command = new PutObjectCommand({
        Bucket: this._bucketName,
        Key: key,
        Body: file,
        ContentType: contentType,
      })

      await this._client.send(command)
      return key
    } catch (error: any) {
      this._logger.error('Failed to upload file to S3:', error)
      throw new BadRequestException(`File upload failed: ${error.message}`)
    }
  }

  /**
   * Get signed URL for temporary file access (expires in specified seconds)
   * @param key - S3 key
   * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
   * @returns Signed URL
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (!this._client) {
      throw new BadRequestException('Storage client not initialized. Check configuration.')
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this._bucketName,
        Key: this.extractKeyFromUrl(key),
      })

      const url = await getSignedUrl(this._client, command, { expiresIn })
      return url
    } catch (error: any) {
      this._logger.error(`Failed to generate signed URL for ${key}: ${error.message}`)
      throw new BadRequestException(`Failed to generate signed URL: ${error.message}`)
    }
  }

  /**
   * Get signed URL configured for file download (Content-Disposition: attachment)
   * @param key - S3 key or full URL
   * @param fileName - Optional custom filename for the downloaded file
   * @param expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
   * @returns Signed URL that triggers browser download
   */
  async getSignedDownloadUrl(
    key: string,
    fileName?: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    if (!this._client) {
      throw new BadRequestException('Storage client not initialized. Check configuration.')
    }

    try {
      const extractedKey = this.extractKeyFromUrl(key)
      // Use provided fileName or extract from key
      const downloadFileName = fileName || extractedKey.split('/').pop() || 'download'

      const command = new GetObjectCommand({
        Bucket: this._bucketName,
        Key: extractedKey,
        ResponseContentDisposition: `attachment; filename="${downloadFileName}"`,
      })

      const url = await getSignedUrl(this._client, command, { expiresIn })
      return url
    } catch (error: any) {
      this._logger.error(`Failed to generate signed download URL for ${key}: ${error.message}`)
      throw new BadRequestException(`Failed to generate signed download URL: ${error.message}`)
    }
  }

  /**
   * Gets a public URL for a file key.
   */
  async getFileUrl(key: string): Promise<string> {
    return `https://${this._bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${this.extractKeyFromUrl(key)}`
  }

  /**
   * Deletes a file from AWS S3.
   */
  async deleteFile(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this._bucketName,
        Key: this.extractKeyFromUrl(key),
      })

      await this._client.send(command)
    } catch (error: any) {
      this._logger.error('Failed to delete file from S3:', error)
      throw new BadRequestException(`File deletion failed: ${error.message}`)
    }
  }
}
