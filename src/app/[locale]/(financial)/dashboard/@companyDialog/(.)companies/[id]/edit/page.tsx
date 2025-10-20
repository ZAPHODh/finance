import { CompanyDialog } from "@/components/configuration/companies/company-dialog";
import { prisma } from "@/lib/server/db";
import { notFound } from "next/navigation";

interface EditCompanyModalProps {
  params: Promise<{ id: string }>;
}

export default async function EditCompanyModal({ params }: EditCompanyModalProps) {
  const { id } = await params;

  const company = await prisma.company.findUnique({
    where: { id },
  });

  if (!company) {
    notFound();
  }

  return <CompanyDialog mode="edit" company={company} />;
}
