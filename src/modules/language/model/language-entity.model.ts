import z from 'zod'

// Language Entity Schema
export const LanguageSchema = z.object({
  id: z.string().max(10),
  name: z.string().max(500),
  createdById: z.number().int().nullable(),
  updatedById: z.number().int().nullable(),
  deletedById: z.number().int().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type LanguageEntityType = z.infer<typeof LanguageSchema>
