<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/supabase'

const props = defineProps<{
  photo: any
}>()

const emit = defineEmits(['close', 'deleted'])

const confirming = ref(false)
const deleting = ref(false)
const deleteError = ref<string | null>(null)
const deleted = ref(false)

const startConfirm = () => {
  confirming.value = true
}

const cancelConfirm = () => {
  confirming.value = false
  deleteError.value = null
}

const deletePhoto = async () => {
  if (deleting.value) return
  deleting.value = true
  deleteError.value = null

  try {
    // 🔐 Get auth token
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData.session?.access_token
    if (!accessToken) throw new Error('Not authenticated')

    // 🗑 Step 1: Delete from B2
    const fnRes = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-from-b2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ fileUrl: props.photo.file_url }),
    })

    const fnJson = await fnRes.json()
    if (!fnRes.ok || fnJson.error) throw new Error(fnJson.error || 'Failed to delete from B2')

    // 💾 Step 2: Delete from DB
    const { error: dbError } = await supabase.from('photos').delete().eq('id', props.photo.id)
    if (dbError) throw new Error(dbError.message)

    deleted.value = true
    setTimeout(() => {
      emit('deleted', props.photo.id)
      emit('close')
    }, 800)
  } catch (err: any) {
    deleteError.value = err.message || 'Delete failed'
  } finally {
    deleting.value = false
    confirming.value = false
  }
}
</script>

<template>
  <transition name="fade">
    <div
        class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        @click.self="emit('close')"
    >
      <div
          class="bg-zinc-900 rounded-2xl overflow-hidden max-w-3xl w-full border border-zinc-800 relative"
      >
        <!-- Image -->
        <img
            :src="props.photo.file_url"
            alt="photo"
            class="w-full object-contain max-h-[70vh] bg-zinc-950 transition-opacity duration-300"
            :class="{ 'opacity-50 blur-sm': deleting || deleted }"
        />

        <!-- Info -->
        <div class="p-4 text-sm text-zinc-300 relative">
          <h3 class="text-lg font-semibold text-zinc-100 text-center mb-1">
            {{ props.photo.title || 'Untitled' }}
          </h3>
          <p class="text-zinc-400 text-sm text-center mb-4">
            {{ props.photo.description }}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-zinc-400 mb-4">
            <p>📷 {{ props.photo.camera_model || 'Unknown' }}</p>
            <p>🎞 {{ props.photo.lens_model || 'Unknown' }}</p>
            <p>🔢 ISO: {{ props.photo.iso }}</p>
            <p>🔘 f/{{ props.photo.aperture }}</p>
            <p>⚡ {{ props.photo.shutter_speed }}s</p>
            <p>📏 {{ props.photo.focal_length }}mm</p>
            <p>💻 {{ props.photo.software }}</p>

            <p class="col-span-2 sm:col-span-3 text-center">
              📅 {{ new Date(props.photo.taken_at).toLocaleDateString() }}
            </p>
          </div>

          <!-- Delete Button -->
          <div class="flex justify-center">
            <button
                v-if="!confirming && !deleted"
                class="px-5 py-2 rounded-lg text-sm font-medium border transition-all duration-300 bg-red-500/40 hover:bg-red-600/60 border-red-500/40 text-zinc-100"
                @click="startConfirm"
            >
              🗑 Delete
            </button>

            <!-- Deleting -->
            <button
                v-else-if="deleting"
                disabled
                class="px-5 py-2 rounded-lg text-sm font-medium border border-zinc-600 text-zinc-400 bg-zinc-800/60 flex items-center gap-2"
            >
              <span class="animate-spin border-2 border-t-transparent border-zinc-400 rounded-full w-4 h-4"></span>
              Deleting...
            </button>

            <!-- Deleted -->
            <button
                v-else-if="deleted"
                disabled
                class="px-5 py-2 rounded-lg text-sm font-medium border border-green-500/40 text-green-300 bg-green-500/30"
            >
              ✅ Deleted
            </button>
          </div>

          <!-- Confirm UI -->
          <transition name="fade">
            <div
                v-if="confirming"
                class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center rounded-2xl"
            >
              <p class="text-zinc-100 mb-4 text-sm">Are you sure you want to delete this photo?</p>
              <div class="flex gap-3">
                <button
                    class="px-4 py-2 rounded-lg text-sm bg-red-500/50 hover:bg-red-600/60 border border-red-500/40 text-zinc-100 transition"
                    @click="deletePhoto"
                >
                  Yes, delete
                </button>
                <button
                    class="px-4 py-2 rounded-lg text-sm bg-zinc-700/60 hover:bg-zinc-700 text-zinc-300 border border-zinc-600 transition"
                    @click="cancelConfirm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </transition>

          <p
              v-if="deleteError"
              class="text-red-400 text-center text-xs mt-3 font-medium"
          >
            {{ deleteError }}
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
