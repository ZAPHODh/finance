"use server"

import { authActionClient } from "@/lib/client/safe-action"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const addPaymentMethodSchema = z.object({
  cardNumber: z.string().min(13).max(19),
  cardholderName: z.string().min(1),
  expiryMonth: z.string().min(2).max(2),
  expiryYear: z.string().min(4).max(4),
  cvv: z.string().min(3).max(4),
})

const removePaymentMethodSchema = z.object({
  paymentMethodId: z.string(),
})

export const upgradeToPro = authActionClient
  .metadata({ actionName: "upgradeToPro" })
  .action(async ({ ctx }) => {

    revalidatePath("/billing")
    return { success: true, message: "Upgrade initiated" }
  })

export const addPaymentMethod = authActionClient
  .metadata({ actionName: "addPaymentMethod" })
  .schema(addPaymentMethodSchema)
  .action(async ({ parsedInput, ctx }) => {
    // TODO: Implement payment method storage with Stripe
    // Never store raw card details - use Stripe tokens/payment methods

    revalidatePath("/billing")
    return { success: true, message: "Payment method added successfully" }
  })

export const removePaymentMethod = authActionClient
  .metadata({ actionName: "removePaymentMethod" })
  .schema(removePaymentMethodSchema)
  .action(async ({ parsedInput, ctx }) => {
    // TODO: Implement payment method removal with Stripe

    revalidatePath("/billing")
    return { success: true, message: "Payment method removed" }
  })

export const cancelSubscription = authActionClient
  .metadata({ actionName: "cancelSubscription" })
  .action(async ({ ctx }) => {
    // TODO: Implement subscription cancellation with Stripe

    revalidatePath("/billing")
    return { success: true, message: "Subscription cancelled" }
  })
