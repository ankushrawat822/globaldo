import Link from 'next/link'
import { MapPin, Calendar, Clock, DollarSign, RefreshCw } from 'lucide-react'
import { Task } from '@/server/queries/tasks'
import { formatDistanceToNow, format } from 'date-fns'

interface TaskRowProps {
  task: Task
  variant?: 'default' | 'compact'
}

function getStatusBadge(status: Task['status']) {
  const variants: Record<Task['status'], { label: string; className: string }> = {
    open: { label: 'Open', className: 'bg-sun/10 text-sun border-sun/30' },
    in_progress: { label: 'In Progress', className: 'bg-pine/10 text-pine border-pine/30' },
    done: { label: 'Done', className: 'bg-stone/10 text-ink/70 border-stone/30' },
    closed: { label: 'Closed', className: 'bg-ink/10 text-ink/50 border-ink/20' },
    expired: { label: 'Expired', className: 'bg-ink/10 text-ink/50 border-ink/20' },
    hidden: { label: 'Hidden', className: 'bg-danger/10 text-danger border-danger/30' },
  }
  const v = variants[status]
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${v.className}`}>
      {v.label}
    </span>
  )
}

function getCompensationLabel(type: Task['compensation_type'], amount: number | null, currency: string = 'USD') {
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

export function TaskRow({ task, variant = 'default' }: TaskRowProps) {
  const isCompact = variant === 'compact'

  return (
    <Link href={`/tasks/${task.id}`} className="block task-row group">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Status marker + main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-ink truncate group-hover:text-pine transition-colors">
              {task.title}
            </h3>
            {getStatusBadge(task.status)}
          </div>

          <p className="text-sm text-ink/60 line-clamp-2 mb-2">{task.description}</p>

          <div className="flex flex-wrap items-center gap-2 text-sm text-ink/50">
            <span className="px-2 py-0.5 rounded bg-stone/50 text-stone">{task.category}</span>
            {task.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded bg-pine/10 text-pine text-xs">#{tag}</span>
            ))}
            {task.tags.length > 3 && (
              <span className="px-2 py-0.5 rounded bg-stone/50 text-stone text-xs">+{task.tags.length - 3} more</span>
            )}

            {task.location_mode === 'in_person' && task.city && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {task.city}, {task.country}
              </span>
            )}
            {task.location_mode === 'remote' && (
              <span className="flex items-center gap-1 text-pine">
                <RefreshCw className="w-3 h-3" />
                Remote
              </span>
            )}

            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {getCompensationLabel(task.compensation_type, task.amount, task.currency)}
            </span>

            {task.helpers_needed > 1 && (
              <span className="flex items-center gap-1">
                <span className="px-2 py-0.5 rounded bg-stone/50 text-stone text-xs">
                  {task.helpers_needed} helpers needed
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Deadline & meta */}
        {(task.deadline || !isCompact) && (
          <div className="flex flex-col items-end text-sm text-ink/50 whitespace-nowrap md:w-48 md:flex-none">
            {task.deadline && (
              <div className="flex items-center gap-1 mb-1">
                <Calendar className="w-3 h-3" />
                <span>{formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{format(new Date(task.created_at), 'MMM d')}</span>
            </div>
            {task.owner && (
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs">by @{task.owner.handle}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}