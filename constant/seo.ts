const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
const deploymentHost =
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL

export const siteUrl = new URL(
    configuredSiteUrl ||
        (deploymentHost ? `https://${deploymentHost}` : 'http://localhost:3000')
)

export function absoluteUrl(path: string) {
    return new URL(path, siteUrl).toString()
}
