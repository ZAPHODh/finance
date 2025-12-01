import { getCurrentSession } from "@/lib/server/auth/session";
import { prisma } from "@/lib/server/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const preferences = await prisma.userPreferences.findUnique({
      where: { userId: user.id },
      select: {
        theme: true,
        fontSize: true,
        fontFamily: true,
        lineSpacing: true,
        reducedMotion: true,
        highContrast: true,
        keyboardShortcuts: true,
      },
    });

    if (!preferences) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      theme: preferences.theme,
      fontSize: preferences.fontSize,
      fontFamily: preferences.fontFamily,
      lineSpacing: preferences.lineSpacing,
      reducedMotion: preferences.reducedMotion,
      highContrast: preferences.highContrast,
      keyboardShortcuts: preferences.keyboardShortcuts,
    });
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
