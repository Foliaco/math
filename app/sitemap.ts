import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/constant/seo'
import { createClient } from '@/supabase/server'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const client = await createClient()
    const functions = []

    for (let from = 0; ; from += 1000) {
        const { data, error } = await client
            .from('functions')
            .select('slug_es, slug_en, slug_ja, updated_at')
            .eq('status_publish', 'published')
            .range(from, from + 999)

        if (error) {
            console.error('Failed to generate sitemap:', error)
            throw new Error('No fue posible generar el sitemap.')
        }

        functions.push(...(data ?? []))
        if (!data || data.length < 1000) {
            break
        }
    }

    const functionPages = functions.flatMap((item) => {
        const localizedPaths = {
            es: `/functions/es/${item.slug_es}`,
            en: `/functions/en/${item.slug_en}`,
            ja: `/functions/ja/${item.slug_ja}`,
        }
        const languages = Object.fromEntries(
            Object.entries(localizedPaths).map(([language, path]) => [
                language,
                absoluteUrl(path),
            ])
        )

        return Object.values(localizedPaths).map((path) => ({
            url: absoluteUrl(path),
            lastModified: item.updated_at ?? undefined,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
            alternates: { languages },
        }))
    })

    return [
        {
            url: absoluteUrl('/'),
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...functionPages,
    ]
}
