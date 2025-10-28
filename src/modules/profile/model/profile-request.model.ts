import z from 'zod'

// Update Profile Request Schema
export const UpdateProfileBodySchema = z.object({
  name: z.string().min(1, 'Name is required').max(500, 'Name must be at most 500 characters').optional(),
  phoneNumber: z.string().max(50, 'Phone number must be at most 50 characters').optional(),
  avatar: z.string().max(1000, 'Avatar URL must be at most 1000 characters').optional(),
})

export type UpdateProfileBodyType = z.infer<typeof UpdateProfileBodySchema>

// Change Password Request Schema
export const ChangePasswordBodySchema = z.object({
  oldPassword: z.string().min(8, 'Old password must be at least 8 characters'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
})

export type ChangePasswordBodyType = z.infer<typeof ChangePasswordBodySchema>
