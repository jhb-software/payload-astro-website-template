import { withPayload } from '@payloadcms/next/withPayload'
import { NextConfig } from 'next'

const nextConfig: NextConfig = {
  agentRules: false,
  redirects: async () => [
    {
      source: '/',
      destination: '/admin',
      permanent: true,
    },
  ],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
