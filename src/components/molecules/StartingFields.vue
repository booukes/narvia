<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/supabase'

const emit = defineEmits(['profileComplete'])

const full_name = ref('')
const bio = ref('')
const avatar_url = ref('')
const location = ref('')
const website = ref('')
const instagram = ref('')
const avatar_file = ref<File | null>(null)
const preview_url = ref('')

const loading = ref(false)
const error = ref<string | null>(null)

/** 🖼️ Handle file selection and preview */
const handleAvatarChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  avatar_file.value = file
  preview_url.value = URL.createObjectURL(file)
}

/** ☁️ Upload avatar to Supabase Storage and return its public URL */
const uploadAvatar = async (userId: string) => {
  if (!avatar_file.value) return avatar_url.value // if no new avatar picked, skip

  const fileExt = avatar_file.value.name.split('.').pop()
  const fileName = `${userId}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, avatar_file.value, { upsert: true })

  if (uploadError) throw uploadError

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
  return data.publicUrl
}

/** 💾 Save full profile */
const handleSubmit = async () => {
  loading.value = true
  error.value = null

  try {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError) throw userError
    if (!user) throw new Error('Not logged in.')

    // Upload avatar (if any)
    const uploadedAvatarUrl = await uploadAvatar(user.id)
    if (uploadedAvatarUrl) avatar_url.value = uploadedAvatarUrl

    // Ensure profile exists
    const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

    if (fetchError) throw new Error('Profile not found. Please contact support.')

    // Update profile
    const { data: updateData, error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: full_name.value,
          bio: bio.value,
          avatar_url: avatar_url.value,
          location: location.value,
          website: website.value,
          instagram: instagram.value,
          started: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()

    if (updateError) throw updateError
    if (!updateData || updateData.length === 0) throw new Error('Update failed - no rows affected')

    emit('profileComplete')
  } catch (err: any) {
    console.error(err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
      class="flex flex-col justify-between items-center text-zinc-300 w-full h-full px-2 sm:px-4 py-4 overflow-y-auto"
  >
    <div class="flex flex-col w-full max-w-md flex-grow">
      <h2 class="text-lg sm:text-xl font-semibold font-serif text-pink-400/80 mt-12 mb-4 self-center">
        Complete your profile
      </h2>

      <!-- 🧑 Avatar Upload -->
      <div class="flex flex-col items-center mb-6">
        <label
            for="avatar-upload"
            class="relative w-24 h-24 rounded-full overflow-hidden border border-pink-400/40 cursor-pointer group"
        >
          <img
              v-if="preview_url || avatar_url"
              :src="preview_url || avatar_url"
              alt="Avatar preview"
              class="w-full h-full object-cover transition-all duration-300 group-hover:brightness-75"
          />
          <div
              v-else
              class="w-full h-full flex items-center justify-center text-zinc-400 bg-zinc-900/40 group-hover:bg-zinc-800/60 transition-all"
          >
            <span class="text-sm">Add Photo</span>
          </div>
          <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleAvatarChange"
          />
        </label>
        <p class="text-xs text-zinc-500 mt-2">Click to upload avatar</p>
      </div>

      <!-- 🧾 Form Fields -->
      <div class="flex flex-col flex-grow overflow-y-auto">
        <label class="mt-2 mb-1 text-xs uppercase tracking-wide text-zinc-400">full name</label>
        <input
            v-model="full_name"
            type="text"
            placeholder="John Doe"
            class="border border-zinc-500/30 rounded-xl p-3 bg-zinc-100/5 mb-3
          focus:outline-pink-500/70 focus:outline-1 focus:bg-zinc-100/10 w-full placeholder-zinc-500
          transition-all duration-200 text-sm sm:text-base"
        />

        <label class="mt-2 mb-1 text-xs uppercase tracking-wide text-zinc-400">bio</label>
        <textarea
            v-model="bio"
            rows="3"
            placeholder="Photographer, traveler, caffeine addict."
            class="border border-zinc-500/30 rounded-xl p-3 bg-zinc-100/5 mb-3
          focus:outline-pink-500/70 focus:outline-1 focus:bg-zinc-100/10 w-full placeholder-zinc-500
          transition-all duration-200 text-sm sm:text-base resize-none"
        ></textarea>

        <label class="mt-2 mb-1 text-xs uppercase tracking-wide text-zinc-400">location</label>
        <input
            v-model="location"
            type="text"
            placeholder="Warsaw, Poland"
            class="border border-zinc-500/30 rounded-xl p-3 bg-zinc-100/5 mb-3
          focus:outline-pink-500/70 focus:outline-1 focus:bg-zinc-100/10 w-full placeholder-zinc-500
          transition-all duration-200 text-sm sm:text-base"
        />

        <label class="mt-2 mb-1 text-xs uppercase tracking-wide text-zinc-400">website</label>
        <input
            v-model="website"
            type="text"
            placeholder="https://antworks.dev"
            class="border border-zinc-500/30 rounded-xl p-3 bg-zinc-100/5 mb-3
          focus:outline-pink-500/70 focus:outline-1 focus:bg-zinc-100/10 w-full placeholder-zinc-500
          transition-all duration-200 text-sm sm:text-base"
        />

        <label class="mt-2 mb-1 text-xs uppercase tracking-wide text-zinc-400">instagram</label>
        <input
            v-model="instagram"
            type="text"
            placeholder="@apCarPhoto"
            class="border border-zinc-500/30 rounded-xl p-3 bg-zinc-100/5 mb-4
          focus:outline-pink-500/70 focus:outline-1 focus:bg-zinc-100/10 w-full placeholder-zinc-500
          transition-all duration-200 text-sm sm:text-base"
        />
      </div>
    </div>

    <button
        class="mx-auto bg-pink-500/40 hover:bg-pink-700/60 mt-4 mb-4 w-full sm:w-40 h-10 sm:h-11 rounded-xl
      border border-pink-500/50 shadow-[0_0_10px_rgba(255,0,100,0.2)]
      hover:shadow-[0_0_15px_rgba(255,0,100,0.3)]
      text-zinc-200 font-semibold tracking-wide transition-all duration-300 text-sm sm:text-base cursor-pointer"
        :disabled="loading"
        @click="handleSubmit"
    >
      {{ loading ? 'saving...' : 'save profile' }}
    </button>

    <p v-if="error" class="text-red-400 text-sm mb-2">{{ error }}</p>
  </div>
</template>
