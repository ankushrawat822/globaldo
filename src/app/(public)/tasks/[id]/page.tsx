import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { MapPin, Calendar, DollarSign, RefreshCw, User, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getTaskById } from '@/server/queries/tasks'
import { formatDistanceToNow, format } from 'date-fns'
import TaskDetailWrapper from '@/components/TaskDetailWrapper'
import ReportTaskButton from '@/components/ReportTaskButton'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getTaskMetadata(task: Awaited<ReturnType<typeof getTaskById>>): Promise<Metadata> {
  if (!task) return {}

  return {
    title: `${task.title} | GlobalDo`,
    description: task.description.slice(0, 160),
    openGraph: {
      title: task.title,
      description: task.description.slice(0, 160),
      type: 'article',
      siteName: 'GlobalDo',
    },
    twitter: {
      card: 'summary',
      title: task.title,
      description: task.description.slice(0, 160),
    },
  }
}

function getStatusBadge(status: string) {
  const variants: Record<string, { label: string; className: string }> = {
    open: { label: 'Open', className: 'bg-sun/10 text-sun border-sun/30' },
    in_progress: { label: 'In Progress', className: 'bg-pine/10 text-pine border-pine/30' },
    done: { label: 'Done', className: 'bg-stone/10 text-ink/70 border-stone/30' },
    closed: { label: 'Closed', className: 'bg-ink/10 text-ink/50 border-ink/20' },
    expired: { label: 'Expired', className: 'bg-ink/10 text-ink/50 border-ink/20' },
    hidden: { label: 'Hidden', className: 'bg-danger/10 text-danger border-danger/30' },
  }
  const v = variants[status] || variants.open
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${v.className}`}>
      {v.label}
    </span>
  )
}

function getCompensationLabel(type: string, amount: number | null, currency: string = 'USD') {
  switch (type) {
    case 'paid':
      return amount ? `${currency} ${amount}` : 'Paid'
    case 'swap':
      return 'Skill swap'
    case 'none':
    default:
      return 'Free'
  }
}

async function TaskDetailContent({ task }: { task: NonNullable<Awaited<ReturnType<typeof getTaskById>>> }) {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <Link href="/tasks" className="inline-flex items-center gap-2 text-sm text-ink/60 hover:text-pine">
        <ArrowLeft className="w-4 h-4" />
        Back to tasks
      </Link>

      <article className="space-y-6">
        <header>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-heading font-semibold text-ink">{task.title}</h1>
                {getStatusBadge(task.status)}
              </div>
              {task.owner && (
                <Link href={`/u/${task.owner.handle}`} className="flex items-center gap-2 text-sm text-ink/60 hover:text-pine">
                  <User className="w-4 h-4" />
                  <span>@{task.owner.handle}</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        <div className="flex items-center justify-between">
          <div className="prose prose-ink max-w-none flex-1">
            <p className="text-ink/80 whitespace-pre-wrap">{task.description}</p>
          </div>
          <ReportTaskButton taskId={task.id} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-stone rounded-lg">
          <div className="space-y-4">
            <h3 className="font-semibold text-ink">Details</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">Category</dt>
                <dd className="text-ink font-medium">{task.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60">Location</dt>
                <dd className="text-ink font-medium flex items-center gap-1">
                  {task.location_mode === 'in_person' && task.city ? (
                    <>
                      <MapPin className="w-4 h-4" />
                      {task.city}, {task.country}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 text-pine" />
                      Remote
                    </>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60">Compensation</dt>
                <dd className="text-ink font-medium flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {getCompensationLabel(task.compensation_type, task.amount, task.currency)}
                </dd>
              </div>
              {task.helpers_needed > 1 && (
                <div className="flex justify-between">
                  <dt className="text-ink/60">Helpers needed</dt>
                  <dd className="text-ink font-medium">{task.helpers_needed}</dd>
                </div>
              )}
              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <dt className="text-ink/60">Tags:</dt>
                  {task.tags.map((tag) => (
                    <dd key={tag} className="px-2 py-0.5 rounded bg-pine/10 text-pine text-xs">#{tag}</dd>
                  ))}
                </div>
              )}
            </dl>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-ink">Timeline</h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">Posted</dt>
                <dd className="text-ink font-medium">{format(new Date(task.created_at), 'MMMM d, yyyy')}</dd>
              </div>
              {task.deadline && (
                <div className="flex justify-between">
                  <dt className="text-ink/60">Deadline</dt>
                  <dd className="text-ink font-medium flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(task.deadline), 'MMMM d, yyyy')}
                    <span className="text-ink/50">({formatDistanceToNow(new Date(task.deadline), { addSuffix: true })})</span>
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/60">Last updated</dt>
                <dd className="text-ink font-medium">{format(new Date(task.updated_at), 'MMMM d, yyyy')}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* CTA Section */}
        {task.status === 'open' && (
          <div className="p-6 border border-stone rounded-lg bg-pine/5">
            <h3 className="text-lg font-semibold text-ink mb-2">Want to help?</h3>
            <p className="text-ink/70 mb-4">Send an offer to the task owner with your proposal.</p>
            <Link href={`/login?redirect=/tasks/${task.id}`}>
              <Button size="lg">Offer Help</Button>
            </Link>
          </div>
        )}

        <div className="border-t border-stone pt-6 text-center">
          <p className="text-sm text-ink/60">
            This task is posted on <strong>GlobalDo</strong>. Contact details are only shared after mutual acceptance.
          </p>
        </div>
      </article>

      </div>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const task = await getTaskById(id)
  return getTaskMetadata(task)
}

export default async function TaskDetailPage({ params }: PageProps) {
  const { id } = await params
  const task = await getTaskById(id)

  if (!task) {
    notFound()
  }

  return (
    <Suspense fallback={<TaskDetailSkeleton />}>
      <TaskDetailWrapper task={task}>
        <TaskDetailContent task={task} />
      </TaskDetailWrapper>
    </Suspense>
  )
}

function TaskDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      <div className="skeleton h-8 w-3/4 rounded" />
      <div className="skeleton h-6 w-1/2 rounded" />
      <div className="space-y-4">
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border border-stone rounded-lg">
        <div className="space-y-4">
          <div className="skeleton h-6 w-24 rounded" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-4 w-32 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-4 w-32 rounded" />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-6 w-24 rounded" />
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="skeleton h-4 w-24 rounded" />
              <div className="skeleton h-4 w-32 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}