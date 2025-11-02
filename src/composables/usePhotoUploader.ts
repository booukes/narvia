import { ref } from 'vue'
import { supabase } from '@/supabase'
import { useExif } from './useExif'
import { useWebpTools } from './useWebpTools'

export function usePhotoUploader(emit: (event: string) => void) {
    const { extractExif, ...exif } = useExif()
    const { convertFileToWebP, webpQuality, resizeMax } = useWebpTools()

    const loading = ref(false)
    const progress = ref(0)
    const file = ref<File | null>(null)
    const previewUrl = ref('')
    const title = ref('')
    const description = ref('')
    const error = ref<string | null>(null)

    const handleFile = async (event: DragEvent | Event) => {
        let files: FileList | null = null
        if (event instanceof DragEvent && event.dataTransfer) files = event.dataTransfer.files
        else if (event.target instanceof HTMLInputElement) files = event.target.files
        if (!files?.[0]) return

        const selected = files[0]
        const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/tiff']
        if (!supportedTypes.includes(selected.type)) {
            error.value = 'Unsupported file type.'
            return
        }

        file.value = selected
        previewUrl.value = URL.createObjectURL(selected)
        error.value = null

        await extractExif(selected)
    }

    const uploadPhoto = async () => {
        if (!file.value) return (error.value = 'Select a file first!')
        loading.value = true
        progress.value = 0
        error.value = null

        try {
            const webpFile = await convertFileToWebP(file.value)
            const { data: auth } = await supabase.auth.getUser()
            const userId = auth.user!.id
            const session = (await supabase.auth.getSession()).data.session

            const fnRes = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-to-b2`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${session?.access_token}`,
                },
                body: JSON.stringify({
                    filename: webpFile.name,
                    contentType: 'image/webp',
                }),
            })

            const { uploadUrl, authToken, downloadUrl, error: fnError } = await fnRes.json()
            if (fnError) throw new Error(fnError)

            await new Promise<void>((resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', uploadUrl)
                xhr.setRequestHeader('Authorization', authToken)
                xhr.setRequestHeader('X-Bz-File-Name', encodeURIComponent(webpFile.name))
                xhr.setRequestHeader('Content-Type', 'image/webp')
                xhr.setRequestHeader('X-Bz-Content-Sha1', 'do_not_verify')

                xhr.upload.onprogress = (e) => {
                    if (e.lengthComputable) progress.value = Math.round((e.loaded / e.total) * 100)
                }

                xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(`B2 upload failed: ${xhr.statusText}`))
                xhr.onerror = () => reject('Network error')
                xhr.send(webpFile)
            })

            const file_url = `${downloadUrl}/${encodeURIComponent(webpFile.name)}`
            const parsedShutter =
                exif.shutter_speed.value.includes('/')
                    ? 1 / Number(exif.shutter_speed.value.split('/')[1].replace('s', ''))
                    : parseFloat(exif.shutter_speed.value)

            const { error: insertErr } = await supabase.from('photos').insert({
                photographer_id: userId,
                filename: webpFile.name,
                file_url,
                thumbnail_url: file_url,
                title: title.value || webpFile.name,
                description: description.value || '',
                camera_model: [exif.camera_make.value, exif.camera_model.value].filter(Boolean).join(' ') || null,
                lens_model: exif.lens_model.value || null,
                iso: exif.iso.value || null,
                aperture: exif.aperture.value || null,
                shutter_speed: parsedShutter || null,
                focal_length: exif.focal_length.value || null,
                taken_at: exif.taken_at.value ? new Date(exif.taken_at.value).toISOString() : new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })

            if (insertErr) throw insertErr

            emit('uploaded')
            emit('close')
        } catch (err: any) {
            console.error(err)
            error.value = err?.message || 'Upload failed'
        } finally {
            loading.value = false
        }
    }

    return {
        loading, progress, file, previewUrl, title, description, error,
        handleFile, uploadPhoto,
        webpQuality, resizeMax,
        ...exif
    }
}
