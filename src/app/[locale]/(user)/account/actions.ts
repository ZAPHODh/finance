"use server"

import { authActionClient } from "@/lib/client/safe-action"
import { z } from "zod"
import { prisma } from "@/lib/server/db"

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
})

export const updateProfileAction = authActionClient
  .metadata({ actionName: "updateProfile" })
  .schema(updateProfileSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { name } = parsedInput
    const { user } = ctx

    await prisma.user.update({
      where: { id: user.id },
      data: { name },
    })

    return {
      success: true,
      message: "Profile updated successfully",
    }
  })
