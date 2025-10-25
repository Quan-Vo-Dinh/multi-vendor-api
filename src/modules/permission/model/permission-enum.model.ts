import z from 'zod'

// HTTPMethod Enum Schema
export const HTTPMethodSchema = z.enum(['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'])

export type HTTPMethodType = z.infer<typeof HTTPMethodSchema>
