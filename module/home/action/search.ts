'use server'
import { createClient } from '@/supabase/server';

export const searchFunction = async (query: string) => {
    const client = await createClient()
    const { data, error } = await client.rpc('search_functions', { search_query: query })
    return { data, error }
}


export type SearchFunctionResult = NonNullable<Awaited<ReturnType<typeof searchFunction>>['data']>