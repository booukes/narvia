import { ref } from "vue"
import { supabase } from "@/supabase"

export function useDbOps() {
    const loading = ref(false)
    const error = ref(null)

    const hasUserStarted = async (retries = 3) => {
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        if (userError || !user) return false

        // Try multiple times with a small delay
        for (let i = 0; i < retries; i++) {
            const { data, error } = await supabase
                .from('profiles')
                .select('started')
                .eq('id', user.id)
                .maybeSingle()

            if (error) {
                console.error('Error checking started status:', error)
                if (i < retries - 1) {
                    // Wait a bit before retrying
                    await new Promise(resolve => setTimeout(resolve, 500))
                    continue
                }
                return false
            }

            if (data) {
                console.debug('User started:', user.id)
                console.debug('Started value:', !!data?.started)
                return !!data?.started
            }

            // Profile not found yet, wait and retry
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, 500))
            }
        }

        console.warn('Profile not found after retries')
        return false
    }

    return { hasUserStarted, loading, error }
}
