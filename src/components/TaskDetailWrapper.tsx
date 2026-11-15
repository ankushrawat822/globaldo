'use client'

import { useState } from 'react'
import { Task } from '@/server/queries/tasks'
import { OfferHelpModal } from '@/components/ui/offer-help-modal'

export default function TaskDetailWrapper({
  task,
  children
}: {
  task: Task;
  children: React.ReactNode
}) {
  const [showOfferModal, setShowOfferModal] = useState(false)

  return (
    <>
      {/* We pass a trigger function to the children or just handle it via a button here */}
      {/* To keep it simple, I'll modify TaskDetailContent to accept a trigger or use a context */}
      {children}
      {showOfferModal && (
        <OfferHelpModal
          task={task}
          onClose={() => setShowOfferModal(false)}
        />
      )}
      <button
        onClick={() => setShowOfferModal(true)}
        className="fixed bottom-8 right-8 p-4 bg-pine text-white rounded-full shadow-lg hover:bg-pine/90 transition-colors z-40"
        style={{ display: task.status === 'open' ? 'flex' : 'none' }}
      >
        Offer Help
      </button>
    </>
  )
}