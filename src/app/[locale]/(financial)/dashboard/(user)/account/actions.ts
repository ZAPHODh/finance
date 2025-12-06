"use server"

import { z } from "zod"
import { getCurrentSession } from "@/lib/server/auth/session"
import { prisma } from "@/lib/server/db"
import { createNameSchema } from "@/lib/validations/common"
import { createCPFOrCNPJSchema, createBrazilianPhoneSchema, createCEPSchema } from "@/lib/validations/brazilian"

const updateProfileSchema = z.object({
  name: createNameSchema({ errorMessage: "Name is required" }),
  email: z.string().email("Invalid email address"),
  cpfCnpj: createCPFOrCNPJSchema().optional(),
  phone: createBrazilianPhoneSchema().optional(),
  cep: createCEPSchema().optional(),
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
      cpfCnpj: validatedInput.cpfCnpj || null,
      phone: validatedInput.phone || null,
      cep: validatedInput.cep || null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      cpfCnpj: true,
      phone: true,
      cep: true,
    },
  })

  return { success: true, data: updatedUser }
}
