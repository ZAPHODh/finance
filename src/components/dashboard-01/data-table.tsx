"use client"

import * as React from "react"
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table"
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  GripVertical,
  MoreHorizontal,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TransactionDrawer } from "./transaction-drawer"
import { useScopedI18n } from "@/locales/client"

interface Transaction {
  id: string
  description: string
  category: string
  amount: number
  type: "revenue" | "expense"
  date: Date
  driver?: string
  vehicle?: string
  company?: string
}

interface DataTableProps {
  data: Transaction[]
}

function DraggableRow({ row }: { row: Row<Transaction> }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.original.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as const,
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
      className="group"
    >
      <TableCell className="w-[60px]">
        <div className="flex items-center gap-2">
          <button
            className="cursor-grab touch-none opacity-50 hover:opacity-100 active:cursor-grabbing"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            className="translate-y-0.5"
          />
        </div>
      </TableCell>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({ data }: DataTableProps) {
  const t = useScopedI18n("shared.sidebar.dashboard.table")
  const [transactions, setTransactions] = React.useState<Transaction[]>(data)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [activeTab, setActiveTab] = React.useState("all")
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null)
  const [drawerOpen, setDrawerOpen] = React.useState(false)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date))
  }

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("date")}
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-3.5 w-3.5" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="font-medium">{formatDate(row.getValue("date"))}</div>
      ),
    },
    {
      accessorKey: "type",
      header: t("type"),
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return (
          <Badge variant={type === "revenue" ? "default" : "secondary"} className="font-medium">
            {type === "revenue" ? t("revenue") : t("expense")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "description",
      header: t("description"),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-muted-foreground">
          {row.getValue("description") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: t("category"),
      cell: ({ row }) => (
        <div className="max-w-[150px] truncate font-medium">
          {row.getValue("category")}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t("amount")}
            {column.getIsSorted() === "asc" ? (
              <ArrowUp className="ml-2 h-3.5 w-3.5" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowDown className="ml-2 h-3.5 w-3.5" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const type = row.original.type
        return (
          <div className={`font-semibold tabular-nums ${
            type === "revenue" ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
          }`}>
            {formatCurrency(amount)}
          </div>
        )
      },
    },
    {
      accessorKey: "driver",
      header: t("driver"),
      cell: ({ row }) => (
        <div className="max-w-[120px] truncate text-muted-foreground">
          {row.getValue("driver") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "vehicle",
      header: t("vehicle"),
      cell: ({ row }) => (
        <div className="max-w-[120px] truncate text-muted-foreground">
          {row.getValue("vehicle") || "-"}
        </div>
      ),
    },
    {
      accessorKey: "company",
      header: t("company"),
      cell: ({ row }) => (
        <div className="max-w-[120px] truncate text-muted-foreground">
          {row.getValue("company") || "-"}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">{t("openMenu")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(transaction.id)
                }}
              >
                {t("copyId")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTransaction(transaction)
                  setDrawerOpen(true)
                }}
              >
                {t("viewDetails")}
              </DropdownMenuItem>
              <DropdownMenuItem>{t("edit")}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const filteredData = React.useMemo(() => {
    if (activeTab === "all") return transactions
    if (activeTab === "revenue") return transactions.filter((t) => t.type === "revenue")
    if (activeTab === "expense") return transactions.filter((t) => t.type === "expense")
    return transactions
  }, [transactions, activeTab])

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setTransactions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="space-y-4 px-4 lg:px-6">
      <div className="flex items-center justify-between gap-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList>
            <TabsTrigger value="all">{t("all")}</TabsTrigger>
            <TabsTrigger value="revenue">{t("revenues")}</TabsTrigger>
            <TabsTrigger value="expense">{t("expenses")}</TabsTrigger>
          </TabsList>
        </Tabs>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-8">
              {t("columns")} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="@container/table rounded-lg border bg-card">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}
        >
          <Table>
            <TableHeader className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  <TableHead className="w-[60px]">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 opacity-50" />
                      <Checkbox
                        checked={
                          table.getIsAllPageRowsSelected() ||
                          (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) =>
                          table.toggleAllPageRowsSelected(!!value)
                        }
                        aria-label="Select all"
                        className="translate-y-0.5"
                      />
                    </div>
                  </TableHead>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <SortableContext
                items={filteredData.map((t) => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <DraggableRow key={row.id} row={row} />
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="h-32 text-center text-muted-foreground"
                    >
                      {t("noResults")}
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} {t("of")}{" "}
          {table.getFilteredRowModel().rows.length} {t("rowsSelected")}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
          <div className="flex items-center space-x-2">
            <p className="whitespace-nowrap text-sm font-medium">
              {t("rowsPerPage")}
            </p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              {t("page")} {table.getState().pagination.pageIndex + 1} {t("of")}{" "}
              {table.getPageCount()}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">{t("goToFirstPage")}</span>
                <span className="text-sm">{"<<"}</span>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">{t("goToPreviousPage")}</span>
                <span className="text-sm">{"<"}</span>
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">{t("goToNextPage")}</span>
                <span className="text-sm">{">"}</span>
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">{t("goToLastPage")}</span>
                <span className="text-sm">{">>"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <TransactionDrawer
        transaction={selectedTransaction}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  )
}
