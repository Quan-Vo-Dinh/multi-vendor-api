import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common'
import { Catch, HttpException } from '@nestjs/common'
import type { Response } from 'express'
import { I18nContext } from 'nestjs-i18n'

interface ErrorObject {
  message?: string
  [key: string]: unknown
}

@Catch(HttpException)
export class I18nExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const status = exception.getStatus()
    const i18n = I18nContext.current(host)

    const exceptionResponse = exception.getResponse()

    // Debug logging
    console.log('🔍 I18nExceptionFilter Debug:')
    console.log('  - i18n context:', i18n ? 'EXISTS' : 'NULL')
    console.log('  - current lang:', i18n?.lang)
    console.log('  - exception response:', JSON.stringify(exceptionResponse))

    // Helper function to translate error messages
    const translateMessage = (message: string): string => {
      if (message && message.startsWith('errors.')) {
        const key = message.replace('errors.', '')
        console.log(`  - Translating key: errors.${key}`)
        const translated = i18n ? i18n.t(`errors.${key}`) : message
        console.log(`  - Translated to: ${translated}`)
        return translated
      }
      return message
    }

    // Helper function to translate error object
    const translateErrorObject = (error: unknown): unknown => {
      if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorObj = error as ErrorObject
        if (errorObj.message && typeof errorObj.message === 'string') {
          return {
            ...errorObj,
            message: translateMessage(errorObj.message),
          }
        }
      }
      return error
    }

    // Handle NestJS standard format: { statusCode, message, error }
    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const errorObj = exceptionResponse as ErrorObject

      // Case 1: message is an array of error objects (our custom format)
      if (Array.isArray(errorObj.message)) {
        const translatedMessages = errorObj.message.map(translateErrorObject)
        return response.status(status).json({
          ...errorObj,
          message: translatedMessages,
        })
      }

      // Case 2: message is a string starting with 'errors.'
      if (typeof errorObj.message === 'string' && errorObj.message.startsWith('errors.')) {
        return response.status(status).json({
          ...errorObj,
          message: translateMessage(errorObj.message),
        })
      }

      // Case 3: no translation needed
      return response.status(status).json(errorObj)
    }

    // Handle direct array response (legacy support)
    if (Array.isArray(exceptionResponse)) {
      const translatedErrors = exceptionResponse.map(translateErrorObject)
      return response.status(status).json(translatedErrors)
    }

    // Fallback
    return response.status(status).json(exceptionResponse)
  }
}
