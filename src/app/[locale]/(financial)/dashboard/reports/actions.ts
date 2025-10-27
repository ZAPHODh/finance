'use server';

import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cacheWithTag, CacheTags } from "@/lib/server/cache";
import type { ReportType } from "@prisma/client";

export interface ReportFormData {
  name: string;
  type: ReportType;
  format: string;
  startDate: Date;
  endDate: Date;
}

export async function generateReport(data: ReportFormData) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  // TODO: Implement actual report generation logic
  // For now, we'll just create a placeholder record
  await prisma.report.create({
    data: {
      name: data.name,
      type: data.type,
      format: data.format,
      startDate: data.startDate,
      endDate: data.endDate,
      userId: user.id,
      fileUrl: null, // This would be populated after actual generation
      metadata: {
        generatedAt: new Date().toISOString(),
      },
    },
  });

  revalidateTag(CacheTags.REPORTS);
  revalidatePath("/dashboard/reports");
}

export async function deleteReport(id: string) {
  const { user } = await getCurrentSession();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const report = await prisma.report.findUnique({
    where: { id },
  });

  if (!report || report.userId !== user.id) {
    throw new Error("Report not found or unauthorized");
  }

  // TODO: Delete file from storage if fileUrl exists

  await prisma.report.delete({
    where: { id },
  });

  revalidateTag(CacheTags.REPORTS);
  revalidatePath("/dashboard/reports");
}

async function getReportsDataUncached(userId: string) {
  const reports = await prisma.report.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return { reports };
}

const getCachedReportsData = cacheWithTag(
  getReportsDataUncached,
  ['reports-data'],
  [CacheTags.REPORTS],
  300
);

export async function getReportsData() {
  const { user } = await getCurrentSession();
  if (!user) redirect("/login");

  return getCachedReportsData(user.id);
}
