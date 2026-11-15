import { Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { FilterBar } from '@/components/ui/filter-bar'
import { TaskRow } from '@/components/ui/task-row'
import { getTasks } from '@/server/queries/tasks'
import Link from 'next/link'

async function TasksFeed({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams

  const filters = {
    query: params.q as string || undefined,
    category: params.category as string || undefined,
    status: params.status as string || 'open',
    location_mode: params.location as 'remote' | 'in_person' | undefined,
    country: params.country as string || undefined,
    compensation_type: params.compensation as 'none' | 'paid' | 'swap' | undefined,
    sort: params.sort as 'newest' | 'deadline' || 'newest',
    cursor: params.cursor as string || undefined,
    limit: 20,
  }

  const { tasks, nextCursor } = await getTasks(filters)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-semibold text-pine">Tasks</h1>
      </div>

      <FilterBar />

      {tasks.length > 0 ? (
        <>
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>

          {/* Pagination */}
          {nextCursor && (
            <div className="flex justify-center gap-2 mt-6">
              <Link
                href={`/tasks?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([k]) => k !== 'cursor')), cursor: nextCursor }).toString()}`}
                className="flex items-center gap-2 px-4 py-2 border border-stone rounded-lg text-sm text-ink hover:bg-paper transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Link>
              <Link
                href={`/tasks?${new URLSearchParams({ ...Object.fromEntries(Object.entries(params).filter(([k]) => k !== 'cursor')), cursor: nextCursor }).toString()}`}
                className="flex items-center gap-2 px-4 py-2 border border-stone rounded-lg text-sm text-ink hover:bg-paper transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state py-16 border border-stone rounded-lg">
          <p className="text-lg text-ink/70 mb-2">No tasks match your filters.</p>
          <p className="text-sm text-ink/60">Try adjusting your filters or search terms.</p>
          <Link href="/post" className="inline-block mt-4">
            <Button size="sm">Post a Task</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

function TasksFeedSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="skeleton h-10 w-32 rounded" />
      </div>
      <div className="skeleton h-48 rounded-lg border border-stone" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton h-32 rounded-lg border border-stone" />
        ))}
      </div>
    </div>
  )
}

export default function TasksPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return (
    <Suspense fallback={<TasksFeedSkeleton />}>
      <TasksFeed searchParams={searchParams} />
    </Suspense>
  )
}