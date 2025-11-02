<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '@/supabase'
import exifr from 'exifr'

const emit = defineEmits(['close', 'uploaded'])
const loading = ref(false)
const progress = ref(0)
const file = ref<File | null>(null)
const previewUrl = ref('')
const title = ref('')
const description = ref('')
const error = ref<string | null>(null)

// 🧠 Editable EXIF fields
const camera_make = ref('')
const camera_model = ref('')
const lens_model = ref('')
const iso = ref<number | null>(null)
const aperture = ref<number | null>(null)
const shutter_speed = ref('')
const focal_length = ref<number | null>(null)
const taken_at = ref('')

// Format shutter speed nicely
const formatShutterSpeed = (value: number) => {
  if (!value) return ''
  if (value >= 1) return `${value.toFixed(1)}s`
  const frac = Math.round(1 / value)
  return `1/${frac}s`
}

// Handle file selection / drag-drop
const handleFile = async (event: DragEvent | Event) => {
  let files: FileList | null = null
  if (event instanceof DragEvent && event.dataTransfer) files = event.dataTransfer.files
  else if (event.target instanceof HTMLInputElement) files = event.target.files
  if (!files || !files[0]) return
  file.value = files[0]
  previewUrl.value = URL.createObjectURL(files[0])

  // 🧠 Try to auto-read EXIF
  try {
    const exifData = await exifr.parse(file.value)
    console.log('📸 EXIF:', exifData)

    camera_model.value = exifData.Model || ''
    camera_make.value = exifData.Make || ''
    lens_model.value = exifData.LensModel || ''
    iso.value = exifData.ISOSpeedRatings || null
    aperture.value = exifData.FNumber || null
    shutter_speed.value = formatShutterSpeed(exifData.ExposureTime)
    focal_length.value = exifData.FocalLength || null
    taken_at.value = exifData.DateTimeOriginal
        ? new Date(exifData.DateTimeOriginal).toISOString().slice(0, 16)
        : ''
  } catch (err) {
    console.warn('No EXIF data found:', err)
  }
}

// Handle upload through Supabase Function + B2
const uploadPhoto = async () => {
  if (!file.value) return (error.value = 'Select a file first!')
  loading.value = true
  error.value = null
  progress.value = 0

  try {
    // 🧍 Get current user
    const { data: auth } = await supabase.auth.getUser()
    const userId = auth.user.id

    // 🧾 Step 1: ask Supabase Edge Function for upload URL
    const fnRes = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-to-b2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
      body: JSON.stringify({
        filename: file.value.name,
        contentType: file.value.type,
      }),
    })

    const { uploadUrl, authToken, downloadUrl, error: fnError } = await fnRes.json()
    if (fnError) throw new Error(fnError)
    if (!uploadUrl) throw new Error('Failed to get upload URL from Supabase')

    // 🖼 Step 2: upload directly to B2
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: authToken,
        'X-Bz-File-Name': encodeURIComponent(file.value.name),
        'Content-Type': file.value.type,
        'X-Bz-Content-Sha1': 'do_not_verify',
      },
      body: file.value,
    })

    if (!uploadRes.ok) throw new Error('Upload to B2 failed')

    // 🧩 Step 3: save metadata
    const file_url = `${downloadUrl}/${encodeURIComponent(file.value.name)}`
    const parsedShutter = shutter_speed.value.includes('/')
        ? 1 / Number(shutter_speed.value.split('/')[1].replace('s', ''))
        : parseFloat(shutter_speed.value)

    const { error: insertErr } = await supabase.from('photos').insert({
      photographer_id: userId,
      filename: file.value.name,
      file_url,
      thumbnail_url: file_url,
      title: title.value || file.value.name,
      description: description.value || '',
      camera_model: `${camera_make.value} ${camera_model.value}` || null,
      lens_model: lens_model.value || null,
      iso: iso.value || null,
      aperture: aperture.value || null,
      shutter_speed: parsedShutter || null,
      focal_length: focal_length.value || null,
      taken_at: taken_at.value ? new Date(taken_at.value).toISOString() : new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (insertErr) throw insertErr

    emit('uploaded')
    emit('close')
  } catch (err: any) {
    console.error(err)
    error.value = err.message || 'Upload failed'
  } finally {
    loading.value = false
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
          class="bg-zinc-900 rounded-2xl max-w-lg w-full border border-zinc-800 p-6 relative
         max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
      >

      <button
            class="absolute top-2 right-2 text-zinc-400 hover:text-pink-400 text-xl"
            @click="emit('close')"
        >
          ✕
        </button>

        <h2 class="text-xl font-semibold text-zinc-100 mb-4 text-center">
          Upload Photo
        </h2>

        <!-- Drop Zone -->
        <div
            @drop.prevent="handleFile"
            @dragover.prevent
            class="border-2 border-dashed border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-zinc-950/50 hover:bg-zinc-900/50 transition"
            @click="$refs.fileInput.click()"
        >
          <input
              type="file"
              ref="fileInput"
              accept="image/*"
              class="hidden"
              @change="handleFile"
          />

          <div v-if="!previewUrl" class="text-zinc-400 text-sm">
            Drag & drop or click to upload
          </div>

          <img
              v-else
              :src="previewUrl"
              class="w-40 h-40 object-cover rounded-lg shadow-lg border border-zinc-700"
          />
        </div>

        <!-- Title and description -->
        <div class="mt-4 space-y-3">
          <input
              v-model="title"
              type="text"
              placeholder="Title"
              class="w-full p-2 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 placeholder-zinc-500 focus:outline-pink-400"
          />
          <textarea
              v-model="description"
              rows="3"
              placeholder="Description (optional)"
              class="w-full p-2 rounded-lg bg-zinc-800 text-zinc-100 border border-zinc-700 placeholder-zinc-500 focus:outline-pink-400"
          />
        </div>

        <!-- EXIF section -->
        <div v-if="file" class="mt-5 bg-zinc-800/40 rounded-lg p-3 border border-zinc-700">
          <p class="text-xs text-zinc-400 mb-2 italic">
            Auto-detected camera data
          </p>

          <div class="grid grid-cols-2 gap-2 text-sm">
            <input v-model="camera_model" placeholder="Camera Model" class="bg-zinc-900 p-2 rounded border border-zinc-700 text-zinc-100" />
            <input v-model="lens_model" placeholder="Lens Model" class="bg-zinc-900 p-2 rounded border border-zinc-700 text-zinc-100" />
            <input v-model.number="iso" placeholder="ISO" class="bg-zinc-900 p-2 rounded border border-zinc-700 text-zinc-100" />
            <input v-model.number="aperture" placeholder="Aperture (f/)" class="bg-zinc-900 p-2 rounded border border-zinc-700 text-zinc-100" />
            <input v-model="shutter_speed" placeholder="Shutter Speed" class="bg-zinc-900 p-2 rounded border border-zinc-700 text-zinc-100" />
            <input v-model.number="focal_length" placeholder="Focal Length (mm)" class="bg-zinc-900 p-2 rounded border border-zinc-700 text-zinc-100" />
            <input v-model="taken_at" type="datetime-local" class="col-span-2 bg-zinc-900 p-2 rounded border border-zinc-700 text-zinc-100" />
          </div>
        </div>

        <!-- Progress bar -->
        <div v-if="loading" class="w-full bg-zinc-800 rounded-full mt-4 h-2 overflow-hidden">
          <div
              class="h-full bg-pink-500 transition-all duration-200"
              :style="{ width: progress + '%' }"
          />
        </div>

        <p v-if="error" class="text-red-400 text-sm mt-3 text-center">{{ error }}</p>

        <button
            class="mt-5 w-full py-2 rounded-xl bg-pink-500/40 hover:bg-pink-600/60 border border-pink-500/40 text-zinc-100 font-semibold transition disabled:opacity-40"
            @click="uploadPhoto"
            :disabled="loading"
        >
          {{ loading ? 'Uploading...' : 'Upload' }}
        </button>
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
