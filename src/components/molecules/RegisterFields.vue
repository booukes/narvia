<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth.js'

const emit = defineEmits(['switchMode'])

const username = ref('')
const email = ref('')
const password = ref('')

const { signUp, loading, error } = useAuth()

const handleRegister = async () => {
  await signUp(email.value, password.value, username.value)

  // only switch after successful signup
  if (!error.value) {
    emit('switchMode')
  }
}
</script>

<template>
  <div class="flex flex-col items-center text-zinc-300 w-full px-2 sm:px-4">
    <!-- Username -->
    <label class="mt-2 mb-1 text-xs sm:text-sm uppercase tracking-wide text-zinc-400 self-start" for="username">
      username
    </label>
    <input
        v-model="username"
        name="username"
        class="border border-zinc-500/30 rounded-xl p-3 bg-zinc-100/5 mb-3
             focus:outline-pink-500/70 focus:outline-1
             focus:bg-zinc-100/10 w-full placeholder-zinc-500
             transition-all duration-200 text-sm sm:text-base"
        placeholder="eg. apCarPhoto"
        type="text"
    />

    <!-- Email -->
    <label class="mt-2 mb-1 text-xs sm:text-sm uppercase tracking-wide text-zinc-400 self-start" for="email">
      email
    </label>
    <input
        v-model="email"
        name="email"
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
        v-model="password"
        name="password"
        class="border border-zinc-500/30 rounded-xl p-3 bg-zinc-100/5
             focus:outline-pink-500/70 focus:outline-1
             focus:bg-zinc-100/10 w-full placeholder-zinc-500
             transition-all duration-200 text-sm sm:text-base"
        placeholder="eg. qwerty123"
        type="password"
    />

    <!-- Register button -->
    <button
        class="mx-auto bg-pink-500/40 hover:bg-pink-700/60 mt-6 mb-4 w-full sm:w-40 h-10 sm:h-11 rounded-xl
             border border-pink-500/50 shadow-[0_0_10px_rgba(255,0,100,0.2)]
             hover:shadow-[0_0_15px_rgba(255,0,100,0.3)]
             text-zinc-200 font-semibold tracking-wide transition-all duration-300 text-sm sm:text-base cursor-pointer"
        :disabled="loading"
        @click="handleRegister"
    >
      {{ loading ? 'registering...' : 'register' }}
    </button>

    <!-- Error message -->
    <p v-if="error" class="text-red-400 text-sm mb-2">{{ error }}</p>

    <div class="w-32 sm:w-40 h-[1px] mx-auto bg-pink-600/40 mt-2 mb-2"></div>

    <a
        class="flex justify-center font-semibold my-1 text-pink-500/70 hover:text-rose-700
             transition-colors duration-200 text-sm sm:text-base cursor-pointer"
        @click="emit('switchMode')"
    >
      have an account already?
    </a>
  </div>
</template>
