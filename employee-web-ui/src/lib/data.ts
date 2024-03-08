import useSWRInfinite from 'swr/infinite'
import type { Employee } from './Employee'

export interface Cursor {
  data: Employee[]
  nextCursor: string
}

export type Mutate = ReturnType<typeof useSWRInfinite<Cursor>>['mutate']
