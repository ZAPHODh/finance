'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useScopedI18n } from '@/locales/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { completeOnboarding, type OnboardingData } from '@/app/[locale]/(user)/onboarding/actions';
import { toast } from 'sonner';
import { CheckCircle2, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface OnboardingWizardProps {
  locale: string;
}

export function OnboardingWizard({ locale }: OnboardingWizardProps) {
  const router = useRouter();
  const t = useScopedI18n('shared.onboarding');
  const [isPending, startTransition] = useTransition();
  const [currentStep, setCurrentStep] = useState(0);


  const [platforms, setPlatforms] = useState<Array<{ name: string; icon?: string }>>([]);
  const [platformInput, setPlatformInput] = useState('');

  const [drivers, setDrivers] = useState<Array<{ name: string }>>([]);
  const [driverInput, setDriverInput] = useState('');

  const [vehicles, setVehicles] = useState<Array<{ name: string; plate?: string; model?: string; year?: number }>>([]);
  const [vehicleInput, setVehicleInput] = useState({ name: '', plate: '', model: '', year: '' });

  const [expenseTypes, setExpenseTypes] = useState<Array<{ name: string; icon?: string }>>([]);
  const [expenseTypeInput, setExpenseTypeInput] = useState('');

  const [paymentMethods, setPaymentMethods] = useState<Array<{ name: string; icon?: string }>>([]);
  const [paymentMethodInput, setPaymentMethodInput] = useState('');

  const steps = [
    { key: 'welcome', title: t('steps.welcome') },
    { key: 'platforms', title: t('steps.platforms') },
    { key: 'drivers', title: t('steps.drivers') },
    { key: 'vehicles', title: t('steps.vehicles') },
    { key: 'expenseTypes', title: t('steps.expenseTypes') },
    { key: 'paymentMethods', title: t('steps.paymentMethods') },
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleAddPlatform = () => {
    if (platformInput.trim()) {
      setPlatforms([...platforms, { name: platformInput.trim() }]);
      setPlatformInput('');
    }
  };

  const handleRemovePlatform = (index: number) => {
    setPlatforms(platforms.filter((_, i) => i !== index));
  };

  const handleAddDriver = () => {
    if (driverInput.trim()) {
      setDrivers([...drivers, { name: driverInput.trim() }]);
      setDriverInput('');
    }
  };

  const handleRemoveDriver = (index: number) => {
    setDrivers(drivers.filter((_, i) => i !== index));
  };

  const handleAddVehicle = () => {
    if (vehicleInput.name.trim()) {
      setVehicles([...vehicles, {
        name: vehicleInput.name.trim(),
        plate: vehicleInput.plate.trim() || undefined,
        model: vehicleInput.model.trim() || undefined,
        year: vehicleInput.year ? parseInt(vehicleInput.year) : undefined,
      }]);
      setVehicleInput({ name: '', plate: '', model: '', year: '' });
    }
  };

  const handleRemoveVehicle = (index: number) => {
    setVehicles(vehicles.filter((_, i) => i !== index));
  };

  const handleAddExpenseType = (name: string) => {
    if (name.trim() && !expenseTypes.find(t => t.name === name.trim())) {
      setExpenseTypes([...expenseTypes, { name: name.trim() }]);
    }
  };

  const handleRemoveExpenseType = (index: number) => {
    setExpenseTypes(expenseTypes.filter((_, i) => i !== index));
  };

  const handleAddPaymentMethod = (name: string) => {
    if (name.trim() && !paymentMethods.find(m => m.name === name.trim())) {
      setPaymentMethods([...paymentMethods, { name: name.trim() }]);
    }
  };

  const handleRemovePaymentMethod = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, i) => i !== index));
  };

  const handleNext = () => {
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

  const handleFinish = () => {
    startTransition(async () => {
      try {
        const data: OnboardingData = {
          platforms,
          drivers,
          vehicles,
          expenseTypes,
          paymentMethods,
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
        toast.error(error instanceof Error ? error.message : 'An error occurred');
      }
    });
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
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder={t('platforms.placeholder')}
                  value={platformInput}
                  onChange={(e) => setPlatformInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPlatform()}
                />
              </div>
              <Button onClick={handleAddPlatform} type="button">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">{t('suggestions')}</Label>
              <div className="flex flex-wrap gap-2">
                {['Uber', '99', 'iFood', 'Rappi', 'Loggi'].map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => {
                      if (!platforms.find(p => p.name === suggestion)) {
                        setPlatforms([...platforms, { name: suggestion }]);
                      }
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {platform.name}
                  <button
                    onClick={() => handleRemovePlatform(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{t('drivers.title')}</h2>
              <p className="text-muted-foreground">{t('drivers.description')}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder={t('drivers.placeholder')}
                  value={driverInput}
                  onChange={(e) => setDriverInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddDriver()}
                />
              </div>
              <Button onClick={handleAddDriver} type="button">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {drivers.map((driver, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {driver.name}
                  <button
                    onClick={() => handleRemoveDriver(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{t('vehicles.title')}</h2>
              <p className="text-muted-foreground">{t('vehicles.description')}</p>
            </div>
            <div className="space-y-3">
              <Input
                placeholder={t('vehicles.namePlaceholder')}
                value={vehicleInput.name}
                onChange={(e) => setVehicleInput({ ...vehicleInput, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder={t('vehicles.platePlaceholder')}
                  value={vehicleInput.plate}
                  onChange={(e) => setVehicleInput({ ...vehicleInput, plate: e.target.value })}
                />
                <Input
                  placeholder={t('vehicles.modelPlaceholder')}
                  value={vehicleInput.model}
                  onChange={(e) => setVehicleInput({ ...vehicleInput, model: e.target.value })}
                />
              </div>
              <Input
                type="number"
                placeholder={t('vehicles.yearPlaceholder')}
                value={vehicleInput.year}
                onChange={(e) => setVehicleInput({ ...vehicleInput, year: e.target.value })}
              />
              <Button onClick={handleAddVehicle} type="button" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {t('vehicles.addAnother')}
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {vehicles.map((vehicle, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {vehicle.name} {vehicle.plate && `(${vehicle.plate})`}
                  <button
                    onClick={() => handleRemoveVehicle(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{t('expenseTypes.title')}</h2>
              <p className="text-muted-foreground">{t('expenseTypes.description')}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder={t('expenseTypes.placeholder')}
                  value={expenseTypeInput}
                  onChange={(e) => setExpenseTypeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddExpenseType(expenseTypeInput);
                      setExpenseTypeInput('');
                    }
                  }}
                />
              </div>
              <Button
                onClick={() => {
                  handleAddExpenseType(expenseTypeInput);
                  setExpenseTypeInput('');
                }}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">{t('suggestions')}</Label>
              <div className="flex flex-wrap gap-2">
                {['Fuel', 'Maintenance', 'Insurance', 'Car Wash', 'Parking'].map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => handleAddExpenseType(suggestion)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {expenseTypes.map((type, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {type.name}
                  <button
                    onClick={() => handleRemoveExpenseType(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">{t('paymentMethods.title')}</h2>
              <p className="text-muted-foreground">{t('paymentMethods.description')}</p>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder={t('paymentMethods.placeholder')}
                  value={paymentMethodInput}
                  onChange={(e) => setPaymentMethodInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddPaymentMethod(paymentMethodInput);
                      setPaymentMethodInput('');
                    }
                  }}
                />
              </div>
              <Button
                onClick={() => {
                  handleAddPaymentMethod(paymentMethodInput);
                  setPaymentMethodInput('');
                }}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">{t('suggestions')}</Label>
              <div className="flex flex-wrap gap-2">
                {['PIX', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer'].map((suggestion, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary"
                    onClick={() => handleAddPaymentMethod(suggestion)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {method.name}
                  <button
                    onClick={() => handleRemovePaymentMethod(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>{t('subtitle')}</CardDescription>
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0 || isPending}
            >
              {t('navigation.previous')}
            </Button>
            <div className="flex gap-2">
              {currentStep > 0 && currentStep < steps.length - 1 && (
                <Button variant="ghost" onClick={handleSkipStep} disabled={isPending}>
                  {t('navigation.skip')}
                </Button>
              )}
              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} disabled={isPending}>
                  {t('navigation.next')}
                </Button>
              ) : (
                <Button onClick={handleFinish} disabled={isPending}>
                  {isPending ? t('completing') : t('navigation.finish')}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
