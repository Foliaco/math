'use server'

import { createClient } from '@/supabase/server'

export type CreateFunctionInput = {
    name: string
    latex: string
    description: string
    wikipediaUrl: string
    slugEs: string
    slugEn: string
    slugJa: string
}

export type CreateFunctionResult =
    | { success: true; name: string }
    | { success: false; message: string }

export async function createFunction(input: CreateFunctionInput): Promise<CreateFunctionResult> {
    const name = input.name.trim()
    const latex = input.latex.trim()
    const description = input.description.trim()
    const wikipediaUrl = input.wikipediaUrl.trim()
    const slugEs = input.slugEs.trim()
    const slugEn = input.slugEn.trim()
    const slugJa = input.slugJa.trim()

    if (!name || !latex || !description) {
        return { success: false, message: 'Completa el nombre, la expresión y la descripción.' }
    }

    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
    if (![slugEs, slugEn, slugJa].every((slug) => slugPattern.test(slug))) {
        return { success: false, message: 'Cada slug debe usar minúsculas, números y guiones.' }
    }

    if (wikipediaUrl) {
        try {
            const url = new URL(wikipediaUrl)
            if (
                url.protocol !== 'https:' ||
                (url.hostname !== 'wikipedia.org' && !url.hostname.endsWith('.wikipedia.org'))
            ) {
                return { success: false, message: 'Ingresa una URL válida de Wikipedia.' }
            }
        } catch {
            return { success: false, message: 'Ingresa una URL válida de Wikipedia.' }
        }
    }

    const client = await createClient()
    const { data: { user }, error: authError } = await client.auth.getUser()

    if (authError || !user) {
        return { success: false, message: 'Tu sesión expiró. Inicia sesión nuevamente.' }
    }

    const { error } = await client.from('functions').insert({
        name,
        latex,
        description,
        slug_es: slugEs,
        slug_en: slugEn,
        slug_ja: slugJa,
        wikipedia_url: wikipediaUrl || null,
        created_by: user.id,
    })

    if (error) {
        if (error.code === '23505') {
            return {
                success: false,
                message: 'Ya existe una función con ese nombre, expresión o slug.',
            }
        }

        console.error('Failed to create function:', error)
        return { success: false, message: 'No se pudo guardar la función. Inténtalo de nuevo.' }
    }

    return { success: true, name }
}
