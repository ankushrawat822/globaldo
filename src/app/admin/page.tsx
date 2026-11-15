import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getReports, getReportedTasks, getSuspendedUsers } from '@/server/queries/admin'
import { unsuspendUser, resolveReport } from '@/server/actions/trust'
import { Flag, XCircle, Shield, Ban } from 'lucide-react'
import { formatDistanceToNow, format } from 'date-fns'
import Link from 'next/link'

async function AdminContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!profile?.is_admin) {
    redirect('/')
  }

  const [reports, reportedTasks, suspendedUsers] = await Promise.all([
    getReports(),
    getReportedTasks(),
    getSuspendedUsers(),
  ])

  return (
    <div className="max-w-6xl mx-auto py-12 space-y-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-pine">Admin Dashboard</h1>
          <p className="text-ink/70 mt-1">Review reports and manage moderation</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-ink/60">
          <Shield className="w-4 h-4 text-pine" />
          Signed in as admin
        </div>
      </header>

      {/* Reports Queue */}
      <section>
        <h2 className="text-xl font-heading font-semibold text-ink mb-4 flex items-center gap-2">
          <Flag className="w-5 h-5 text-sun" />
          Reports Queue ({reports.length})
        </h2>
        {reports.length > 0 ? (
          <div className="space-y-3 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-ink/60 border-b border-stone">
                  <th className="pb-2">Reported</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Reason</th>
                  <th className="pb-2">Reporter</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-stone/50">
                    <td className="py-3 text-sm text-ink/60">
                      {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-stone/50 text-stone text-xs capitalize">
                        {report.target_type}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-ink">
                      <span className="px-2 py-0.5 rounded bg-sun/10 text-sun text-xs capitalize">
                        {report.reason}
                      </span>
                    </td>
                    <td className="py-3 text-sm text-ink/70">
                      @{report.reporter?.handle}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        report.status === 'open' ? 'bg-sun/10 text-sun border-sun/30 border' :
                        report.status === 'reviewed' ? 'bg-pine/10 text-pine border-pine/30 border' :
                        'bg-stone/10 text-ink/70 border-stone/30 border'
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <form onSubmit={async (e) => {
                        e.preventDefault()
                        const formData = new FormData()
                        formData.append('report_id', report.id)
                        await resolveReport(formData)
                        // Refresh page would be needed in real app, for now just reload
                        window.location.reload()
                      }}>
                        <input type="hidden" name="report_id" value={report.id} />
                        <Button type="submit" variant="secondary" size="sm" className="w-full">
                          Mark Actioned
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state py-8 border border-stone rounded-lg text-center">
            <Flag className="w-12 h-12 mx-auto text-ink/30 mb-3" />
            <p className="text-lg text-ink/70">No reports in queue.</p>
          </div>
        )}
      </section>

      {/* Hidden Tasks */}
      <section>
        <h2 className="text-xl font-heading font-semibold text-ink mb-4 flex items-center gap-2">
          <XCircle className="w-5 h-5 text-danger" />
          Hidden Tasks ({reportedTasks.length})
        </h2>
        {reportedTasks.length > 0 ? (
          <div className="space-y-3">
            {reportedTasks.map((task) => (
              <div key={task.id} className="p-4 border border-stone rounded-lg bg-white flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <Link href={`/tasks/${task.id}`} className="font-medium text-ink hover:text-pine truncate block">
                    {task.title}
                  </Link>
                  <p className="text-sm text-ink/60 mt-1">by @{task.owner?.handle}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-danger/10 text-danger border border-danger/30">
                  Hidden
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state py-8 border border-stone rounded-lg text-center">
            <XCircle className="w-12 h-12 mx-auto text-ink/30 mb-3" />
            <p className="text-lg text-ink/70">No hidden tasks.</p>
          </div>
        )}
      </section>

      {/* Suspended Users */}
      <section>
        <h2 className="text-xl font-heading font-semibold text-ink mb-4 flex items-center gap-2">
          <Ban className="w-5 h-5 text-danger" />
          Suspended Users ({suspendedUsers.length})
        </h2>
        {suspendedUsers.length > 0 ? (
          <div className="space-y-3">
            {suspendedUsers.map((u) => (
              <div key={u.id} className="p-4 border border-stone rounded-lg bg-white flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pine/10 flex items-center justify-center text-pine font-bold">
                    {u.display_name?.[0] || u.handle?.[0] || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-ink">{u.display_name} (@{u.handle})</p>
                    <p className="text-sm text-ink/60">Suspended on {format(new Date(u.created_at), 'MMM d, yyyy')}</p>
                  </div>
                </div>
                <form onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData()
                    formData.append('target_id', u.id)
                    await unsuspendUser(formData)
                    window.location.reload()
                  }}>
                  <input type="hidden" name="target_id" value={u.id} />
                  <Button type="submit" variant="secondary" size="sm">
                    Unsuspend
                  </Button>
                </form>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state py-8 border border-stone rounded-lg text-center">
            <Ban className="w-12 h-12 mx-auto text-ink/30 mb-3" />
            <p className="text-lg text-ink/70">No suspended users.</p>
          </div>
        )}
      </section>
    </div>
  )
}

function AdminSkeleton() {
  return (
    <div className="max-w-6xl mx-auto py-12 space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="skeleton h-10 w-48 rounded" />
          <div className="skeleton h-5 w-64 rounded" />
        </div>
        <div className="skeleton h-10 w-32 rounded" />
      </div>
      <div className="skeleton h-8 w-48 rounded mb-4" />
      <div className="skeleton h-40 rounded-lg border border-stone" />
      <div className="skeleton h-8 w-48 rounded mb-4" />
      <div className="skeleton h-40 rounded-lg border border-stone" />
      <div className="skeleton h-8 w-48 rounded mb-4" />
      <div className="skeleton h-40 rounded-lg border border-stone" />
    </div>
  )
}

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminContent />
    </Suspense>
  )
}