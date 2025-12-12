import { PlatformDialog } from "../../../../platforms/_components/platform-dialog";
import { prisma } from "@/lib/server/db";
import { notFound } from "next/navigation";

interface EditPlatformModalProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlatformModal({ params }: EditPlatformModalProps) {
  const { id } = await params;

  const platform = await prisma.platform.findUnique({
    where: { id },
  });

  if (!platform) {
    notFound();
  }

  return <PlatformDialog mode="edit" platform={platform} />;
}
