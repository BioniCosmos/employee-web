import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Table as TableRoot,
  TableRow,
} from '@/components/ui/table'
import type { Cursor, Mutate } from '@/lib/data'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type VisibilityState,
} from '@tanstack/react-table'
import { ChevronDown, MoreHorizontal } from 'lucide-react'
import { useReducer, useState, type ChangeEventHandler } from 'react'
import toast from 'react-hot-toast'
import { initEmployee, type Employee } from '../lib/Employee'
import { request, sendAndEcho, toastPromise } from '../lib/request'
import Dialog from './Dialog'

export interface State<T> {
  open: boolean
  title?: string
  data?: T
}

type Action<T> =
  | { type: 'open'; title: string; data: T }
  | { type: 'close' }
  | { type: 'setData'; data: Partial<T> }

function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'open':
      return {
        open: true,
        title: action.title,
        data: action.data,
      }
    case 'close':
      return { open: false }
    case 'setData':
      return { ...state, data: { ...state.data, ...(action.data as T) } }
  }
}

interface Props {
  data: Employee[]
  mutate: Mutate
  loadMore: () => Promise<Cursor[] | undefined>
}

export default function Table({ data, mutate, loadMore }: Props) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [state, dispatch] = useReducer(reducer<Employee>, { open: false })

  function openDialog(
    props: { title: 'Create' } | { title: 'Edit'; dataIndex: number }
  ) {
    return () =>
      dispatch({
        type: 'open',
        title: props.title,
        data:
          props.title === 'Edit'
            ? { ...data[props.dataIndex], annualSalary: undefined }
            : initEmployee(),
      })
  }

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const key = event.currentTarget.id
    const value =
      event.currentTarget.type === 'number'
        ? Number(event.currentTarget.value)
        : event.currentTarget.value
    dispatch({ type: 'setData', data: { [key]: value } })
  }

  async function afterSubmit() {
    await mutate()
    dispatch({ type: 'close' })
  }

  function deleteOne(index: number) {
    return async () => {
      const req = request(`/api/employee/${data[index].id}`, {
        method: 'DELETE',
      })
      if (await toastPromise(req)) {
        await mutate()
      }
    }
  }

  async function deleteSelection() {
    const ids = Object.keys(rowSelection)
      .map((i) => Number(i))
      .map((i) => data[i].id)
    if (await sendAndEcho('/api/employees', ids, 'DELETE')) {
      await mutate()
      setRowSelection({})
    }
  }

  const columns: ColumnDef<Employee>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: 'Id',
      cell: ({ row }) => <div>{row.getValue('id')}</div>,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <div>{row.getValue('name')}</div>,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => <div>{row.getValue('gender')}</div>,
    },
    {
      accessorKey: 'age',
      header: 'Age',
      cell: ({ row }) => <div>{row.getValue('age')}</div>,
    },
    {
      accessorKey: 'salary',
      header: 'Salary',
      cell: ({ row }) => <div>¥{row.getValue('salary')}</div>,
    },
    {
      accessorKey: 'bonus',
      header: 'Bonus',
      cell: ({ row }) => <div>¥{row.getValue('bonus')}</div>,
    },
    {
      accessorKey: 'annualSalary',
      header: 'Annual Salary',
      cell: ({ row }) => <div>¥{row.getValue('annualSalary')}</div>,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={openDialog({ title: 'Edit', dataIndex: row.index })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteOne(row.index)}>
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  async function handleLoadMore() {
    if ((await loadMore())?.at(-1)?.nextCursor === null) {
      toast.error('No more content!')
    }
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Filter names..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="space-x-4">
            <Button variant="outline" onClick={openDialog({ title: 'Create' })}>
              Create
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {Object.keys(rowSelection).length !== 0 && (
                  <>
                    <DropdownMenuItem onClick={deleteSelection}>
                      Remove the selection
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(value)
                      }
                    >
                      {column.columnDef.header?.toString()}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="rounded-md border">
          <TableRoot>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length !== 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </TableRoot>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected
          </div>
          <Button variant="outline" onClick={handleLoadMore}>
            Load More
          </Button>
        </div>
      </div>
      <Dialog
        state={state}
        handleInputChange={handleInputChange}
        afterSubmit={afterSubmit}
      />
    </>
  )
}
