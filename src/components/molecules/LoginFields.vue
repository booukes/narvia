<script setup>

</script>

<template>
  <div class="flex flex-col">
    <label class="m-1" for="email">email</label>
    <input name="email" class="border focus:outline-0 border-zinc-200/20 rounded-xl p-4 bg-zinc-200/5 mb-2 focus:bg-zinc-200/15 w-80 h-15" placeholder="eg. john.doe@mail.com" type="email">
    <label class="m-1" for="password">password</label>
    <input name="password" class="border focus:outline-0 border-zinc-200/20 rounded-xl p-4 bg-zinc-200/5  focus:bg-zinc-200/15 w-80 h-15" placeholder="eg. qwerty123" type="password">
    <button class="mx-auto bg-rose-950/60 hover:cursor-pointer mt-4 mb-4 w-32 h-8 rounded-xl border border-zinc-200/20">sign in</button>
    <a class="flex justify-center font-bold my-1 mt-4 text-rose-900" href="/reset-password">trouble logging in?</a>
    <div class="w-48 h-[1px] mx-auto bg-rose-800/50"></div>
    <a class="flex justify-center font-bold my-1 text-rose-900" href="/register">have no account yet?</a>

  </div>
</template>

<style scoped>

</style>