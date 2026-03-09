import { createClient } from '@/lib/supabase/server'
import { ZodSchema } from 'zod'

export type ActionState<T> = {
    data?: T
    error?: string
    status?: number
}

export async function handleAction<TInput, TOutput>(
    schema: ZodSchema<TInput>,
    data: TInput,
    handler: (data: TInput, userId: string) => Promise<TOutput>
): Promise<ActionState<TOutput>> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'AUTH_EXPIRED', status: 401 }
    }

    // 1. Validation Zod
    const result = schema.safeParse(data)
    if (!result.success) {
        return { error: 'INVALID_INPUT', status: 400 }
    }

    try {
        // 2. Logic Execution
        const output = await handler(result.data, user.id)
        return { data: output, status: 200 }
    } catch (err: any) {
        // 3. Log server-side only
        console.error('[SERVER_ACTION_ERROR]:', err)

        // 4. Sanitize return - allow specific known error codes to pass through
        const knownErrors = ['SLUG_TAKEN']
        if (knownErrors.includes(err.message)) {
            return { error: err.message, status: 400 }
        }

        return { error: 'INTERNAL_ERROR', status: 500 }
    }
}
