import { Toaster } from 'react-hot-toast'
import useSWRInfinite from 'swr/infinite'
import Table from './components/Table'
import type { Cursor } from './lib/data'
import { fetcher } from './lib/request'

export default function App() {
  const { data, isLoading, error, setSize, mutate } = useSWRInfinite<Cursor>(
    getKey,
    fetcher
  )
  const loadMore = () => setSize((prevSize) => prevSize + 1)

  if (error !== undefined || data === undefined) {
    return <div className="p-4">Failed to load</div>
  }
  if (isLoading) {
    return <div className="p-4">Loading…</div>
  }

  return (
    <div className="px-4">
      <Table
        data={data.map(({ data }) => data).flat()}
        mutate={mutate}
        loadMore={loadMore}
      />
      <Toaster />
    </div>
  )
}

function getKey(index: number, prev: Cursor | null) {
  if (index === 0) {
    return '/api/employees?limit=5'
  }
  if (prev?.nextCursor === null) {
    return null
  }
  return `/api/employees?cursor=${prev?.nextCursor}&limit=5`
}
