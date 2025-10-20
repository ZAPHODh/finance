"use server";

import { authActionClient } from "@/lib/client/safe-action";
import { deleteSessionTokenCookie } from "@/lib/server/auth/cookies";
import { invalidateSession } from "@/lib/server/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const logout = authActionClient
    .metadata({ actionName: "logout" })
    .action(async ({ ctx }) => {
        await invalidateSession(ctx.sessionId);
        deleteSessionTokenCookie();
        revalidatePath("/");
        redirect("/");
    });