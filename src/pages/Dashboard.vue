<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase'
import UserHeader from '@/components/organisms/UserHeader.vue'
import PhotoGrid from '@/components/organisms/PhotoGrid.vue'
import PhotoModal from '@/components/organisms/PhotoModal.vue'
import PhotoUploadModal from '@/components/organisms/PhotoUploadModal.vue'
import EmptyState from '@/components/atoms/EmptyState.vue'

const user = ref<any>(null)
const photos = ref<any[]>([])
const selectedPhoto = ref<any | null>(null)
const showUpload = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth?.user) throw new Error('Not logged-in')
    const uid = auth.user.id

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', uid).single()
    user.value = profile

    const { data: photoData } = await supabase
        .from('photos')
        .select('*')
        .eq('photographer_id', uid)
        .order('created_at', { ascending: false })
    photos.value = photoData ?? []
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
const handlePhotoDeleted = (deletedId: string) => {
  photos.value = photos.value.filter(p => p.id !== deletedId)
}

onMounted(fetchDashboardData)
</script>

<template>
  <div class="min-h-screen w-full bg-zinc-950 text-zinc-200 p-6 overflow-y-auto">
    <div v-if="loading" class="flex items-center justify-center h-screen text-zinc-500">
      Loading your gallery...
    </div>

    <div v-else-if="error" class="text-center text-red-400 mt-20">{{ error }}</div>

    <div v-else class="max-w-5xl mx-auto">

      <UserHeader
          :user="user"
          :photosCount="photos.length"
          :featuredCount="photos.filter(p => p.is_featured).length"
      />

      <PhotoGrid
          v-if="photos.length"
          :photos="photos"
          @select="selectedPhoto = $event"
      />

      <EmptyState v-else />

      <PhotoModal
          v-if="selectedPhoto"
          :photo="selectedPhoto"
          @close="selectedPhoto = null"
          @deleted="handlePhotoDeleted"
      />


      <PhotoUploadModal
          v-if="showUpload"
          @close="showUpload = false"
          @uploaded="fetchDashboardData"
      />
    </div>
  </div>
</template>
