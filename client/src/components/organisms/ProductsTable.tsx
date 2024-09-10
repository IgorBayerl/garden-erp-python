import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, SortingState, ColumnFiltersState, VisibilityState, getFilteredRowModel } from '@tanstack/react-table'
import { Product } from '@/api/types'
import { Button } from '../ui/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '../ui/table'
import { useDeleteProduct } from '@/api/products'
import Image from '../ui/image'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ProductTableProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export default function ProductTable({ products, onSelectProduct }: ProductTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [filterName, setFilterName] = useState<string>("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const openDeleteModal = (id: number) => {
    setSelectedProductId(id);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedProductId(null);
  };

  const confirmDeleteProduct = () => {
    if (selectedProductId !== null) {
      handleDeleteProduct(selectedProductId);
      closeDeleteModal();
    }
  };

  const deleteProductMutation = useDeleteProduct();

  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };

  // Columns definition for the product table
  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: 'image',
      header: 'Imagem',
      cell: ({ row }) => (
        <Image
          src={row.getValue('image')}
          alt="Produto"
          className="object-cover h-12 w-12 bg-black bg-opacity-10 rounded-md"
        />
      ),
    },
    {
      accessorKey: 'name',
      header: 'Nome',
      cell: ({ row }) => <span>{row.getValue('name')}</span>,
    },
    {
      id: 'actions',
      header: 'Ações',
      cell: ({ row }) => {
        const product = row.original // Access the full product data
  
        const handleSelect = () => {
          onSelectProduct(product)
        }
        
        return (
          <div className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelect}
            >
              Select
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => openDeleteModal(product.id)}  // Open modal
            >
              <Trash2 className="h-4 w-4" />
            </Button>

          </div>
        )
      },
    },
  ]
  

  const table = useReactTable({
    data: products ?? [],
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

  return (
    <div className="w-full overflow-hidden flex flex-col h-full p-1">
      <div className="flex items-center pb-4 space-x-4 justify-between">
        <Input
          placeholder="Filtrar por nome do produto..."
          value={filterName}
          onChange={(event) => handleFilterByName(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas
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
                    {column.columnDef.header as string | ''}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border flex overflow-y-auto flex-1">
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
          <TableBody >
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

      <div className="flex items-center justify-end space-x-2 pt-4">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Próximo
        </Button>
      </div>
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end space-x-4 mt-4">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDeleteProduct}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
