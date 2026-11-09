
'use client'

import { useState, useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import { Typewriter } from '@/module/common/components/type-write'
import { useUser } from '@/module/auth/context/useUser'
import { notify } from '@/module/common/hook/useToast'
import { FiArrowUpRight, FiBookOpen, FiSearch } from 'react-icons/fi'
import 'katex/dist/katex.min.css'
import { searchFunction, type SearchFunctionResult } from './../action/search'


const arrayQuestions = [
    'Función cuadrática',
    'Función general',
    'Ecuaciones diferenciales',
    'Hallar el área de un círculo',
    'Hallar el volumen de un cilindro',
    'Calcular el volumen de un cono',
    'Como calcular el área de un triángulo',
    'Hipotenusa de un triángulo rectángulo',
]

const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * arrayQuestions.length)
    return arrayQuestions[randomIndex]
}

export const MainContent = () => {
    const { user } = useUser()
    const [value, setValue] = useState('')
    const [result, setResult] = useState<SearchFunctionResult>([])
    const [valueRandom, setValueRandom] = useState(getRandomQuestion())
    const randomQuestionRef = useRef(valueRandom)
    const [loadingSearch, setLoadingSearch] = useState(false);


    useEffect(() => {
        const interval = setInterval(() => {
            const nextQuestion = getRandomQuestion()
            randomQuestionRef.current = nextQuestion
            setValueRandom(nextQuestion)
        }, 5000)

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.shiftKey && event.key === 'Tab') {
                setValue(randomQuestionRef.current)
                clearInterval(interval)
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        return () => {
            clearInterval(interval)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])


    const search = async () => {
        if (!value) return
        setLoadingSearch(true)
        const result = await searchFunction(value)
        if (result.error) {
            console.error('Error searching functions:', result.error)
            setLoadingSearch(false)
            notify('No fue posible consultar la biblioteca. Inténtalo de nuevo.', 'error')
            return
        }
        setResult(result.data!)
        setLoadingSearch(false)
    }


    return (
        <main className="w-full max-w-6xl px-5 pb-16 pt-16 sm:px-8 sm:pt-20 lg:pt-24">
            <section className="mx-auto max-w-3xl text-center">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Biblioteca matemática
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-base-content sm:text-5xl">
                    {user ? `Hola ${user.email?.split('@')[0]}.` : 'Explora las matemáticas.'}
                    <span className="block text-base-content/60"><Typewriter text="Una búsqueda, una definición clara." speed={42} delay={180} /></span>
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-base-content/60 sm:text-base">
                    Consulta funciones, identidades y ecuaciones con expresiones legibles y explicaciones pensadas para estudiar.
                </p>
            </section>

            <section className="mx-auto mt-9 max-w-3xl">
                <form onSubmit={(event) => { event.preventDefault(); void search() }} className="rounded-2xl border border-base-300 bg-base-200/70 p-2 shadow-xl shadow-black/10 sm:flex sm:items-center">
                    <label className="sr-only" htmlFor="math-search">Buscar una función o ecuación</label>
                    <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
                        <FiSearch className="shrink-0 text-primary" aria-hidden="true" />
                        <input id="math-search" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Busca una función o ecuación..." className="input min-w-0 flex-1 border-0 bg-transparent px-0 text-base focus:outline-none" />
                    </div>
                    <button type="submit" className="btn btn-primary mt-2 w-full rounded-xl sm:mt-0 sm:w-auto" disabled={loadingSearch}>
                        {loadingSearch ? <span className="loading loading-spinner loading-sm" /> : 'Buscar'}
                    </button>
                </form>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-base-content/60">
                    <span>Sugerencia:</span>
                    <button type="button" className="link link-hover text-primary" onClick={() => setValue(valueRandom)}>{valueRandom}</button>
                    <span className="hidden sm:inline">·</span><span className="hidden sm:inline">También puedes pulsar Shift + Tab</span>
                </div>
            </section>

            <section className="mx-auto mt-12 max-w-4xl" aria-live="polite">
                {loadingSearch && <div className="flex flex-col items-center gap-3 py-16 text-center"><span className="loading loading-ring loading-lg text-primary" /><p className="text-sm text-base-content/60">Consultando la biblioteca...</p></div>}
                {!loadingSearch && !value && <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/30 px-6 py-14 text-center"><FiBookOpen className="mx-auto mb-4 text-4xl text-primary/60" /><h3 className="text-lg font-semibold">Comienza tu consulta</h3><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-base-content/60">Escribe el nombre de una función, una ecuación o un concepto geométrico para encontrar una ficha de estudio.</p></div>}
                {!loadingSearch && value && result.length === 0 && <div className="rounded-2xl border border-base-300 bg-base-200/30 px-6 py-14 text-center"><h3 className="text-lg font-semibold">No encontramos coincidencias</h3><p className="mt-2 text-sm text-base-content/60">Prueba con otro término, por ejemplo “función cuadrática” o “hipotenusa”.</p></div>}
                {!loadingSearch && result.length > 0 && <div className="mb-5 flex items-end justify-between border-b border-base-300 pb-3"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Resultados</p><h3 className="mt-1 text-xl font-semibold">Hallazgos para tu consulta</h3></div><span className="badge badge-ghost">{result.length} {result.length === 1 ? 'entrada' : 'entradas'}</span></div>}
                {!loadingSearch && result.map((item, index) => (
                    <article key={`${item.name}-${index}`} className="mb-5 overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-lg shadow-black/5 transition hover:border-primary/40">
                        <div className="border-b border-base-300 px-5 py-4 sm:px-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-base-content/50">Entrada {String(index + 1).padStart(2, '0')}</p><h3 className="mt-1 text-xl font-semibold">{item.name}</h3></div>{item.wikipedia_url && <a href={item.wikipedia_url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm gap-1 text-primary">Referencia <FiArrowUpRight aria-hidden="true" /></a>}</div></div>
                        <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_1.2fr]">
                            <div className="rounded-xl border border-primary/15 bg-primary/5 p-5"><p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">Expresión matemática</p><div className="formula-markdown"><Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{`$$${item.latex}$$`}</Markdown></div></div>
                            <div className="small-markdown"><p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-base-content/50">Descripción</p><Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{item.description.substring(0, 700) + (item.description.length > 700 ? '...' : '')}</Markdown></div>
                        </div>
                    </article>
                ))}
            </section>
        </main>
    )
}
