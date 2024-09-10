import * as React from 'react'
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, SortingState, ColumnFiltersState, VisibilityState, getFilteredRowModel } from '@tanstack/react-table'
import { Product } from '@/api/types'
import { useGetProducts } from '@/api/products'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '../ui/table'
import Image from '../ui/image'

export default function ProductTable() {
  const { data, isLoading, error } = useGetProducts()
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [filterName, setFilterName] = React.useState<string>("")

  // Columns definition for the product table
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'name',
      header: 'Product Name',
      cell: ({ row }) => <span>{row.getValue('name')}</span>,
    },
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ row }) => (
        <Image src={row.getValue('image')} alt="Product" className="object-scale-down h-20 w-20" />
      ),
    },
  ]

  const table = useReactTable({
    data: data ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(), // Enable filtering
  })

  const handleFilterByName = (value: string) => {
    setFilterName(value)
    table.getColumn('name')?.setFilterValue(value)
  }

  if (isLoading) return <p>Carregando...</p>
  if (error) return <p>Erro ao buscar produtos.</p>

  return (
    <div className="w-full">
      <div className="flex items-center py-4 space-x-4">
        <Input
          placeholder="Filtrar por nome do produto..."
          value={filterName}
          onChange={(event) => handleFilterByName(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
    </div>
  )
}
