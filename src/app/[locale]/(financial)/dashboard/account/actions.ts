"use server"

import { z } from "zod"
import { getCurrentSession } from "@/lib/server/auth/session"
import { prisma } from "@/lib/server/db"

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
})

export async function updateProfileAction(input: z.infer<typeof updateProfileSchema>) {
  const { user } = await getCurrentSession()
  if (!user) throw new Error("Unauthorized")

  const validatedInput = updateProfileSchema.parse(input)

  if (validatedInput.email !== user.email) {
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedInput.email },
    })

    if (existingUser && existingUser.id !== user.id) {
      throw new Error("Email already in use")
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: validatedInput.name,
      email: validatedInput.email,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  })

  return { success: true, data: updatedUser }
}
