<script setup lang="ts">
const props = defineProps<{
  photos: any[]
}>()

const emit = defineEmits(['select'])
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-8">
    <div
        v-for="photo in props.photos"
        :key="photo.id"
        @click="emit('select', photo)"
        class="relative group cursor-pointer overflow-hidden rounded-xl border border-zinc-800/50"
    >
      <img
          :src="photo.thumbnail_url || photo.file_url"
          class="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
      />
      <div
          class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition"
      >
        <p class="text-xs text-zinc-200">{{ photo.title || 'Untitled' }}</p>
      </div>
    </div>
  </div>
</template>
