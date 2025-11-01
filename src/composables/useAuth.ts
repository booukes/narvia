import {ref, onMounted} from "vue";
import {supabase} from "@/supabase";

const user = ref(null)

export function useAuth() {
    const loading = ref(false)
    const error = ref<string|null>(null)

    const signUp = async (email: string, password: string, username: string) => {
        loading.value = true
        error.value = null

        const {data, error: signUpError} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username: username
                }
            }
        })

        if (signUpError) {
            error.value = signUpError.message
            loading.value = false
            return
        }

        user.value = data.user
        loading.value = false
    }

     const signIn  = async (email: string, password: string) => {
         loading.value = true
         error.value = null

         console.log('EMAIL:', email)
         console.log('PASSWORD:', password)

         const {data, error: signInError} = await supabase.auth.signInWithPassword({email, password})
         if (signInError) {
             console.error("Supabase login error:", signInError.message) // 👀 see the exact message
             error.value = signInError.message
             loading.value = false
             return
         }
         user.value = data.user
         loading.value = false
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