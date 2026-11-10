import type { Metadata } from 'next'
import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import { createClient } from '@/supabase/server'
import { absoluteUrl } from '@/constant/seo'

import 'katex/dist/katex.min.css'
import { PreviewAndTestCalculator } from './../../../../module/function/preview-and-test-calculator';

const languages = {
    es: {
        slugColumn: 'slug_es',
        titleColumn: 'name',
        descriptionColumn: 'description',
        label: 'Español',
        locale: 'es_ES',
        fallbackDescription: 'Definiciones y expresiones matemáticas.',
        expression: 'Expresión matemática',
        description: 'Descripción',
        back: 'Volver a la biblioteca',
    },
    en: {
        slugColumn: 'slug_en',
        titleColumn: 'name_en',
        descriptionColumn: 'description_en',
        label: 'English',
        locale: 'en_US',
        fallbackDescription: 'Definitions and mathematical expressions.',
        expression: 'Mathematical expression',
        description: 'Description',
        back: 'Back to the library',
    },
    ja: {
        slugColumn: 'slug_ja',
        titleColumn: 'name_jp',
        descriptionColumn: 'description_jp',
        label: '日本語',
        locale: 'ja_JP',
        fallbackDescription: '関数や方程式の定義と数式。',
        expression: '数式',
        description: '説明',
        back: 'ライブラリに戻る',
    },
} as const

type Language = keyof typeof languages

type PageProps = {
    params: Promise<{ lang: string; slug: string }>
}

const getFunction = cache(async (lang: Language, slug: string) => {
    const language = languages[lang]
    const client = await createClient()
    const { data, error } = await client
        .from('functions')
        .select(
            'name, name_en, name_jp, description, description_en, description_jp, latex, slug_es, slug_en, slug_ja, status_publish, js_code, variables'
        )
        .eq(language.slugColumn, slug)
        .eq('status_publish', 'published')
        .maybeSingle()

    if (error) {
        console.error('Failed to load function:', error)
        throw new Error('No fue posible cargar la función.')
    }

    return data
})

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang, slug } = await params
    const language = Object.hasOwn(languages, lang) ? languages[lang as Language] : undefined

    if (!language) {
        return {
            title: 'Function not found',
            robots: { index: false, follow: false },
        }
    }

    const data = await getFunction(lang as Language, slug)
    const title = data?.[language.titleColumn]
    if (!data || !title) {
        return {
            title: language.label,
            robots: { index: false, follow: false },
        }
    }

    const description = data[language.descriptionColumn]
        .replace(/[#*_`$]/g, '')
        .slice(0, 160)
    const canonical = `/functions/${lang}/${slug}`

    return {
        title,
        description: description || language.fallbackDescription,
        alternates: {
            canonical,
            languages: {
                es: absoluteUrl(`/functions/es/${data.slug_es}`),
                en: absoluteUrl(`/functions/en/${data.slug_en}`),
                ja: absoluteUrl(`/functions/ja/${data.slug_ja}`),
                'x-default': absoluteUrl(`/functions/es/${data.slug_es}`),
            },
        },
        openGraph: {
            type: 'article',
            locale: language.locale,
            alternateLocale: Object.values(languages)
                .filter((alternate) => alternate.locale !== language.locale)
                .map((alternate) => alternate.locale),
            title,
            description: description || language.fallbackDescription,
            url: canonical,
        },
        twitter: {
            card: 'summary',
            title,
            description: description || language.fallbackDescription,
        },
    }
}

export default async function FunctionPage({ params }: PageProps) {
    const { lang, slug } = await params
    const language = Object.hasOwn(languages, lang) ? languages[lang as Language] : undefined
    if (!language) {
        notFound()
    }

    const data = await getFunction(lang as Language, slug)
    if (!data) {
        notFound()
    }

    const name = data[language.titleColumn]
    const description = data[language.descriptionColumn]
    const alternateSlugs = [
        { lang: 'es', label: languages.es.label, slug: data.slug_es },
        { lang: 'en', label: languages.en.label, slug: data.slug_en },
        { lang: 'ja', label: languages.ja.label, slug: data.slug_ja },
    ]

    return (
        <main lang={lang} className="min-h-screen px-5 py-10 sm:px-8 sm:py-16">
            <article className="mx-auto max-w-3xl">
                <Link href="/" className="link link-hover text-sm text-primary">
                    ← {language.back}
                </Link>

                <header className="mt-8 border-b border-base-300 pb-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        {language.label}
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{name}</h1>
                    <nav aria-label="Idiomas" className="mt-4 flex flex-wrap gap-4 text-sm">
                        {alternateSlugs.map((alternate) => (
                            <Link
                                key={alternate.lang}
                                href={`/functions/${alternate.lang}/${alternate.slug}`}
                                lang={alternate.lang}
                                className={`link link-hover ${alternate.lang === lang ? 'font-semibold text-primary' : ''}`}
                            >
                                {alternate.label}
                            </Link>
                        ))}
                    </nav>
                </header>

                <section className="mt-8 rounded-sm border border-primary/15 bg-primary/5 p-5 sm:p-7">
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
                        {language.expression}
                    </h2>
                    <div className="formula-markdown py-4 overflow-x-auto">
                        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {`$$${data.latex}$$`}
                        </Markdown>
                    </div>
                </section>

                <section className="small-markdown mt-8">
                    <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">
                        {language.description}
                    </h2>
                    <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                        {description}
                    </Markdown>
                </section>
            </article>
            {
                (data.js_code && data.variables) &&
                <article className='mt-5'>
                    <PreviewAndTestCalculator
                        code={data.js_code}
                        variables={data.variables}
                        latex={data.latex}
                    />
                </article>
            }
        </main>
    )
}
