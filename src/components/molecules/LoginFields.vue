<template>
  <div class="flex flex-col items-center text-zinc-300">
    <label class="m-1 text-sm uppercase tracking-wider text-zinc-400" for="email">email</label>
    <input
        name="email"
        class="border border-zinc-500/30 rounded-xl p-4 bg-zinc-100/5 mb-3
             focus:outline-pink-500/70 focus:outline-1
             focus:bg-zinc-100/10 w-80 h-12 placeholder-zinc-500
             transition-all duration-200"
        placeholder="eg. john.doe@mail.com"
        type="email"
    >

    <label class="m-1 text-sm uppercase tracking-wider text-zinc-400" for="password">password</label>
    <input
        name="password"
        class="border border-zinc-500/30 rounded-xl p-4 bg-zinc-100/5
             focus:outline-pink-500/70 focus:outline-1
             focus:bg-zinc-100/10 w-80 h-12 placeholder-zinc-500
             transition-all duration-200"
        placeholder="eg. qwerty123"
        type="password"
    >

    <button
        class="mx-auto bg-pink-500/30 hover:bg-pink-700/60 mt-6 mb-4 w-32 h-10 rounded-xl
             border border-pink-500/50 shadow-[0_0_10px_rgba(255,0,100,0.2)]
             hover:shadow-[0_0_15px_rgba(255,0,100,0.3)]
             text-zinc-200 font-semibold tracking-wide transition-all duration-300"
    >
      sign in
    </button>

    <a class="flex justify-center font-semibold my-1 mt-4 text-pink-500/70 hover:text-rose-700 transition-colors duration-200" href="/reset-password">
      trouble logging in?
    </a>
    <div class="w-48 h-[1px] mx-auto bg-pink-600/40 mt-2 mb-2"></div>
    <a class="flex justify-center font-semibold my-1 text-pink-500/70 hover:text-rose-700 transition-colors duration-200" href="/register">
      have no account yet?
    </a>
  </div>
</template>
