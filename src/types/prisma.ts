import { Prisma } from "@prisma/client"

export type RevenueWithRelations = Prisma.RevenueGetPayload<{
  include: {
    platforms: {
      include: {
        platform: {
          select: {
            id: true
            name: true
          }
        }
      }
    }
    paymentMethod: {
      select: {
        id: true
        name: true
      }
    }
    driver: {
      select: {
        id: true
        name: true
      }
    }
    vehicle: {
      select: {
        id: true
        name: true
      }
    }
  }
}>

export type ExpenseWithRelations = Prisma.ExpenseGetPayload<{
  include: {
    expenseTypes: {
      include: {
        expenseType: true
      }
    }
    driver: true
    vehicle: true
  }
}>

export type BudgetWithUsage = Prisma.BudgetGetPayload<{
  include: {
    expenseType: true
  }
}> & {
  currentSpending: number
  percentageUsed: number
  status: "on-track" | "warning" | "exceeded"
}

export type GoalWithRelations = Prisma.GoalGetPayload<{
  include: {
    driver: true
    vehicle: true
  }
}> & {
  progress: number
  status: "on-track" | "at-risk" | "achieved"
}

export type DriverWithRelations = Prisma.DriverGetPayload<{
  include: {
    revenues: true
    expenses: true
  }
}>

export type VehicleWithRelations = Prisma.VehicleGetPayload<{
  include: {
    revenues: true
    expenses: true
  }
}>

export type PlatformWithRelations = Prisma.PlatformGetPayload<{
  include: {
    revenues: {
      include: {
        revenue: true
      }
    }
  }
}>

export type UserPreferencesWithDefaults = Prisma.UserPreferencesGetPayload<{
  include: {
    driver: true
    vehicle: true
  }
}>
