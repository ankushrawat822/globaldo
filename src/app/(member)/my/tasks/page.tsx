import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { TaskRow } from '@/components/ui/task-row'
import { getUserTasks } from '@/server/queries/tasks'
import { Plus } from 'lucide-react'
import Link from 'next/link'

async function MyTasksContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/my/tasks')
  }

  const tasks = await getUserTasks(user.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-heading font-semibold text-pine">My Tasks</h1>
        <Link href="/post">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Post New Task
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-heading font-semibold text-ink">Your Tasks</h2>
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="empty-state py-16 border border-stone rounded-lg text-center">
              <p className="text-lg text-ink/70 mb-2">You haven't posted any tasks yet.</p>
              <Link href="/post">
                <Button>Post Your First Task</Button>
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-heading font-semibold text-ink">Quick Stats</h2>
          <div className="p-6 border border-stone rounded-lg bg-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-ink/60">Total Tasks</span>
              <span className="font-medium">{tasks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ink/60">Open</span>
              <span className="font-medium">{tasks.filter(t => t.status === 'open').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-ink/60">Completed</span>
              <span className="font-medium">{tasks.filter(t => t.status === 'done').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MyTasksSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="skeleton h-10 w-32 rounded" />
        <div className="skeleton h-10 w-48 rounded" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton h-8 w-48 rounded" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-32 rounded-lg border border-stone" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-8 w-48 rounded" />
          <div className="skeleton h-32 rounded-lg border border-stone" />
        </div>
      </div>
    </div>
  )
}

export default function MyTasksPage() {
  return (
    <Suspense fallback={<MyTasksSkeleton />}>
      <MyTasksContent />
    </Suspense>
  )
}