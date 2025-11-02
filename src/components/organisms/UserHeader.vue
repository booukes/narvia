<script setup lang="ts">
import PhotoUploadModal from '@/components/organisms/PhotoUploadModal.vue'
const props = defineProps<{
  user: any
  photosCount: number
  featuredCount: number
}>()
</script>

<template>
  <div
      class="flex flex-col sm:flex-row items-center sm:items-center gap-6 px-2 py-4 border-b border-zinc-800/70"
  >
    <!-- Avatar -->
    <img
        :src="props.user.avatar_url || 'https://placehold.co/128x128?text=Avatar'"
        class="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border border-zinc-800 shadow-[0_0_10px_rgba(255,255,255,0.03)]"
    />

    <!-- Info -->
    <div class="flex flex-col flex-1 text-center sm:text-left">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
        <h2 class="text-2xl font-semibold text-zinc-100 tracking-tight">
          {{ props.user.full_name || 'Unnamed User' }}
        </h2>

        <!-- Upload button -->
        <button
            class="mt-3 sm:mt-0 px-4 py-1.5 bg-pink-500/20 hover:bg-pink-500/40 border border-pink-500/30 rounded-lg text-pink-300 text-sm font-medium transition"
            @click="$emit('upload')"
        >
          ➕ Upload
        </button>
      </div>

      <!-- Bio -->
      <p
          class="text-zinc-400 text-sm mt-1 max-w-xl sm:max-w-none leading-snug"
      >
        {{ props.user.bio || 'No bio yet.' }}
      </p>

      <!-- Stats -->
      <div
          class="flex gap-6 mt-3 justify-center sm:justify-start text-zinc-400 text-sm"
      >
        <div class="flex items-center gap-1">
          <span class="text-zinc-300 font-medium">{{ props.photosCount }}</span>
          <span class="text-zinc-500">photos</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-zinc-300 font-medium">{{ props.featuredCount }}</span>
          <span class="text-zinc-500">featured</span>
        </div>
      </div>

      <!-- Links -->
      <div
          class="flex gap-4 mt-3 justify-center sm:justify-start text-pink-400 text-xs"
      >
        <a
            v-if="props.user.website"
            :href="props.user.website"
            target="_blank"
            class="hover:underline decoration-pink-400/50"
        >
          Website
        </a>
        <a
            v-if="props.user.instagram"
            :href="`https://instagram.com/${props.user.instagram}`"
            target="_blank"
            class="hover:underline decoration-pink-400/50"
        >
          @{{ props.user.instagram }}
        </a>
      </div>
    </div>
  </div>
</template>
