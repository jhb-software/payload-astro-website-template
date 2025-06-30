'use client'

import { Button, toast } from '@payloadcms/ui'
import React from 'react'

export const TriggerWebsiteDeploymentButton: React.FC = () => {
  const [isPending, startTransition] = React.useTransition()

  async function triggerDeployment() {
    startTransition(async () => {
      try {
        const response = await fetch(process.env.NEXT_PUBLIC_WEBSITE_VERCEL_DEPLOY_URL!)

        if (response.ok) {
          toast.success('Website-Bau erfolgreich gestartet')
        } else {
          toast.error('Fehler beim Starten des Website-Baus')
        }
      } catch (error) {
        console.error(error)
        toast.error('Fehler beim Starten des Website-Baus')
      }
    })
  }

  return (
    <div>
      <Button type="button" buttonStyle="pill" onClick={triggerDeployment}>
        Trigger Website Deployment
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="14"
          height="14"
          style={{ marginLeft: '8px', marginBottom: '2px' }}
        >
          <path
            fillRule="evenodd"
            d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z"
            clipRule="evenodd"
          />
        </svg>
        {isPending && '...'}
      </Button>
    </div>
  )
}
