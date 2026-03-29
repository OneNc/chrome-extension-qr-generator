import { ChangeEvent, useRef } from 'react'
import { fileToBase64 } from '../utils/helpers'
import { validateLogoFile } from '../core/qr-core'
import '../styles/logo-uploader.css'

interface LogoUploaderProps {
    onLogoChange: (base64: string | null, name: string) => void
    logoName?: string
    disabled?: boolean
}

function LogoUploader({ onLogoChange, logoName = '', disabled = false }: LogoUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const validation = validateLogoFile(file)
        if (!validation.valid) {
            alert(validation.error)
            return
        }

        try {
            const base64 = await fileToBase64(file)
            onLogoChange(base64, file.name)
        } catch (error) {
            alert(`Error: ${error instanceof Error ? error.message : 'Failed to load logo'}`)
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveLogo = () => {
        onLogoChange(null, '')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="logo-uploader">
            <label>Logo (Optional):</label>
            <div className="upload-area">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    onChange={handleFileSelect}
                    disabled={disabled}
                    style={{ display: 'none' }}
                />
                <button
                    type="button"
                    className="upload-btn"
                    onClick={handleClick}
                    disabled={disabled}
                >
                    📁 Pilih Logo
                </button>

                {logoName && (
                    <div className="logo-info">
                        <span className="logo-name">{logoName}</span>
                        <button
                            type="button"
                            className="remove-logo-btn"
                            onClick={handleRemoveLogo}
                            disabled={disabled}
                        >
                            ✕
                        </button>
                    </div>
                )}
            </div>
            <p className="logo-help">
                Max 1MB • Format: PNG, JPG, GIF
            </p>
        </div>
    )
}

export default LogoUploader
