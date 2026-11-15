'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Flag } from 'lucide-react'
import { ReportModal } from '@/components/ui/report-modal'

export default function ReportTaskButton({ taskId }: { taskId: string }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
        <Flag className="w-4 h-4 mr-1" />
        Report
      </Button>
      {open && (
        <ReportModal
          targetType="task"
          targetId={taskId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}