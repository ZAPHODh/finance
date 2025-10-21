'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useScopedI18n } from '@/locales/client';
import { Edit, Trash, Search } from 'lucide-react';
import Link from 'next/link';
import { deleteRevenue } from '@/app/[locale]/(financial)/dashboard/revenues/actions';
import { toast } from 'sonner';
import { useTransition, useState, useMemo } from 'react';

interface Revenue {
  id: string;
  description: string | null;
  amount: number;
  date: Date;
  kmDriven: number | null;
  hoursWorked: number | null;
  revenueType: {
    id: string;
    name: string;
  } | null;
  company: {
    id: string;
    name: string;
  } | null;
  paymentMethod: {
    id: string;
    name: string;
  } | null;
  driver: {
    id: string;
    name: string;
  } | null;
  vehicle: {
    id: string;
    name: string;
  } | null;
}

interface RevenueType {
  id: string;
  name: string;
}

interface Company {
  id: string;
  name: string;
}

interface Driver {
  id: string;
  name: string;
}

interface Vehicle {
  id: string;
  name: string;
}

interface RevenuesTableProps {
  revenues: Revenue[];
  revenueTypes: RevenueType[];
  companies: Company[];
  drivers: Driver[];
  vehicles: Vehicle[];
}

export function RevenuesTable({ revenues, revenueTypes, companies, drivers, vehicles }: RevenuesTableProps) {
  const t = useScopedI18n('shared.financial.revenues');
  const tCommon = useScopedI18n('shared.common');
  const tNoData = useScopedI18n('shared.sidebar.dashboard.breakdowns');
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRevenueType, setSelectedRevenueType] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');

  const filteredRevenues = useMemo(() => {
    return revenues.filter((revenue) => {
      const matchesSearch = searchTerm === '' ||
        revenue.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        revenue.revenueType?.name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedRevenueType === 'all' || revenue.revenueType?.id === selectedRevenueType;
      const matchesCompany = selectedCompany === 'all' || revenue.company?.id === selectedCompany;
      const matchesDriver = selectedDriver === 'all' || revenue.driver?.id === selectedDriver;
      const matchesVehicle = selectedVehicle === 'all' || revenue.vehicle?.id === selectedVehicle;

      return matchesSearch && matchesType && matchesCompany && matchesDriver && matchesVehicle;
    });
  }, [revenues, searchTerm, selectedRevenueType, selectedCompany, selectedDriver, selectedVehicle]);

  async function handleDelete(id: string) {
    if (!confirm(tCommon('confirmDelete'))) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteRevenue(id);
        toast.success(tCommon('deleteSuccess'));
      } catch {
        toast.error(tCommon('error'));
      }
    });
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={tCommon('search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedRevenueType} onValueChange={setSelectedRevenueType}>
          <SelectTrigger>
            <SelectValue placeholder={t('revenueType')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon('filter')}</SelectItem>
            {revenueTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger>
            <SelectValue placeholder={t('company')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon('filter')}</SelectItem>
            {companies.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedDriver} onValueChange={setSelectedDriver}>
          <SelectTrigger>
            <SelectValue placeholder={t('driver')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon('filter')}</SelectItem>
            {drivers.map((driver) => (
              <SelectItem key={driver.id} value={driver.id}>
                {driver.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
          <SelectTrigger>
            <SelectValue placeholder={t('vehicle')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{tCommon('filter')}</SelectItem>
            {vehicles.map((vehicle) => (
              <SelectItem key={vehicle.id} value={vehicle.id}>
                {vehicle.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="p-3 font-semibold text-foreground text-sm">
                  {t('date')}
                </TableHead>
                <TableHead className="p-3 font-semibold text-foreground text-sm">
                  {t('description')}
                </TableHead>
                <TableHead className="p-3 font-semibold text-foreground text-sm">
                  {t('company')}
                </TableHead>
                <TableHead className="p-3 font-semibold text-foreground text-sm">
                  {t('driver')}
                </TableHead>
                <TableHead className="p-3 font-semibold text-foreground text-sm">
                  {t('vehicle')}
                </TableHead>
                <TableHead className="p-3 font-semibold text-foreground text-sm text-right">
                  {t('amount')}
                </TableHead>
                <TableHead className="p-3 text-right font-semibold text-foreground text-sm">
                  {tCommon('actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRevenues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-6 text-center text-muted-foreground">
                    {tNoData('noData')}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRevenues.map((revenue) => (
                  <TableRow key={revenue.id}>
                    <TableCell className="p-3 font-medium">
                      {formatDate(revenue.date)}
                    </TableCell>
                    <TableCell className="p-3">
                      {revenue.description || '-'}
                    </TableCell>
                    <TableCell className="p-3">
                      {revenue.company?.name || '-'}
                    </TableCell>
                    <TableCell className="p-3">
                      {revenue.driver?.name || '-'}
                    </TableCell>
                    <TableCell className="p-3">
                      {revenue.vehicle?.name || '-'}
                    </TableCell>
                    <TableCell className="p-3 text-right font-medium">
                      {formatCurrency(revenue.amount)}
                    </TableCell>
                    <TableCell className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link href={`/dashboard/revenues/${revenue.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(revenue.id)}
                          disabled={isPending}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
