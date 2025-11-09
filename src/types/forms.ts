export interface DriverFormData {
  name: string
}

export interface VehicleFormData {
  name: string
  plate?: string
  model?: string
  year?: number
}

export interface PlatformFormData {
  name: string
}

export interface PaymentMethodFormData {
  name: string
  feeType: string
  feePercentage: number | null
  feeFixed: number | null
}

export interface ExpenseTypeFormData {
  name: string
}

export interface ExpenseFormData {
  amount: number
  date: Date
  expenseTypeId: string
  driverId?: string | null
  vehicleId?: string | null
}

export interface RevenueFormData {
  amount: number
  date: Date
  kmDriven?: number | null
  hoursWorked?: number | null
  paymentMethodId?: string | null
  driverId?: string | null
  vehicleId?: string | null
  platformIds: string[]
}

export interface BudgetFormData {
  name?: string
  expenseTypeId: string
  monthlyLimit: number
  alertThreshold: number
  period: string
}

export interface UpdateBudgetData {
  name?: string
  expenseTypeId?: string
  monthlyLimit?: number
  alertThreshold?: number
  period?: string
  isActive?: boolean
}

export interface GoalFormData {
  name?: string
  type: string
  targetValue: number
  period: string
  driverId?: string
  vehicleId?: string
}

export interface UpdateGoalData {
  name?: string
  targetValue?: number
  period?: string
  driverId?: string
  vehicleId?: string
  isActive?: boolean
}

export interface QuickDailyEntryFormData {
  date: Date
  revenue: {
    amount: number
    platformIds: string[]
  } | null
  expense: {
    amount: number
  } | null
}

export interface CompleteDailyEntryFormData {
  date: Date
  revenue: {
    amount: number
    platformIds: string[]
    driverId?: string
    vehicleId?: string
    paymentMethodId?: string
    kmDriven?: number
    hoursWorked?: number
  } | null
  expense: {
    amount: number
    expenseTypeId?: string
    driverId?: string
    vehicleId?: string
    useSameDriver?: boolean
    useSameVehicle?: boolean
  } | null
}
