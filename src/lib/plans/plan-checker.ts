import { prisma } from "@/lib/server/db";
import { getCurrentSession } from "@/lib/server/auth/session";
import { getUserSubscriptionPlan } from "@/lib/server/payment";

export async function checkIfDriverLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) return true;

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  if (subscriptionPlan.isPro) return false;

  const count = await prisma.driver.count({
    where: { userId: user.id },
  });

  const limit = subscriptionPlan.name === "Simple" ? 3 : 1;
  return count >= limit;
}

export async function checkIfVehicleLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) return true;

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  if (subscriptionPlan.isPro) return false;

  const count = await prisma.vehicle.count({
    where: { userId: user.id },
  });

  const limit = subscriptionPlan.name === "Simple" ? 3 : 1;
  return count >= limit;
}

export async function checkIfExpenseTypeLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) return true;

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  if (subscriptionPlan.isPro || subscriptionPlan.name === "Simple") return false;

  const count = await prisma.expenseType.count({
    where: { userId: user.id },
  });

  return count >= 5;
}

export async function checkIfPaymentMethodLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) return true;

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  if (subscriptionPlan.isPro || subscriptionPlan.name === "Simple") return false;

  const count = await prisma.paymentMethod.count({
    where: { userId: user.id },
  });

  return count >= 3;
}

export async function checkIfPlatformLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) return true;

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  if (subscriptionPlan.isPro || subscriptionPlan.name === "Simple") return false;

  const count = await prisma.platform.count({
    where: { userId: user.id },
  });

  return count >= 2;
}

export async function checkIfGoalLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) return true;

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  if (subscriptionPlan.isPro) return false;

  const count = await prisma.goal.count({
    where: { userId: user.id, isActive: true },
  });

  const limit = subscriptionPlan.name === "Simple" ? 5 : 1;
  return count >= limit;
}

export async function checkIfBudgetLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) return true;

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  if (subscriptionPlan.isPro) return false;

  if (subscriptionPlan.name === "Free") return true;

  const count = await prisma.budget.count({
    where: { userId: user.id, isActive: true },
  });

  return count >= 10;
}

export async function checkIfExportLimitReached() {
  const { user } = await getCurrentSession();
  if (!user) return true;

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);

  if (subscriptionPlan.name === "Free") return true;

  if (subscriptionPlan.isPro) return false;

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      monthlyExportCount: true,
      exportCountResetAt: true,
    },
  });

  if (!userData) return true;

  const now = new Date();
  const resetDate = userData.exportCountResetAt;

  let currentCount = userData.monthlyExportCount;

  if (!resetDate || resetDate < now) {
    currentCount = 0;
  }

  return currentCount >= 10;
}

export async function incrementExportCount() {
  const { user } = await getCurrentSession();
  if (!user) return;

  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: { exportCountResetAt: true, monthlyExportCount: true },
  });

  if (!userData) return;

  const resetDate = userData.exportCountResetAt;

  if (!resetDate || resetDate < now) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        monthlyExportCount: 1,
        exportCountResetAt: nextMonth,
      },
    });
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        monthlyExportCount: { increment: 1 },
      },
    });
  }
}
