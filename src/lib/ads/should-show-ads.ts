import { getCurrentSession } from '@/lib/server/auth/session';
import { getUserSubscriptionPlan } from '../server/payment';

export async function shouldShowAds(): Promise<boolean> {
  const { user } = await getCurrentSession();
  if (!user) return false;

  const subscriptionPlan = await getUserSubscriptionPlan(user.id);
  return subscriptionPlan.name === 'FREE';
}
