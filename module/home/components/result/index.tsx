import React from 'react'
import { BiCopy } from 'react-icons/bi';
import { FiArrowUpRight } from 'react-icons/fi';
import Markdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { useToast } from '@/module/common/hook/useToast';
import Link from 'next/link';
import { MdOpenInNew } from 'react-icons/md';
import { useLanguage } from './../../../lang/language';



type Props = {
    item: {
        description: string;
        id: number;
        latex: string;
        name: string;
        relevance: number;
        slug_es: string;
        slug_en: string;
        slug_ja: string;
    }
    index: number;
}

export const Result = ({ item, index }: Props) => {
    const { language } = useLanguage()
    const show = useToast()

    const copyToClipboard = async () => {
        await navigator.clipboard.writeText(item.latex)
        show.openToast('Copiado al portapapeles', 'success')
    }

    return (
        <article className="mb-5 overflow-hidden rounded-sm border border-base-300 bg-base-100 shadow-lg shadow-black/5 transition hover:border-primary/40">
            <div className="border-b border-base-300 px-5 py-4 sm:px-7">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-base-content/50">Entrada {String(index + 1).padStart(2, '0')}</p>
                        <Link href={`/functions/${language}/${language === 'es' ? item.slug_es : language === 'en' ? item.slug_en :  item.slug_ja}`} className="mt-1 hover:underline hover:text-primary  flex items-center gap-2" target="_blank">
                            <h3 className="text-xl font-semibold">{item.name}</h3>
                            <MdOpenInNew size={15} />
                        </Link>
                        <dl className="mt-3 flex gap-x-2 gap-y-1 text-xs text-base-content/60 ">
                            Ver en:
                            <div><Link href={`/functions/es/${item.slug_es}`} target="_blank" className="inline transition hover:text-secondary font-semibold">Español</Link></div>
                            <div><Link href={`/functions/en/${item.slug_en}`} target="_blank" className="inline transition hover:text-secondary font-semibold">English</Link></div>
                            <div><Link href={`/functions/ja/${item.slug_ja}`} target="_blank" className="inline transition hover:text-secondary font-semibold">日本語</Link></div>
                        </dl>
                    </div>
                </div>
            </div>
            <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_1.2fr]">
                <div className="rounded-sm border border-primary/15 bg-primary/5 p-5  relative">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">Expresión matemática</p>
                    <button className="absolute right-1 top-1 btn btn-circle btn-ghost" onClick={copyToClipboard} ><BiCopy /></button>
                    <div className="formula-markdown">
                        <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{`$$${item.latex}$$`}</Markdown>
                    </div>
                </div>
                <div className="small-markdown">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">Descripción</p>
                    <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{item.description.substring(0, 700) + (item.description.length > 700 ? '...' : '')}</Markdown>
                </div>
            </div>
        </article>
    )
}
