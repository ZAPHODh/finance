'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useScopedI18n } from '@/locales/client';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { completeOnboarding, type OnboardingData } from '@/app/[locale]/(user)/onboarding/actions';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import { TagInput } from '@/components/ui/tag-input';
import { VehicleCard } from './vehicle-card';
import { AddVehicleCard } from './add-vehicle-card';
import { DriverCard } from './driver-card';
import { AddDriverCard } from './add-driver-card';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';
import { onboardingSchema, type OnboardingFormData } from '@/lib/schemas/onboarding';
import { MultiStepFormProvider } from '@/hooks/use-multi-step-viewer';
import {
  FormHeader,
  FormFooter,
  StepFields,
  PreviousButton,
  NextButton,
  SubmitButton,
  MultiStepFormContent,
} from '@/components/multi-step-viewer';

interface OnboardingWizardProps {
  locale: string;
}

const DEFAULT_VALUES: OnboardingFormData = {
  platforms: [],
  drivers: [],
  vehicles: [],
  expenseTypes: [],
  paymentMethods: [],
};

export function OnboardingWizard({ locale }: OnboardingWizardProps) {
  const router = useRouter();
  const t = useScopedI18n('ui.onboarding');
  const tCommon = useScopedI18n('common');
  const [isPending, startTransition] = useTransition();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema as any),
    defaultValues: DEFAULT_VALUES,
  });

  const handleSubmit = form.handleSubmit(async (value) => {
    startTransition(async () => {
      try {
        const data: OnboardingData = {
          platforms: value.platforms.map((name) => ({ name })),
          drivers: value.drivers,
          vehicles: value.vehicles,
          expenseTypes: value.expenseTypes.map((name) => ({ name })),
          paymentMethods: value.paymentMethods.map((name) => ({ name })),
          preferences: {
            language: locale,
            currency: locale === 'pt' ? 'brl' : 'usd',
            timezone: locale === 'pt' ? 'America/Sao_Paulo' : 'America/New_York',
          },
        };

        const result = await completeOnboarding(data);
        toast.success(t('success'));

        if (result.redirectUrl.startsWith('http')) {
          window.location.href = result.redirectUrl;
        } else {
          router.push(result.redirectUrl);
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : t('completing'));
      }
    });
  });

  const stepsFields = [
    {
      fields: [],
      component: (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">{t('welcome.title')}</h2>
            <p className="text-muted-foreground">{t('welcome.description')}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('welcome.features.track')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('welcome.features.analyze')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('welcome.features.optimize')}</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">{t('welcome.features.reports')}</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      fields: ['platforms'],
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{t('platforms.title')}</h2>
            <p className="text-muted-foreground">{t('platforms.description')}</p>
          </div>
          <Controller
            name="platforms"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t('platforms.placeholder')}</FieldLabel>
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('platforms.placeholder')}
                  suggestions={[t('platforms.suggestions.0'),
                  t('platforms.suggestions.1'),
                  t('platforms.suggestions.2'),
                  t('platforms.suggestions.3'),
                  t('platforms.suggestions.4'),
                  ]}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </Field>
            )}
          />
        </div>
      ),
    },
    {
      fields: ['drivers'],
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{t('drivers.title')}</h2>
            <p className="text-muted-foreground">{t('drivers.description')}</p>
          </div>
          <Controller
            name="drivers"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldGroup>
                {field.value.length > 0 && (
                  <div className="space-y-3">
                    <FieldLabel className="text-sm text-muted-foreground">
                      {t('drivers.added')} ({field.value.length})
                    </FieldLabel>
                    {field.value.map((driver, index) => (
                      <DriverCard
                        key={index}
                        driver={driver}
                        onUpdate={(updatedDriver) => {
                          const newDrivers = [...field.value];
                          if (updatedDriver.isSelf) {
                            newDrivers.forEach((d, i) => {
                              if (i !== index) d.isSelf = false;
                            });
                          }
                          newDrivers[index] = updatedDriver;
                          field.onChange(newDrivers);
                        }}
                        onRemove={() => {
                          field.onChange(field.value.filter((_, i) => i !== index));
                        }}
                        labels={{
                          name: t('drivers.placeholder'),
                          isSelf: t('drivers.justMe'),
                          isSelfDescription: t('drivers.justMeDescription'),
                          save: tCommon('save'),
                          cancel: tCommon('cancel'),
                          edit: tCommon('edit'),
                          remove: tCommon('delete'),
                        }}
                      />
                    ))}
                  </div>
                )}
                <AddDriverCard
                  onAdd={(driver) => {
                    const updatedDrivers = driver.isSelf
                      ? field.value.map(d => ({ ...d, isSelf: false }))
                      : field.value;
                    field.onChange([...updatedDrivers, driver]);
                  }}
                  hasDrivers={field.value.length > 0}
                  labels={{
                    addDriver: t('drivers.addFirst'),
                    addAnother: t('drivers.addAnother'),
                    name: t('drivers.placeholder'),
                    isSelf: t('drivers.justMe'),
                    isSelfDescription: t('drivers.justMeDescription'),
                    save: tCommon('save'),
                    cancel: tCommon('cancel'),
                  }}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </FieldGroup>
            )}
          />
        </div>
      ),
    },
    {
      fields: ['vehicles'],
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{t('vehicles.title')}</h2>
            <p className="text-muted-foreground">{t('vehicles.description')}</p>
          </div>
          <Controller
            name="vehicles"
            control={form.control}
            render={({ field, fieldState }) => (
              <FieldGroup>
                {field.value.length > 0 && (
                  <div className="space-y-3">
                    <FieldLabel className="text-sm text-muted-foreground">
                      {t('vehicles.added')} ({field.value.length})
                    </FieldLabel>
                    {field.value.map((vehicle, index) => (
                      <VehicleCard
                        key={index}
                        vehicle={vehicle}
                        onUpdate={(updatedVehicle) => {
                          const newVehicles = [...field.value];
                          newVehicles[index] = updatedVehicle;
                          field.onChange(newVehicles);
                        }}
                        onRemove={() => {
                          field.onChange(field.value.filter((_, i) => i !== index));
                        }}
                        labels={{
                          name: t('vehicles.namePlaceholder'),
                          plate: t('vehicles.platePlaceholder'),
                          model: t('vehicles.modelPlaceholder'),
                          year: t('vehicles.yearPlaceholder'),
                          isPrimary: t('vehicles.isPrimary'),
                          isPrimaryDescription: t('vehicles.isPrimaryDescription'),
                          save: tCommon('save'),
                          cancel: tCommon('cancel'),
                          edit: tCommon('edit'),
                          remove: tCommon('delete'),
                        }}
                      />
                    ))}
                  </div>
                )}
                <AddVehicleCard
                  onAdd={(vehicle) => field.onChange([...field.value, vehicle])}
                  labels={{
                    addVehicle: t('vehicles.addAnother'),
                    name: t('vehicles.namePlaceholder'),
                    plate: t('vehicles.platePlaceholder'),
                    model: t('vehicles.modelPlaceholder'),
                    year: t('vehicles.yearPlaceholder'),
                    isPrimary: t('vehicles.isPrimary'),
                    isPrimaryDescription: t('vehicles.isPrimaryDescription'),
                    save: tCommon('save'),
                    cancel: tCommon('cancel'),
                  }}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </FieldGroup>
            )}
          />
        </div>
      ),
    },
    {
      fields: ['expenseTypes'],
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{t('expenseTypes.title')}</h2>
            <p className="text-muted-foreground">{t('expenseTypes.description')}</p>
          </div>
          <Controller
            name="expenseTypes"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t('expenseTypes.placeholder')}</FieldLabel>
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('expenseTypes.placeholder')}
                  suggestions={[t('expenseTypes.suggestions.0'),
                  t('expenseTypes.suggestions.1'),
                  t('expenseTypes.suggestions.2'),
                  t('expenseTypes.suggestions.3'),
                  t('expenseTypes.suggestions.4'),
                  ]}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </Field>
            )}
          />
        </div>
      ),
    },
    {
      fields: ['paymentMethods'],
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{t('paymentMethods.title')}</h2>
            <p className="text-muted-foreground">{t('paymentMethods.description')}</p>
          </div>
          <Controller
            name="paymentMethods"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>{t('paymentMethods.placeholder')}</FieldLabel>
                <TagInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={t('paymentMethods.placeholder')}
                  suggestions={[t('paymentMethods.suggestions.0'),
                  t('paymentMethods.suggestions.1'),
                  t('paymentMethods.suggestions.2'),
                  t('paymentMethods.suggestions.3'),
                  t('paymentMethods.suggestions.4'),
                  ]}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">{fieldState.error.message}</p>
                )}
              </Field>
            )}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="container max-w-3xl mx-auto py-6 px-4 md:py-10">
      <form onSubmit={handleSubmit}>
        <Card className='border-0 m-0 p-0'>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <MultiStepFormProvider
              stepsFields={stepsFields}
              onStepValidation={async (step) => {
                if (step.fields.length === 0) return true;
                const isValid = await form.trigger(step.fields as any);
                return isValid;
              }}
            >
              <MultiStepFormContent>
                <FormHeader />
                <StepFields />
                <FormFooter>
                  <PreviousButton>{t('navigation.previous')}</PreviousButton>
                  <NextButton>{t('navigation.next')}</NextButton>
                  <SubmitButton type="submit" disabled={isPending}>
                    {isPending ? t('completing') : t('navigation.finish')}
                  </SubmitButton>
                </FormFooter>
              </MultiStepFormContent>
            </MultiStepFormProvider>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
