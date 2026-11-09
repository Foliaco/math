'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useUser } from '../auth/context/useUser'
import { logout } from '../auth/actions/session';
import { useRouter } from 'next/navigation';
import { createFunction } from './actions/functions';

export const AdminPage = () => {
    const { user, exit: _exit } = useUser()
    const [loggingOut, setLoggingOut] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formError, setFormError] = useState('')
    const [formSuccess, setFormSuccess] = useState('')
    const [name, setName] = useState('')
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
            const result = await createFunction({ name, latex, description, wikipediaUrl })
            if (!result.success) {
                setFormError(result.message)
                return
            }

            setFormSuccess(`“${result.name}” se guardó como borrador.`)
            setName('')
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
                        <p className="text-sm font-medium text-primary">Biblioteca matemática</p>
                        <h2 className="mt-1 text-xl font-semibold">Crear una función</h2>
                        <p className="mt-2 max-w-2xl text-sm text-base-content/70">
                            Agrega la expresión y una descripción clara. La nueva entrada se guardará como borrador.
                        </p>
                    </div>

                    <form onSubmit={submitFunction} className="space-y-5 rounded-lg border border-base-300 bg-base-200 p-5 sm:p-7">
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

                <aside className="h-fit rounded-lg border border-base-300 bg-base-200 p-5">
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
