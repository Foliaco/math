'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useUser } from '../auth/context/useUser'
import { logout } from '../auth/actions/session';
import { useRouter } from 'next/navigation';
import { createFunction } from './actions/functions';
import { notify } from '../common/hook/useToast';

export const AdminPage = () => {
    const { user, exit: _exit } = useUser()
    const [loggingOut, setLoggingOut] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')
    const [formSuccess, setFormSuccess] = useState('')
    const [name, setName] = useState('')
    const [slugEs, setSlugEs] = useState('')
    const [slugEn, setSlugEn] = useState('')
    const [slugJa, setSlugJa] = useState('')
    const [latex, setLatex] = useState('')
    const [description, setDescription] = useState('')
    const [wikipediaUrl, setWikipediaUrl] = useState('')
    const router = useRouter()

    const exit = async () => {
        setLoggingOut(true)
        try {
            const { error } = await logout()
            if (error) {
                setFormError(`No se pudo cerrar la sesión: ${error.message}`)
                return
            }
            _exit()
            router.push('/')
        } catch {
            setFormError('Ocurrió un error inesperado al cerrar la sesión.')
        } finally {
            setLoggingOut(false)
        }
    }

    const submitFunction = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setSaving(true)
        setFormError('')
        setFormSuccess('')

        try {
            const result = await createFunction({ name, latex, description, wikipediaUrl, slugEs, slugEn, slugJa })
            if (!result.success) {
                setFormError(result.message)
                notify(result.message, 'error')
                return
            }

            setFormSuccess(`“${result.name}” se guardó como borrador.`)
            notify(`“${result.name}” se guardó como borrador.`, 'success')
            setName('')
            setSlugEs('')
            setSlugEn('')
            setSlugJa('')
            setLatex('')
            setDescription('')
            setWikipediaUrl('')
        } catch {
            setFormError('Ocurrió un error inesperado al guardar. Inténtalo de nuevo.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <main className="min-h-screen bg-base-100 px-4 py-8 sm:px-8">
            <div className="mx-auto w-full max-w-5xl">
                <header className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-base-300 pb-5">
                    <div>
                        <h1 className="mt-2 text-2xl font-semibold sm:text-3xl">Administración</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {user?.email && <span className="hidden text-sm text-base-content/70 sm:inline">{user.email}</span>}
                        <button onClick={exit} disabled={loggingOut} className="btn btn-ghost btn-sm">
                            {loggingOut && <span className="loading loading-spinner loading-xs" />}
                            Cerrar sesión
                        </button>
                    </div>
                </header>
            </div>

            <section className="grid gap-8 w-full max-w-5xl mx-auto lg:grid-cols-[minmax(0,1fr)_280px]">
                <div>
                    <div className="mb-6">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Editorial matemática</p>
                        <h2 className="mt-2 text-2xl font-semibold tracking-tight">Nueva entrada de la biblioteca</h2>
                        <p className="mt-2 max-w-2xl text-sm text-base-content/70">
                            Agrega la expresión y una descripción clara. La nueva entrada se guardará como borrador.
                        </p>
                    </div>

                    <form onSubmit={submitFunction} className="space-y-6 rounded-2xl border border-base-300 bg-base-200/70 p-5 shadow-xl shadow-black/10 sm:p-8">
                        <div className="form-control w-full">
                            <span className="div-text mb-2 font-medium">Nombre <span className="text-error">*</span></span>
                            <input
                                required
                                maxLength={120}
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                placeholder="Ej. Función zeta de Riemann"
                                className="input input-bordered w-full bg-base-100"
                            />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            <label className="form-control w-full">
                                <span className="div-text mb-2 font-medium">Slug español <span className="text-error">*</span></span>
                                <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={160} value={slugEs} onChange={(event) => setSlugEs(event.target.value)} placeholder="funcion-lineal" className="input input-bordered w-full bg-base-100" />
                            </label>
                            <label className="form-control w-full">
                                <span className="div-text mb-2 font-medium">Slug inglés <span className="text-error">*</span></span>
                                <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={160} value={slugEn} onChange={(event) => setSlugEn(event.target.value)} placeholder="linear-function" className="input input-bordered w-full bg-base-100" />
                            </label>
                            <label className="form-control w-full">
                                <span className="div-text mb-2 font-medium">Slug japonés <span className="text-error">*</span></span>
                                <input required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={160} value={slugJa} onChange={(event) => setSlugJa(event.target.value)} placeholder="ichiji-kansu" className="input input-bordered w-full bg-base-100" />
                            </label>
                        </div>

                        <div className="form-control w-full">
                            <span className="div-text mb-2 font-medium">Expresión LaTeX <span className="text-error">*</span></span>
                            <input
                                required
                                maxLength={2000}
                                value={latex}
                                onChange={(event) => setLatex(event.target.value)}
                                placeholder="Ej. \\zeta(s) = \\sum_{n=1}^{\\infty} \\frac{1}{n^s}"
                                className="input input-bordered w-full bg-base-100 font-mono"
                            />
                            <span className="div-text-alt mt-2 text-base-content/60">Escribe solo la expresión; no es necesario envolverla en signos de dólar.</span>
                        </div>

                        <div className="form-control w-full">
                            <span className="div-text mb-2 font-medium">Descripción <span className="text-error">*</span></span>
                            <textarea
                                required
                                maxLength={5000}
                                rows={5}
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="Describe qué representa, su dominio y sus propiedades principales."
                                className="textarea textarea-bordered w-full resize-y bg-base-100"
                            />
                            <span className="div-text-alt mt-1 self-end">{description.length}/5000</span>
                        </div>

                        <div className="form-control w-full">
                            <span className="div-text mb-2 font-medium">Artículo de Wikipedia <span className="text-base-content/50">(opcional)</span></span>
                            <input
                                type="url"
                                maxLength={2000}
                                value={wikipediaUrl}
                                onChange={(event) => setWikipediaUrl(event.target.value)}
                                placeholder="https://en.wikipedia.org/wiki/..."
                                className="input input-bordered w-full bg-base-100"
                            />
                        </div>

                        {formError && <div role="alert" className="alert alert-error py-3 text-sm">{formError}</div>}
                        {formSuccess && <div role="status" className="alert alert-success py-3 text-sm">{formSuccess}</div>}

                        <div className="flex justify-end border-t border-base-300 pt-5">
                            <button type="submit" disabled={saving} className="btn btn-primary min-w-40">
                                {saving ? <span className="loading loading-spinner loading-sm" /> : 'Guardar borrador'}
                            </button>
                        </div>
                    </form>
                </div>

                <aside className="h-fit rounded-2xl border border-primary/15 bg-primary/5 p-6">
                    <h3 className="font-semibold">Antes de guardar</h3>
                    <ul className="mt-4 space-y-3 text-sm text-base-content/70">
                        <li>Usa un nombre único y fácil de encontrar.</li>
                        <li>Incluye la expresión en formato LaTeX.</li>
                        <li>Explica su significado con tus propias palabras.</li>
                        <li>Las funciones nuevas comienzan como borrador.</li>
                    </ul>
                </aside>
            </section>
        </main >
    )
}
