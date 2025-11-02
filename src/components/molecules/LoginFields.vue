<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth.js'
import {useDbOps} from "@/composables/useDbOps.js";
import {useRouter} from "vue-router";

const emit = defineEmits(['switchMode', 'start'])

const email = ref('')
const password = ref('')

const router = useRouter()

const { signIn, loading, error } = useAuth()
const { hasUserStarted } = useDbOps()


const handleLogin = async () => {
  const { data, error } = await signIn(email.value, password.value)

  console.log('SIGNIN DATA:', data)
  console.log('SIGNIN ERROR:', error)

  if (error) {
    console.error('Login failed:', error)
    return
  }

  await new Promise(resolve => setTimeout(resolve, 300))

  const started = await hasUserStarted()
  console.log('Started check result:', started)

  if (!started) emit("start")
  else router.push('/dashboard')
}


</script>
<template>
  <div class="flex flex-col items-center text-zinc-300 w-full px-2 sm:px-4">
    <!-- Email -->
    <label class="mt-2 mb-1 text-xs sm:text-sm uppercase tracking-wide text-zinc-400 self-start" for="email">
      email
    </label>
    <input
        name="email"
        v-model="email"
        class="border border-zinc-500/30 rounded-xl p-3 bg-zinc-100/5 mb-3
             focus:outline-pink-500/70 focus:outline-1
             focus:bg-zinc-100/10 w-full placeholder-zinc-500
             transition-all duration-200 text-sm sm:text-base"
        placeholder="eg. john.doe@mail.com"
        type="email"
    />

    <!-- Password -->
    <label class="mt-1 mb-1 text-xs sm:text-sm uppercase tracking-wide text-zinc-400 self-start" for="password">
      password
    </label>
    <input
        name="password"
        v-model="password"
        class="border border-zinc-500/30 rounded-xl p-3 bg-zinc-100/5
             focus:outline-pink-500/70 focus:outline-1
             focus:bg-zinc-100/10 w-full placeholder-zinc-500
             transition-all duration-200 text-sm sm:text-base"
        placeholder="eg. qwerty123"
        type="password"
    />
    <p v-if="error" class="rounded-sm border border-red-500 mt-8 p-1 bg-red-500/20 text-red-400 text-sm">
      {{ error }}
    </p>
    <!-- Sign In Button -->
    <button
        class="mx-auto bg-pink-500/40 hover:bg-pink-700/60 mt-6 mb-4 w-full sm:w-40 h-10 sm:h-11 rounded-xl
             border border-pink-500/50 shadow-[0_0_10px_rgba(255,0,100,0.2)]
             hover:shadow-[0_0_15px_rgba(255,0,100,0.3)]
             text-zinc-200 font-semibold tracking-wide transition-all duration-300 text-sm cursor-pointer sm:text-base"
        @click="handleLogin"
    >
      {{ loading ? 'signing in...' : 'sign in' }}
    </button>


    <!-- Links -->
    <a
        class="flex justify-center font-semibold my-2 text-pink-500/70 hover:text-pink-500
             transition-colors duration-200 text-sm sm:text-base cursor-pointer"
        href="/reset-password"
    >
      trouble logging in?
    </a>

    <div class="w-32 sm:w-40 h-[1px] mx-auto bg-pink-600/40 mt-2 mb-2"></div>

    <a
        class="flex justify-center font-semibold my-1 text-pink-500/70 hover:text-pink-500
             transition-colors duration-200 text-sm sm:text-base cursor-pointer"

        @click.prevent="emit('switchMode')"
    >
      have no account yet?
    </a>
  </div>
</template>