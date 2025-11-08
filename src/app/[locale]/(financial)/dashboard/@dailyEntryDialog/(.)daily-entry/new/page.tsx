import { DailyEntryDialog } from "@/components/financial/daily-entry-dialog";
import { Suspense } from "react";

export default function DailyEntryDialogPage() {
  return (
    <Suspense fallback={null}>
      <DailyEntryDialog mode="create" />
    </Suspense>
  );
}
