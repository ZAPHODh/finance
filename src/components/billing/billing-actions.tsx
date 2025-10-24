"use client";

import { useState } from "react";
import { toast } from "sonner";

export function useBillingActions() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpgrade(plan: "simple" | "pro") {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/stripe?plan=${plan}`);

      if (!response?.ok) {
        toast.error("Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error("Failed to start checkout. Please try again.");
      setIsLoading(false);
    }
  }

  async function handleManageBilling() {
    setIsLoading(true);

    try {
      const response = await fetch("/api/stripe");

      if (!response?.ok) {
        toast.error("Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error("Failed to open billing portal. Please try again.");
      setIsLoading(false);
    }
  }

  return {
    handleUpgrade,
    handleManageBilling,
    isPending: isLoading,
  };
}
