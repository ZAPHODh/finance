import { ArcticFetchError, OAuth2RequestError } from "arctic";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { sendWelcomeEmail } from "@/lib/server/mail";
import { setSessionTokenCookie } from "@/lib/server/auth/cookies";
import { facebook } from "@/lib/server/auth/facebook";
import { createSession, generateSessionToken } from "@/lib/server/auth/session";
import { prisma } from "@/lib/server/db";
import { getCheckoutCookiesServer, clearCheckoutCookiesServer, setPostOnboardingCookies } from "@/lib/checkout-cookies";

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const storedState = cookieStore.get("facebook_oauth_state")?.value ?? null;

  const checkoutCookies = await getCheckoutCookiesServer(cookieStore);

  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await facebook.validateAuthorizationCode(code);
    const facebookUserResponse = await fetch(
      "https://graph.facebook.com/me?fields=id,name,email,picture",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      }
    );
    const facebookUser: FacebookUser = await facebookUserResponse.json();

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          {
            facebookId: facebookUser.id,
          },
          {
            email: facebookUser.email,
          },
        ],
      },
    });

    if (existingUser) {
      const sessionTokenCookie = generateSessionToken();
      const session = await createSession(sessionTokenCookie, existingUser.id);
      await setSessionTokenCookie(sessionTokenCookie, session.expiresAt);

      let redirectPath = "/dashboard";

      if (!existingUser.hasCompletedOnboarding) {
        redirectPath = "/onboarding";
        if (checkoutCookies.plan && checkoutCookies.interval) {
          await setPostOnboardingCookies(cookieStore, checkoutCookies.plan, checkoutCookies.interval);
        }
      } else if (checkoutCookies.plan && (checkoutCookies.plan === 'simple' || checkoutCookies.plan === 'pro')) {
        const queryParams = new URLSearchParams({ plan: checkoutCookies.plan });
        if (checkoutCookies.interval) queryParams.append('interval', checkoutCookies.interval);
        redirectPath = `/dashboard/billing?${queryParams.toString()}`;
      }

      await clearCheckoutCookiesServer(cookieStore);
      revalidatePath(redirectPath, "layout");

      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectPath,
        },
      });
    }

    const newUser = await prisma.user.create({
      data: {
        facebookId: facebookUser.id,
        name: facebookUser.name,
        email: facebookUser.email,
        picture: facebookUser.picture?.data?.url,
        emailVerified: Boolean(facebookUser.email),
      },
    });

    if (facebookUser.email) {
      sendWelcomeEmail({ toMail: newUser.email!, userName: newUser.name! });
    }

    const sessionTokenCookie = generateSessionToken();
    const session = await createSession(sessionTokenCookie, newUser.id);
    await setSessionTokenCookie(sessionTokenCookie, session.expiresAt);

    if (checkoutCookies.plan && checkoutCookies.interval) {
      await setPostOnboardingCookies(cookieStore, checkoutCookies.plan, checkoutCookies.interval);
    }
    await clearCheckoutCookiesServer(cookieStore);

    revalidatePath("/onboarding", "layout");

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/onboarding",
      },
    });
  } catch (e) {
    console.log(JSON.stringify(e));
    if (e instanceof OAuth2RequestError) {
      return new Response(e.description, {
        status: 400,
      });
    }

    if (e instanceof ArcticFetchError) {
      return new Response(e.message, {
        status: 400,
      });
    }

    return new Response("Internal Server Error", {
      status: 500,
    });
  }
};

interface FacebookUser {
  id: string;
  name: string;
  email: string;
  picture?: {
    data?: {
      url: string;
    };
  };
}
