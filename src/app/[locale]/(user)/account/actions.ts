"use server"

import { authActionClient } from "@/lib/client/safe-action"
import { prisma } from "@/lib/server/db"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const updateProfile = authActionClient
  .metadata({ actionName: "updateProfile" })
  .schema(updateProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    await prisma.user.update({
      where: { id: ctx.userId },
      data: { name: parsedInput.name },
    })

    revalidatePath("/account")
    return { success: true, message: "Profile updated successfully" }
  })

export const changePassword = authActionClient
  .metadata({ actionName: "changePassword" })
  .schema(changePasswordSchema)
  .action(async () => {
    // TODO: Implement password verification and hashing
    // This would require checking the current password and hashing the new one

    // TODO: Verify current password with bcrypt
    // const isValid = await bcrypt.compare(parsedInput.currentPassword, ctx.user.password)
    // if (!isValid) throw new Error("Current password is incorrect")

    // TODO: Hash new password with bcrypt
    // const hashedPassword = await bcrypt.hash(parsedInput.newPassword, 10)

    // TODO: Update user password in database
    // await prisma.user.update({
    //   where: { id: ctx.user.id },
    //   data: { password: hashedPassword },
    // })

    revalidatePath("/account")
    return { success: true, message: "Password changed successfully" }
  })
