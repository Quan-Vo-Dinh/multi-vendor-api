import z from 'zod'

import { HTTPMethodSchema } from './permission-enum.model'

// Permission Entity Schema
export const PermissionSchema = z.object({
  id: z.number().int(),
  name: z.string().max(500),
  description: z.string(),
  path: z.string().max(1000),
  method: HTTPMethodSchema,
  module: z.string().max(500),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type PermissionEntityType = z.infer<typeof PermissionSchema>
