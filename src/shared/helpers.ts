import { randomInt } from 'crypto'

import { Prisma } from '@prisma/client'

// Type Predicates for Prisma errors
export function isUniqueConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export function isRecordNotFoundError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

export function isValidationError(error: any): error is { property: string; constraints: any }[] {
  return Array.isArray(error) && error.every((e) => 'property' in e && 'constraints' in e)
}

export function isString(value: any): value is string {
  return typeof value === 'string' || value instanceof String
}

export function isEmail(value: any): value is string {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return isString(value) && emailRegex.test(value)
}

export function isNonEmptyString(value: any): value is string {
  return isString(value) && value.trim().length > 0
}

export const generateRandomCode = (): string => {
  return randomInt(100000, 1000000).toString()
}
