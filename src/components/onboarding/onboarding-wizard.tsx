'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useScopedI18n } from '@/locales/client';
import { useForm } from '@tanstack/react-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Field, FieldLabel } from '@/components/ui/field';
import { Progress } from '@/components/ui/progress';
import { completeOnboarding, type OnboardingData } from '@/app/[locale]/(user)/onboarding/actions';
import { toast } from 'sonner';
import { CheckCircle2, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface OnboardingWizardProps {
  locale: string;
}

export function OnboardingWizard({ locale }: OnboardingWizardProps) {
  const router = useRouter();
  const t = useScopedI18n('shared.onboarding');
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm({
    defaultValues: {
      platforms: [] as Array<{ name: string; icon?: string }>,
      platformInput: '',
      drivers: [] as Array<{ name: string }>,
      driverInput: '',
      vehicles: [] as Array<{ name: string; plate?: string; model?: string; year?: number }>,
      vehicleInput: { name: '', plate: '', model: '', year: '' },
      expenseTypes: [] as Array<{ name: string; icon?: string }>,
      expenseTypeInput: '',
      paymentMethods: [] as Array<{ name: string; icon?: string }>,
      paymentMethodInput: '',
    },
    onSubmit: async ({ value }) => {
      startTransition(async () => {
        try {
          const data: OnboardingData = {
            platforms: value.platforms,
            drivers: value.drivers,
            vehicles: value.vehicles,
            expenseTypes: value.expenseTypes,
            paymentMethods: value.paymentMethods,
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

  const handleAddPlatform = (platformInput: string, platforms: Array<{ name: string; icon?: string }>) => {
    if (platformInput.trim()) {
      form.setFieldValue('platforms', [...platforms, { name: platformInput.trim() }]);
      form.setFieldValue('platformInput', '');
    }
  };

  const handleRemovePlatform = (index: number, platforms: Array<{ name: string; icon?: string }>) => {
    form.setFieldValue('platforms', platforms.filter((_, i) => i !== index));
  };

  const handleAddDriver = (driverInput: string, drivers: Array<{ name: string }>) => {
    if (driverInput.trim()) {
      form.setFieldValue('drivers', [...drivers, { name: driverInput.trim() }]);
      form.setFieldValue('driverInput', '');
    }
  };

  const handleRemoveDriver = (index: number, drivers: Array<{ name: string }>) => {
    form.setFieldValue('drivers', drivers.filter((_, i) => i !== index));
  };

  const handleAddVehicle = (
    vehicleInput: { name: string; plate: string; model: string; year: string },
    vehicles: Array<{ name: string; plate?: string; model?: string; year?: number }>
  ) => {
    if (vehicleInput.name.trim()) {
      form.setFieldValue('vehicles', [
        ...vehicles,
        {
          name: vehicleInput.name.trim(),
          plate: vehicleInput.plate.trim() || undefined,
          model: vehicleInput.model.trim() || undefined,
          year: vehicleInput.year ? parseInt(vehicleInput.year) : undefined,
        },
      ]);
      form.setFieldValue('vehicleInput', { name: '', plate: '', model: '', year: '' });
    }
  };

  const handleRemoveVehicle = (
    index: number,
    vehicles: Array<{ name: string; plate?: string; model?: string; year?: number }>
  ) => {
    form.setFieldValue('vehicles', vehicles.filter((_, i) => i !== index));
  };

  const handleAddExpenseType = (name: string, expenseTypes: Array<{ name: string; icon?: string }>) => {
    if (name.trim() && !expenseTypes.find((t) => t.name === name.trim())) {
      form.setFieldValue('expenseTypes', [...expenseTypes, { name: name.trim() }]);
    }
  };

  const handleRemoveExpenseType = (index: number, expenseTypes: Array<{ name: string; icon?: string }>) => {
    form.setFieldValue('expenseTypes', expenseTypes.filter((_, i) => i !== index));
  };

  const handleAddPaymentMethod = (name: string, paymentMethods: Array<{ name: string; icon?: string }>) => {
    if (name.trim() && !paymentMethods.find((m) => m.name === name.trim())) {
      form.setFieldValue('paymentMethods', [...paymentMethods, { name: name.trim() }]);
    }
  };

  const handleRemovePaymentMethod = (index: number, paymentMethods: Array<{ name: string; icon?: string }>) => {
    form.setFieldValue('paymentMethods', paymentMethods.filter((_, i) => i !== index));
  };

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

  const handleSkipStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
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
            <form.Field name="platformInput">
              {(field) => (
                <div className="flex gap-2">
                  <Field className="flex-1">
                    <FieldLabel className="sr-only" htmlFor="platformInput">
                      {t('platforms.placeholder')}
                    </FieldLabel>
                    <Input
                      id="platformInput"
                      placeholder={t('platforms.placeholder')}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const platforms = form.getFieldValue('platforms');
                          handleAddPlatform(field.state.value, platforms);
                        }
                      }}
                    />
                  </Field>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      const platforms = form.getFieldValue('platforms');
                      handleAddPlatform(field.state.value, platforms);
                    }}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </form.Field>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">{t('suggestions')}</Label>
              <div className="flex flex-wrap gap-2">
                {['Uber', '99', 'iFood', 'Rappi', 'Loggi'].map((suggestion, index) => {
                  const platforms = form.getFieldValue('platforms');
                  return (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => {
                        if (!platforms.find((p) => p.name === suggestion)) {
                          form.setFieldValue('platforms', [...platforms, { name: suggestion }]);
                        }
                      }}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <form.Field name="platforms">
              {(field) => (
                <div className="flex flex-wrap gap-2">
                  {field.state.value.map((platform, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {platform.name}
                      <button
                        onClick={() => handleRemovePlatform(index, field.state.value)}
                        className="ml-1 hover:text-destructive"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
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
            <form.Field name="driverInput">
              {(field) => (
                <div className="flex gap-2">
                  <Field className="flex-1">
                    <FieldLabel className="sr-only" htmlFor="driverInput">
                      {t('drivers.placeholder')}
                    </FieldLabel>
                    <Input
                      id="driverInput"
                      placeholder={t('drivers.placeholder')}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const drivers = form.getFieldValue('drivers');
                          handleAddDriver(field.state.value, drivers);
                        }
                      }}
                    />
                  </Field>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      const drivers = form.getFieldValue('drivers');
                      handleAddDriver(field.state.value, drivers);
                    }}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </form.Field>
            <form.Field name="drivers">
              {(field) => (
                <div className="flex flex-wrap gap-2">
                  {field.state.value.map((driver, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {driver.name}
                      <button
                        onClick={() => handleRemoveDriver(index, field.state.value)}
                        className="ml-1 hover:text-destructive"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
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
            <form.Field name="vehicleInput">
              {(field) => (
                <div className="space-y-3">
                  <Field>
                    <FieldLabel htmlFor="vehicleName">{t('vehicles.namePlaceholder')}</FieldLabel>
                    <Input
                      id="vehicleName"
                      placeholder={t('vehicles.namePlaceholder')}
                      value={field.state.value.name}
                      onChange={(e) => field.handleChange({ ...field.state.value, name: e.target.value })}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field>
                      <FieldLabel htmlFor="vehiclePlate">{t('vehicles.platePlaceholder')}</FieldLabel>
                      <Input
                        id="vehiclePlate"
                        placeholder={t('vehicles.platePlaceholder')}
                        value={field.state.value.plate}
                        onChange={(e) => field.handleChange({ ...field.state.value, plate: e.target.value })}
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="vehicleModel">{t('vehicles.modelPlaceholder')}</FieldLabel>
                      <Input
                        id="vehicleModel"
                        placeholder={t('vehicles.modelPlaceholder')}
                        value={field.state.value.model}
                        onChange={(e) => field.handleChange({ ...field.state.value, model: e.target.value })}
                      />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="vehicleYear">{t('vehicles.yearPlaceholder')}</FieldLabel>
                    <Input
                      id="vehicleYear"
                      type="number"
                      placeholder={t('vehicles.yearPlaceholder')}
                      value={field.state.value.year}
                      onChange={(e) => field.handleChange({ ...field.state.value, year: e.target.value })}
                    />
                  </Field>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      const vehicles = form.getFieldValue('vehicles');
                      handleAddVehicle(field.state.value, vehicles);
                    }}
                    type="button"
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('vehicles.addAnother')}
                  </Button>
                </div>
              )}
            </form.Field>
            <form.Field name="vehicles">
              {(field) => (
                <div className="flex flex-wrap gap-2">
                  {field.state.value.map((vehicle, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {vehicle.name} {vehicle.plate && `(${vehicle.plate})`}
                      <button
                        onClick={() => handleRemoveVehicle(index, field.state.value)}
                        className="ml-1 hover:text-destructive"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
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
            <form.Field name="expenseTypeInput">
              {(field) => (
                <div className="flex gap-2">
                  <Field className="flex-1">
                    <FieldLabel className="sr-only" htmlFor="expenseTypeInput">
                      {t('expenseTypes.placeholder')}
                    </FieldLabel>
                    <Input
                      id="expenseTypeInput"
                      placeholder={t('expenseTypes.placeholder')}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const expenseTypes = form.getFieldValue('expenseTypes');
                          handleAddExpenseType(field.state.value, expenseTypes);
                          field.handleChange('');
                        }
                      }}
                    />
                  </Field>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      const expenseTypes = form.getFieldValue('expenseTypes');
                      handleAddExpenseType(field.state.value, expenseTypes);
                      field.handleChange('');
                    }}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </form.Field>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">{t('suggestions')}</Label>
              <div className="flex flex-wrap gap-2">
                {['Fuel', 'Maintenance', 'Insurance', 'Car Wash', 'Parking'].map((suggestion, index) => {
                  const expenseTypes = form.getFieldValue('expenseTypes');
                  return (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => handleAddExpenseType(suggestion, expenseTypes)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <form.Field name="expenseTypes">
              {(field) => (
                <div className="flex flex-wrap gap-2">
                  {field.state.value.map((type, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {type.name}
                      <button
                        onClick={() => handleRemoveExpenseType(index, field.state.value)}
                        className="ml-1 hover:text-destructive"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
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
            <form.Field name="paymentMethodInput">
              {(field) => (
                <div className="flex gap-2">
                  <Field className="flex-1">
                    <FieldLabel className="sr-only" htmlFor="paymentMethodInput">
                      {t('paymentMethods.placeholder')}
                    </FieldLabel>
                    <Input
                      id="paymentMethodInput"
                      placeholder={t('paymentMethods.placeholder')}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const paymentMethods = form.getFieldValue('paymentMethods');
                          handleAddPaymentMethod(field.state.value, paymentMethods);
                          field.handleChange('');
                        }
                      }}
                    />
                  </Field>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      const paymentMethods = form.getFieldValue('paymentMethods');
                      handleAddPaymentMethod(field.state.value, paymentMethods);
                      field.handleChange('');
                    }}
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </form.Field>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">{t('suggestions')}</Label>
              <div className="flex flex-wrap gap-2">
                {['PIX', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer'].map((suggestion, index) => {
                  const paymentMethods = form.getFieldValue('paymentMethods');
                  return (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-secondary"
                      onClick={() => handleAddPaymentMethod(suggestion, paymentMethods)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Badge>
                  );
                })}
              </div>
            </div>
            <form.Field name="paymentMethods">
              {(field) => (
                <div className="flex flex-wrap gap-2">
                  {field.state.value.map((method, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {method.name}
                      <button
                        onClick={() => handleRemovePaymentMethod(index, field.state.value)}
                        className="ml-1 hover:text-destructive"
                        type="button"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </form.Field>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-10">
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
              <div className="flex justify-between text-sm">
                {steps.map((step, index) => (
                  <span
                    key={step.key}
                    className={index === currentStep ? 'font-semibold' : 'text-muted-foreground'}
                  >
                    {step.title}
                  </span>
                ))}
              </div>
              <Progress value={progress} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepContent()}
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
                {t('navigation.previous')}
              </Button>
              {currentStep < steps.length - 1 ? (
                <div className="flex gap-2">
                  {currentStep > 0 && (
                    <Button type="button" variant="ghost" onClick={handleSkipStep}>
                      {t('navigation.skip')}
                    </Button>
                  )}
                  <Button type="button" onClick={handleNext}>
                    {t('navigation.next')}
                  </Button>
                </div>
              ) : (
                <Button type="submit" disabled={isPending}>
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
