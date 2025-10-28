import z from 'zod'

export const MessageResSchema = z.object({
  message: z.string(),
})

export type MessageResType = z.infer<typeof MessageResSchema>

// ==================== Pagination Metadata Schema ====================
// Reusable pagination metadata for list responses
export const PaginationMetaSchema = z.object({
  totalItems: z.number().int().min(0),
  currentPage: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  itemsPerPage: z.number().int().min(1),
})

export type PaginationMetaType = z.infer<typeof PaginationMetaSchema>

// ==================== Generic Response Wrappers ====================
// Factory function to create paginated response schema
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    data: z.array(dataSchema),
    meta: PaginationMetaSchema,
  })
}

// Factory function to create single data response schema
export const createDataResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return z.object({
    data: dataSchema,
  })
}
