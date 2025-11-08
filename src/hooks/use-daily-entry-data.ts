import { useQuery } from '@tanstack/react-query';
import { getDailyEntryFormData, getSmartDefaults } from '@/app/[locale]/(financial)/dashboard/daily-entry/actions';

export function useDailyEntryFormData() {
  return useQuery({
    queryKey: ['daily-entry-form-data'],
    queryFn: getDailyEntryFormData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

export function useSmartDefaults() {
  return useQuery({
    queryKey: ['smart-defaults'],
    queryFn: getSmartDefaults,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
