'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useScopedI18n } from '@/locales/client';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { completeOnboarding, type OnboardingData } from '@/app/[locale]/(user)/onboarding/actions';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';
import { TagInput } from '@/components/ui/tag-input';
import { VehicleCard, Vehicle } from './vehicle-card';
import { AddVehicleCard } from './add-vehicle-card';
import { DriverCard, Driver } from './driver-card';
import { AddDriverCard } from './add-driver-card';
import { Field, FieldLabel, FieldGroup } from '@/components/ui/field';

interface OnboardingWizardProps {
  locale: string;
}

export function OnboardingWizard({ locale }: OnboardingWizardProps) {
  const router = useRouter();
  const t = useScopedI18n('ui.onboarding');
  const tCommon = useScopedI18n('common');
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm({
    defaultValues: {
      platforms: [] as string[],
      drivers: [] as Driver[],
      vehicles: [] as Vehicle[],
      expenseTypes: [] as string[],
      paymentMethods: [] as string[],
    },
    onSubmit: async ({ value }) => {
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

          await completeOnboarding(data);
          toast.success(t('success'));
          router.push('/dashboard');
        } catch (error) {
          toast.error(error instanceof Error ? error.message : t('completing'));
        }
      });
    },
  });

  const steps = [
    { key: 'welcome', title: t('steps.welcome') },
    { key: 'platforms', title: t('steps.platforms') },
    { key: 'drivers', title: t('steps.drivers') },
    { key: 'vehicles', title: t('steps.vehicles') },
    { key: 'expenseTypes', title: t('steps.expenseTypes') },
    { key: 'paymentMethods', title: t('steps.paymentMethods') },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    const platforms = form.getFieldValue('platforms');
    const drivers = form.getFieldValue('drivers');
    const vehicles = form.getFieldValue('vehicles');

    if (currentStep === 1 && platforms.length === 0) {
      toast.error(t('platforms.atLeastOne'));
      return;
    }
    if (currentStep === 2 && drivers.length === 0) {
      toast.error(t('drivers.atLeastOne'));
      return;
    }
    if (currentStep === 3 && vehicles.length === 0) {
      toast.error(t('vehicles.atLeastOne'));
      return;
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
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
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{t('platforms.title')}</h2>
              <p className="text-muted-foreground">{t('platforms.description')}</p>
            </div>
            <form.Field name="platforms">
              {(field) => (
                <Field>
                  <FieldLabel>{t('platforms.placeholder')}</FieldLabel>
                  <TagInput
                    value={field.state.value}
                    onChange={field.handleChange}
                    placeholder={t('platforms.placeholder')}
                    suggestions={['Uber', '99', 'iFood', 'Rappi', 'Loggi']}
                  />
                </Field>
              )}
            </form.Field>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{t('drivers.title')}</h2>
              <p className="text-muted-foreground">{t('drivers.description')}</p>
            </div>
            <form.Field name="drivers">
              {(field) => (
                <FieldGroup>
                  {field.state.value.length > 0 && (
                    <div className="space-y-3">
                      <FieldLabel className="text-sm text-muted-foreground">
                        {t('drivers.added')} ({field.state.value.length})
                      </FieldLabel>
                      {field.state.value.map((driver, index) => (
                        <DriverCard
                          key={index}
                          driver={driver}
                          onUpdate={(updatedDriver) => {
                            const newDrivers = [...field.state.value];
                            // Ensure only one driver can have isSelf = true
                            if (updatedDriver.isSelf) {
                              newDrivers.forEach((d, i) => {
                                if (i !== index) d.isSelf = false;
                              });
                            }
                            newDrivers[index] = updatedDriver;
                            field.handleChange(newDrivers);
                          }}
                          onRemove={() => {
                            field.handleChange(field.state.value.filter((_, i) => i !== index));
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
                      // Ensure only one driver can have isSelf = true
                      const updatedDrivers = driver.isSelf
                        ? field.state.value.map(d => ({ ...d, isSelf: false }))
                        : field.state.value;
                      field.handleChange([...updatedDrivers, driver]);
                    }}
                    hasDrivers={field.state.value.length > 0}
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
                </FieldGroup>
              )}
            </form.Field>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{t('vehicles.title')}</h2>
              <p className="text-muted-foreground">{t('vehicles.description')}</p>
            </div>
            <form.Field name="vehicles">
              {(field) => (
                <FieldGroup>
                  {field.state.value.length > 0 && (
                    <div className="space-y-3">
                      <FieldLabel className="text-sm text-muted-foreground">
                        {t('vehicles.added')} ({field.state.value.length})
                      </FieldLabel>
                      {field.state.value.map((vehicle, index) => (
                        <VehicleCard
                          key={index}
                          vehicle={vehicle}
                          onUpdate={(updatedVehicle) => {
                            const newVehicles = [...field.state.value];
                            newVehicles[index] = updatedVehicle;
                            field.handleChange(newVehicles);
                          }}
                          onRemove={() => {
                            field.handleChange(field.state.value.filter((_, i) => i !== index));
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
                    onAdd={(vehicle) => field.handleChange([...field.state.value, vehicle])}
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
                </FieldGroup>
              )}
            </form.Field>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{t('expenseTypes.title')}</h2>
              <p className="text-muted-foreground">{t('expenseTypes.description')}</p>
            </div>
            <form.Field name="expenseTypes">
              {(field) => (
                <Field>
                  <FieldLabel>{t('expenseTypes.placeholder')}</FieldLabel>
                  <TagInput
                    value={field.state.value}
                    onChange={field.handleChange}
                    placeholder={t('expenseTypes.placeholder')}
                    suggestions={['Fuel', 'Maintenance', 'Insurance', 'Car Wash', 'Parking']}
                  />
                </Field>
              )}
            </form.Field>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{t('paymentMethods.title')}</h2>
              <p className="text-muted-foreground">{t('paymentMethods.description')}</p>
            </div>
            <form.Field name="paymentMethods">
              {(field) => (
                <Field>
                  <FieldLabel>{t('paymentMethods.placeholder')}</FieldLabel>
                  <TagInput
                    value={field.state.value}
                    onChange={field.handleChange}
                    placeholder={t('paymentMethods.placeholder')}
                    suggestions={['PIX', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer']}
                  />
                </Field>
              )}
            </form.Field>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-6 px-4 md:py-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('subtitle')}</CardDescription>
            <div className="space-y-2">
              <div className="block md:hidden text-sm text-center">
                <span className="font-semibold">
                  {steps[currentStep].title} ({currentStep + 1}/{steps.length})
                </span>
              </div>
              <div className="hidden md:flex justify-between text-sm">
                {steps.map((step, index) => (
                  <span
                    key={step.key}
                    className={index === currentStep ? 'font-semibold' : 'text-muted-foreground'}
                  >
                    {step.title}
                  </span>
                ))}
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepContent()}
            <div className="flex flex-col sm:flex-row justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="w-full sm:w-auto"
              >
                {t('navigation.previous')}
              </Button>
              {currentStep < steps.length - 1 ? (
                <Button type="button" onClick={handleNext} className="w-full sm:w-auto">
                  {t('navigation.next')}
                </Button>
              ) : (
                <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                  {isPending ? t('completing') : t('navigation.finish')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
