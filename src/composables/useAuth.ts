import { ref, onMounted } from "vue"
import { supabase } from "@/supabase"

const user = ref(null)
const loading = ref(false)
const error = ref<string | null>(null)


export function useAuth() {
    const signUp = async (email: string, password: string, username: string) => {
        loading.value = true
        error.value = null

        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { username },
            },
        })

        loading.value = false

        if (signUpError) {
            error.value = signUpError.message
            return { data: null, error: signUpError }
        }

        user.value = data.user
        return { data, error: null }
    }

    const signIn = async (email: string, password: string) => {
        loading.value = true
        error.value = null

        console.log("EMAIL:", email)
        console.log("PASSWORD:", password)

        const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        loading.value = false

        if (signInError) {
            console.error("Supabase login error:", signInError.message)
            error.value = signInError.message
            return { data: null, error: signInError }
        }

        user.value = data.user
        return { data, error: null } // ✅ the magic line
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        user.value = null
    }

    onMounted(async () => {
        const { data } = await supabase.auth.getUser()
        user.value = data.user
    })

    supabase.auth.onAuthStateChange((_event, session) => {
        user.value = session?.user ?? null
    })

    return { user, loading, error, signUp, signIn, signOut }
}
