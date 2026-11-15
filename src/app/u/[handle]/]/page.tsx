import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Calendar, MapPin, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow, format } from 'date-fns'

interface ProfileData {
  id: string
  handle: string
  display_name: string
  avatar_url: string | null
  bio: string | null
  country: string
  is_admin: boolean
  created_at: string
  _count?: {
    tasks: number
    completed_tasks: number
    connections: number
  }
}

interface TaskData {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  location_mode: 'remote' | 'in_person'
  city: string | null
  country: string
  compensation_type: 'none' | 'paid' | 'swap'
  amount: number | null
  deadline: string | null
  helpers_needed: number
  status: 'open' | 'in_progress' | 'done' | 'closed' | 'expired' | 'hidden'
  created_at: string
  updated_at: string
  _count?: {
    offers: number
  }
}

async function getProfile(handle: string): Promise<ProfileData | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id, handle, display_name, avatar_url, bio, country, is_admin, created_at,
      tasks:tasks!profiles_tasks_owner_id_fkey(count),
      completed_tasks:tasks!profiles_tasks_owner_id_fkey(count),
      connections:connections!connections_owner_id_fkey(count)
    `)
    .eq('handle', handle)
    .single()

  if (error || !data) return null
  return data as unknown as ProfileData
}

async function getUserTasks(userId: string): Promise<TaskData[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      id, title, description, category, tags, location_mode, city, country,
      compensation_type, amount, deadline, helpers_needed, status, created_at, updated_at,
      offers:offers!offers_task_id_fkey(count)
    `)
    .eq('owner_id', userId)
    .neq('status', 'hidden')
    .order('created_at', { ascending: false })
    .limit(10)

  if (error || !data) return []
  return data as unknown as TaskData[]
}

function getStatusBadge(status: TaskData['status']) {
  const variants: Record<TaskData['status'], { label: string; className: string }> = {
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

function getCompensationLabel(type: TaskData['compensation_type'], amount: number | null, currency: string = 'USD') {
  switch (type) {
    case 'paid':
      return amount ? `$${amount} ${currency}` : 'Paid'
    case 'swap':
      return 'Skill swap'
    case 'none':
    default:
      return 'Free'
  }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const profile = await getProfile(handle)

  if (!profile) {
    notFound()
  }

  const tasks = await getUserTasks(profile.id)
  const openTasks = tasks.filter(t => t.status === 'open' || t.status === 'in_progress')
  const completedTasks = tasks.filter(t => t.status === 'done')

  return (
    <div className="max-w-3xl mx-auto py-12 space-y-8">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 border border-stone rounded-lg">
        <div className="relative w-24 h-24 flex-shrink-0">
          {profile.avatar_url ? (
            <Image
              src={profile.avatar_url}
              alt={profile.display_name}
              width={96}
              height={96}
              className="w-full h-full rounded-lg object-cover border border-stone"
            />
          ) : (
            <div className="w-full h-full rounded-lg bg-pine/10 flex items-center justify-center border border-stone">
              <span className="text-3xl font-heading font-semibold text-pine">
                {profile.display_name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <h1 className="text-2xl font-heading font-semibold text-ink">{profile.display_name}</h1>
            <span className="text-ink/60">@{profile.handle}</span>
            {profile.is_admin && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pine/10 text-pine border border-pine/30">
                Admin
              </span>
            )}
          </div>
          <p className="text-ink/70 text-sm mb-2">Member since {format(new Date(profile.created_at), 'MMMM yyyy')}</p>
          {profile.bio && <p className="text-ink/80 mt-2">{profile.bio}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 text-center p-4 border border-stone rounded-lg">
        <div>
          <p className="text-2xl font-heading font-semibold text-pine">{profile._count?.tasks || 0}</p>
          <p className="text-sm text-ink/60">Tasks Posted</p>
        </div>
        <div className="border-x border-stone">
          <p className="text-2xl font-heading font-semibold text-pine">{completedTasks.length}</p>
          <p className="text-sm text-ink/60">Completed</p>
        </div>
        <div>
          <p className="text-2xl font-heading font-semibold text-pine">{profile._count?.connections || 0}</p>
          <p className="text-sm text-ink/60">Connections</p>
        </div>
      </div>

      {/* Tasks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-heading font-semibold text-ink">Tasks</h2>
          <Link href={`/u/${handle}/tasks`}>
            <Button variant="secondary" size="sm">View All</Button>
          </Link>
        </div>

        {openTasks.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-ink/70 uppercase tracking-wide">Open & In Progress</h3>
            {openTasks.map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`} className="block p-4 border border-stone rounded-lg hover:border-pine/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-ink truncate">{task.title}</h3>
                      {getStatusBadge(task.status)}
                    </div>
                    <p className="text-sm text-ink/60 line-clamp-2">{task.description}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-ink/50">
                      <span className="px-2 py-0.5 rounded bg-stone/50 text-stone">{task.category}</span>
                      {task.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-pine/10 text-pine text-xs">#{tag}</span>
                      ))}
                      {task.location_mode === 'in_person' && task.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {task.city}, {task.country}
                        </span>
                      )}
                      {task.location_mode === 'remote' && (
                        <span className="flex items-center gap-1 text-pine">
                          <span>Remote</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <span>{getCompensationLabel(task.compensation_type, task.amount)}</span>
                      </span>
                    </div>
                  </div>
                  {task.deadline && (
                    <div className="flex flex-col items-end text-sm text-ink/50 whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {completedTasks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-ink/70 uppercase tracking-wide">Completed</h3>
            {completedTasks.slice(0, 5).map((task) => (
              <Link key={task.id} href={`/tasks/${task.id}`} className="block p-4 border border-stone rounded-lg hover:border-pine/50 transition-colors opacity-70">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-ink truncate">{task.title}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone/10 text-ink/70 border border-stone/30">
                        <CheckCircle className="w-3 h-3 mr-1" /> Done
                      </span>
                    </div>
                    <p className="text-sm text-ink/60 line-clamp-2">{task.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {tasks.length === 0 && (
          <div className="text-center py-12 border border-stone rounded-lg">
            <p className="text-ink/70">No tasks posted yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}