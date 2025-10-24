"use client";

import { SubscriptionManagement, type SubscriptionManagementProps } from "./subscription-management";
import { useBillingActions } from "./billing-actions";
import { toast } from "sonner";

interface SubscriptionManagementWrapperProps {
  currentPlan: SubscriptionManagementProps["currentPlan"];
  allPlans: SubscriptionManagementProps["updatePlan"]["plans"];
}

export function SubscriptionManagementWrapper({
  currentPlan,
  allPlans,
}: SubscriptionManagementWrapperProps) {
  const { handleManageBilling, isPending } = useBillingActions();

  return (
    <SubscriptionManagement
      currentPlan={currentPlan}
      cancelSubscription={{
        title: "Cancel Subscription",
        description: "We're sorry to see you go. Are you sure you want to cancel your subscription?",
        plan: currentPlan.plan,
        triggerButtonText: "Cancel Subscription",
        warningTitle: "What you'll lose:",
        warningText: "Access to all premium features, unlimited entries, advanced analytics, and priority support.",
        keepButtonText: "Keep Subscription",
        continueButtonText: "Continue to Billing Portal",
        finalTitle: "Manage via Stripe",
        finalSubtitle: "You'll be redirected to Stripe's billing portal to manage your subscription.",
        finalWarningText: "You can cancel or update your subscription directly through Stripe.",
        goBackButtonText: "Go Back",
        confirmButtonText: "Open Billing Portal",
        onCancel: async () => {
          await handleManageBilling();
        },
        onKeepSubscription: async () => {
          toast.success("Great! Your subscription remains active.");
        },
      }}
      updatePlan={{
        currentPlan: currentPlan.plan,
        plans: allPlans,
        triggerText: "Update Plan",
        title: "Choose Your Plan",
        onPlanChange: async () => {
          await handleManageBilling();
        },
      }}
    />
  );
}
