import { websiteName } from '@/payload.config'
import { Gutter } from '@payloadcms/ui'
import type { AdminViewServerProps } from 'payload'
import React from 'react'
import { TriggerWebsiteDeploymentButton } from '../TriggerWebsiteDeploymentButton'
import { WebsiteLink } from '../WebsiteLink'

export const DashboardView: React.FC<AdminViewServerProps> = () => {
  return (
    <Gutter>
      <h1>{websiteName} Website CMS</h1>
      <br />
      <WebsiteLink />

      <h2 style={{ marginTop: '40px', marginBottom: '10px' }}>Rebuild Website</h2>

      <p>
        Because the website is static for performance reasons, any content changes in the CMS
        require a new publication, which rebuilds the website with the content currently published
        in the CMS. The creation process typically takes 1-2 minutes.
      </p>
      <TriggerWebsiteDeploymentButton />
    </Gutter>
  )
}
