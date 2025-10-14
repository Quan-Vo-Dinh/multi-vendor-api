import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import type { Cache } from 'cache-manager'
import { v4 as uuidv4 } from 'uuid'

export interface TempSecret {
  userId: number
  secret: string
  createdAt: Date
}

export interface TempSession {
  userId: number
  createdAt: Date
}

@Injectable()
export class Temp2FAService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Create temporary secret for 2FA setup
  async createTempSecret(userId: number, secretBase32: string): Promise<string> {
    const tempId = uuidv4()
    const tempSecret: TempSecret = {
      userId,
      secret: secretBase32, // TODO: encrypt secret before storing (if existing helper present)
      createdAt: new Date(),
    }

    const key = `2fa:setup:${tempId}`
    await this.cacheManager.set(key, tempSecret, 300000) // TTL 300s = 5 minutes
    return tempId
  }

  // Get temporary secret
  async getTempSecret(tempId: string): Promise<TempSecret | null> {
    const key = `2fa:setup:${tempId}`
    const result = await this.cacheManager.get<TempSecret>(key)
    return result || null
  }

  // Delete temporary secret
  async deleteTempSecret(tempId: string): Promise<void> {
    const key = `2fa:setup:${tempId}`
    await this.cacheManager.del(key)
  }

  // Create temporary session for 2FA login
  async createTempSession(userId: number): Promise<string> {
    const tempSessionId = uuidv4()
    const tempSession: TempSession = {
      userId,
      createdAt: new Date(),
    }

    const key = `2fa:login:${tempSessionId}`
    await this.cacheManager.set(key, tempSession, 300000) // TTL 300s = 5 minutes
    return tempSessionId
  }

  // Get temporary session
  async getTempSession(tempSessionId: string): Promise<TempSession | null> {
    const key = `2fa:login:${tempSessionId}`
    const result = await this.cacheManager.get<TempSession>(key)
    return result || null
  }

  // Delete temporary session
  async deleteTempSession(tempSessionId: string): Promise<void> {
    const key = `2fa:login:${tempSessionId}`
    await this.cacheManager.del(key)
  }
}
