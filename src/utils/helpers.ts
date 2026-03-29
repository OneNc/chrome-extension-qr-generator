/**
 * Convert File to Base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
            const result = reader.result
            if (typeof result === 'string') {
                resolve(result)
            } else {
                reject(new Error('Failed to convert file to base64'))
            }
        }
        reader.onerror = () => reject(new Error('Error reading file'))
        reader.readAsDataURL(file)
    })
}

/**
 * Get current URL from active tab
 */
export const getCurrentURL = async (): Promise<string | null> => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
        return tab.url || null
    } catch (error) {
        console.error('Error getting current URL:', error)
        return null
    }
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<void> => {
    try {
        await navigator.clipboard.writeText(text)
    } catch (error) {
        throw new Error('Gagal copy ke clipboard')
    }
}

/**
 * Format error message
 */
export const formatError = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message
    }
    if (typeof error === 'string') {
        return error
    }
    return 'Terjadi kesalahan yang tidak diketahui'
}
