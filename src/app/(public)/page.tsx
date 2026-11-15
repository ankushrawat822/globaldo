import { Suspense } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Filter, ArrowRight } from 'lucide-react'
import { TaskRow } from '@/components/ui/task-row'
import { getTasks } from '@/server/queries/tasks'

async function HomeFeed() {
  const { tasks } = await getTasks({ limit: 10, status: 'open' })

  return (
    <div className="space-y-8">
      <section className="text-center py-12 border-b border-stone">
        <h1 className="text-4xl md:text-5xl font-heading font-semibold text-ink mb-4">
          GlobalDo
        </h1>
        <p className="text-lg text-ink/70 max-w-2xl mx-auto mb-8">
          A global public board of to-dos. Post what you need done; others who can help offer to connect.
          Contacts are shared only when both sides agree.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/post">
            <Button size="lg" className="w-full sm:w-auto">
              Post a Task
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/tasks">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Browse All Tasks
            </Button>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-heading font-semibold text-ink">Live Task Feed</h2>
          <Link href="/tasks">
            <Button variant="secondary" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="empty-state py-16 border border-stone rounded-lg">
            <p className="text-lg text-ink/70">No tasks posted yet.</p>
            <p className="mt-2">Be the first to post a task!</p>
            <Link href="/post" className="inline-block mt-4">
              <Button size="sm">Post a Task</Button>
            </Link>
          </div>
        )}
      </section>

      <section className="border-t border-stone pt-8">
        <h2 className="text-2xl font-heading font-semibold text-ink mb-6">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-pine/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-pine">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">Post a Task</h3>
            <p className="text-ink/70 text-sm">
              Describe what you need done. Add category, location, deadline, and compensation type.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-pine/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-pine">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">Offer Help</h3>
            <p className="text-ink/70 text-sm">
              Browse tasks and send an offer with a short message. No commitment until accepted.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-pine/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-pine">
              <ArrowRight className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-ink mb-2">Connect & Complete</h3>
            <p className="text-ink/70 text-sm">
              On mutual acceptance, chosen contact details are revealed. You take it from there.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function HomeFeedSkeleton() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12 border-b border-stone">
        <div className="skeleton h-12 w-3/4 mx-auto mb-4 rounded" />
        <div className="skeleton h-6 w-full mx-auto mb-8 rounded" />
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="skeleton h-12 w-full sm:w-48 rounded" />
          <div className="skeleton h-12 w-full sm:w-48 rounded" />
        </div>
      </section>
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="skeleton h-8 w-48 rounded" />
          <div className="skeleton h-10 w-32 rounded" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-lg border border-stone" />
          ))}
        </div>
      </section>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<HomeFeedSkeleton />}>
      <HomeFeed />
    </Suspense>
  )
}