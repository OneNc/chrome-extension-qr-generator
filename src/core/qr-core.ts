import QRCodeStyling from 'qr-code-styling'

export type MarkPattern = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface QRGenerateOptions {
    text: string
    logoImage?: string // Base64 logo image
    width?: number
    errorCorrection?: 'L' | 'M' | 'Q' | 'H'
    markPattern?: MarkPattern
}

export interface QRResult {
    dataUrl: string
    canvas?: HTMLCanvasElement
}

/**
 * Map pattern (0-7) ke kombinasi styling yang berbeda
 * Setiap pattern menggunakan kombinasi dotsOptions dan cornersOptions yang unik
 */
const getPatternStyle = (pattern: MarkPattern): {
    dotsType: 'square' | 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'extra-rounded'
    cornersSquareType: 'square' | 'dot' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded' | 'dots'
    cornersDotType: 'square' | 'dot' | 'rounded' | 'extra-rounded' | 'classy' | 'classy-rounded' | 'dots'
} => {
    const patterns = [
        { dotsType: 'square' as const, cornersSquareType: 'square' as const, cornersDotType: 'square' as const },
        { dotsType: 'rounded' as const, cornersSquareType: 'rounded' as const, cornersDotType: 'dot' as const },
        { dotsType: 'dots' as const, cornersSquareType: 'extra-rounded' as const, cornersDotType: 'dots' as const },
        { dotsType: 'classy' as const, cornersSquareType: 'classy' as const, cornersDotType: 'square' as const },
        { dotsType: 'classy-rounded' as const, cornersSquareType: 'classy-rounded' as const, cornersDotType: 'dot' as const },
        { dotsType: 'extra-rounded' as const, cornersSquareType: 'dot' as const, cornersDotType: 'rounded' as const },
        { dotsType: 'square' as const, cornersSquareType: 'dots' as const, cornersDotType: 'classy' as const },
        { dotsType: 'rounded' as const, cornersSquareType: 'extra-rounded' as const, cornersDotType: 'classy-rounded' as const },
    ]
    return patterns[pattern] || patterns[0]
}

/**
 * Hasilkan QR code dengan qr-code-styling (support styling pattern dan logo)
 */
export const generateQR = async (options: QRGenerateOptions): Promise<QRResult> => {
    const {
        text,
        logoImage,
        width = 400,
        errorCorrection = 'M',
        markPattern = 0,
    } = options

    if (!text.trim()) {
        throw new Error('Input text tidak boleh kosong')
    }

    try {
        // Pemetaan error correction level
        const errorLevelMap: Record<string, 'L' | 'M' | 'Q' | 'H'> = {
            'L': 'L',
            'M': 'M',
            'Q': 'Q',
            'H': 'H',
        }
        const mappedErrorLevel = errorLevelMap[errorCorrection] || 'M'

        const qrCode = new QRCodeStyling({
            width,
            height: width,
            data: text,
            margin: 8,
            qrOptions: {
                typeNumber: 0,
                mode: 'Byte' as any,
                errorCorrectionLevel: mappedErrorLevel,
            },
            image: logoImage,
            imageOptions: logoImage ? {
                hideBackgroundDots: true,
                imageSize: 0.2,
                margin: 8,
            } : undefined,
            dotsOptions: {
                color: '#000000',
                type: getPatternStyle(markPattern).dotsType,
            },
            cornersSquareOptions: {
                color: '#000000',
                type: getPatternStyle(markPattern).cornersSquareType,
            },
            cornersDotsOptions: {
                color: '#000000',
                type: getPatternStyle(markPattern).cornersDotType,
            },
            backgroundOptions: {
                color: '#FFFFFF',
            },
        })

        // Generate PNG blob dan convert ke data URL
        const blob = await qrCode.getRawData('png') as Blob
        const dataUrl = await blobToDataURL(blob)

        // Untuk return canvas, buat temporary canvas dari data URL
        const tempCanvas = document.createElement('canvas')

        return { dataUrl, canvas: tempCanvas }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Gagal generate QR code'
        throw new Error(`QR Generation Error: ${message}`)
    }
}

/**
 * Convert Blob ke Data URL
 */
const blobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            resolve(reader.result as string)
        }
        reader.onerror = () => {
            reject(new Error('Gagal convert blob ke data URL'))
        }
        reader.readAsDataURL(blob)
    })
}

/**
 * Download QR code sebagai PNG
 */
export const downloadQR = (dataUrl: string, filename: string = 'qr-code.png') => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

/**
 * Validate input text
 */
export const validateInput = (text: string): { valid: boolean; error?: string } => {
    if (!text || !text.trim()) {
        return { valid: false, error: 'Input tidak boleh kosong' }
    }

    if (text.length > 2953) {
        return { valid: false, error: 'Input terlalu panjang (max 2953 karakter)' }
    }

    return { valid: true }
}

/**
 * Validate logo file
 */
export const validateLogoFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 1024 * 1024 // 1MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']

    if (!file) {
        return { valid: false, error: 'File tidak ditemukan' }
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Format file harus PNG, JPG, atau GIF' }
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'Ukuran file terlalu besar (max 1MB)' }
    }

    return { valid: true }
}
