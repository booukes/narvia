import { ref } from 'vue'
import exifr from 'exifr'

export function useExif() {
    const camera_make = ref('')
    const camera_model = ref('')
    const lens_model = ref('')
    const iso = ref<number | null>(null)
    const aperture = ref<number | null>(null)
    const shutter_speed = ref('')
    const focal_length = ref<number | null>(null)
    const taken_at = ref('')

    const formatShutterSpeed = (value: number) => {
        if (!value) return ''
        if (value >= 1) return `${value.toFixed(1)}s`
        const frac = Math.round(1 / value)
        return `1/${frac}s`
    }

    const parseExifDateToLocalInput = (d: unknown) => {
        try {
            let date: Date | null = null
            if (d instanceof Date) date = d
            else if (typeof d === 'string') date = new Date(d)
            else if (typeof d === 'number') date = new Date(d)
            if (!date || isNaN(date.getTime())) return ''
            return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16)
        } catch {
            return ''
        }
    }

    async function extractExif(file: File) {
        try {
            const exifData: any = await exifr.parse(file)
            console.log('📸 EXIF:', exifData)
            camera_make.value = exifData?.Make || ''
            camera_model.value = exifData?.Model || ''
            lens_model.value = exifData?.LensModel || ''
            iso.value = exifData?.ISOSpeedRatings ?? exifData?.ISO ?? null
            aperture.value = exifData?.FNumber ?? exifData?.ApertureValue ?? null
            shutter_speed.value = exifData?.ExposureTime ? formatShutterSpeed(Number(exifData.ExposureTime)) : ''
            focal_length.value =
                typeof exifData?.FocalLength === 'number'
                    ? Math.round(exifData.FocalLength)
                    : typeof exifData?.FocalLengthIn35mmFilm === 'number'
                        ? Math.round(exifData.FocalLengthIn35mmFilm)
                        : null
            taken_at.value = parseExifDateToLocalInput(exifData?.DateTimeOriginal || exifData?.CreateDate || new Date())
        } catch (err) {
            console.warn('No EXIF data found:', err)
        }
    }

    return {
        camera_make,
        camera_model,
        lens_model,
        iso,
        aperture,
        shutter_speed,
        focal_length,
        taken_at,
        extractExif,
        parseExifDateToLocalInput,
        formatShutterSpeed,
    }
}
