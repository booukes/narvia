import { ref } from 'vue'

export function useWebpTools() {
    const webpQuality = ref(0.86)
    const resizeMax = ref(0)

    async function loadBitmapWithOrientation(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
        if ('createImageBitmap' in window) {
            try {
                // @ts-ignore
                return await createImageBitmap(blob, { imageOrientation: 'from-image' })
            } catch { /* fallback */ }
        }

        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = URL.createObjectURL(blob)
        })
    }

    async function convertFileToWebP(input: File): Promise<File> {
        const bitmap = await loadBitmapWithOrientation(input)
        const srcW = (bitmap as any).width
        const srcH = (bitmap as any).height
        const maxEdge = resizeMax.value

        let dstW = srcW
        let dstH = srcH
        if (maxEdge && (srcW > maxEdge || srcH > maxEdge)) {
            if (srcW >= srcH) {
                dstW = maxEdge
                dstH = Math.round((srcH / srcW) * maxEdge)
            } else {
                dstH = maxEdge
                dstW = Math.round((srcW / srcH) * maxEdge)
            }
        }

        const canvas = document.createElement('canvas')
        canvas.width = dstW
        canvas.height = dstH
        const ctx = canvas.getContext('2d')!
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(bitmap as any, 0, 0, dstW, dstH)

        if (typeof (bitmap as any).close === 'function') (bitmap as any).close()

        const blob: Blob = await new Promise((resolve, reject) =>
            canvas.toBlob(
                (b) => (b ? resolve(b) : reject(new Error('WebP conversion failed'))),
                'image/webp',
                webpQuality.value
            )
        )

        const webpName = input.name.replace(/\.[^.]+$/, '') + '.webp'
        return new File([blob], webpName, { type: 'image/webp' })
    }

    return { webpQuality, resizeMax, convertFileToWebP }
}
