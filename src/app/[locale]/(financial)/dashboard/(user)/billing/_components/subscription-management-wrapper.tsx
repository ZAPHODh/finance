"use client";

import { SubscriptionManagement, type SubscriptionManagementProps } from "./subscription-management";
import { useScopedI18n } from "@/locales/client";
import { toast } from "sonner";
import { openBillingPortal } from "@/app/[locale]/(public)/pricing/actions";

interface SubscriptionManagementWrapperProps {
  currentPlan: SubscriptionManagementProps["currentPlan"];
  allPlans: SubscriptionManagementProps["updatePlan"]["plans"];
}

export function SubscriptionManagementWrapper({
  currentPlan,
  allPlans,
}: SubscriptionManagementWrapperProps) {
  const t = useScopedI18n("ui.userPages.billing");

  async function handleManageBilling() {
    const result = await openBillingPortal();

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.url) {
      window.location.href = result.url;
    }
  }

  return (
    <SubscriptionManagement
      currentPlan={currentPlan}
      cancelSubscription={{
        title: t('cancelTitle'),
        description: t('cancelDescription'),
        plan: currentPlan.plan,
        triggerButtonText: t('cancelSubscription'),
        warningTitle: t('whatYouWillLose'),
        warningText: [
          t('loseFeature1'),
          t('loseFeature2'),
          t('loseFeature3'),
          t('loseFeature4'),
          t('loseFeature5'),
        ].join(', '),
        keepButtonText: t('keepSubscription'),
        continueButtonText: t('continueCancellation'),
        finalTitle: t('cancelTitle'),
        finalSubtitle: t('cancelDescription'),
        finalWarningText: t('whatYouWillLose'),
        goBackButtonText: t('keepSubscription'),
        confirmButtonText: t('continueCancellation'),
        onCancel: async () => {
          await handleManageBilling();
        },
        onKeepSubscription: async () => {
          toast.success(t('keepSubscription'));
        },
      }}
      updatePlan={{
        currentPlan: currentPlan.plan,
        plans: allPlans,
        triggerText: t('updatePlan'),
        title: t('chooseYourPlan'),
        onPlanChange: async () => {
          await handleManageBilling();
        },
      }}
    />
  );
}
