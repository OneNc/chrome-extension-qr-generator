import { useState, useEffect } from 'react'
import QRPreview from './components/QRPreview'
import InputForm from './components/InputForm'
import LogoUploader from './components/LogoUploader'
import PatternSelector from './components/PatternSelector'
import { generateQR, downloadQR, MarkPattern } from './core/qr-core'
import { formatError, getCurrentURL } from './utils/helpers'
import './styles/app.css'

interface GeneratedQR {
    dataUrl: string
    text: string
}

function App() {
    const [inputText, setInputText] = useState('')
    const [logoBase64, setLogoBase64] = useState<string | null>(null)
    const [logoName, setLogoName] = useState<string>('')
    const [markPattern, setMarkPattern] = useState<MarkPattern>(0)
    const [qrCode, setQrCode] = useState<GeneratedQR | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')
    const [successMessage, setSuccessMessage] = useState<string>('')

    // Load current URL and saved logo on mount
    useEffect(() => {
        const loadData = async () => {
            // Load current URL
            const url = await getCurrentURL()
            if (url) {
                setInputText(url)
            }

            // Load saved logo from localStorage
            const savedLogoBase64 = localStorage.getItem('qr-logo-base64')
            const savedLogoName = localStorage.getItem('qr-logo-name')
            if (savedLogoBase64 && savedLogoName) {
                setLogoBase64(savedLogoBase64)
                setLogoName(savedLogoName)
            }

            // Load saved pattern from localStorage
            const savedPattern = localStorage.getItem('qr-mark-pattern')
            if (savedPattern) {
                const patternNum = parseInt(savedPattern) as MarkPattern
                if (patternNum >= 0 && patternNum <= 7) {
                    setMarkPattern(patternNum)
                }
            }
        }
        loadData()
    }, [])

    // Auto generate QR saat input berubah (dengan delay)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (inputText.trim()) {
                handleGenerateQR()
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [inputText, logoBase64, markPattern])

    const handleGenerateQR = async () => {
        if (!inputText.trim()) {
            setError('Input text tidak boleh kosong')
            return
        }

        clearMessages()
        setLoading(true)

        try {
            const result = await generateQR({
                text: inputText,
                logoImage: logoBase64 || undefined,
                markPattern,
            })

            setQrCode({
                dataUrl: result.dataUrl,
                text: inputText,
            })
        } catch (err) {
            setError(formatError(err))
        } finally {
            setLoading(false)
        }
    }

    const handleDownloadQR = () => {
        if (!qrCode) return

        try {
            const filename = `qr-${Date.now()}.png`
            downloadQR(qrCode.dataUrl, filename)
            setSuccessMessage('QR code berhasil diunduh!')
            setTimeout(() => setSuccessMessage(''), 3000)
        } catch (err) {
            setError(formatError(err))
        }
    }

    const handleReset = () => {
        setInputText('')
        setLogoBase64(null)
        setLogoName('')
        setQrCode(null)
        clearMessages()
    }

    const handleLogoChange = (base64: string | null, name: string) => {
        setLogoBase64(base64)
        setLogoName(name)

        // Save logo to localStorage
        if (base64 && name) {
            localStorage.setItem('qr-logo-base64', base64)
            localStorage.setItem('qr-logo-name', name)
        } else {
            // Remove from localStorage
            localStorage.removeItem('qr-logo-base64')
            localStorage.removeItem('qr-logo-name')
        }

        clearMessages()
    }

    const clearMessages = () => {
        setError('')
        setSuccessMessage('')
    }

    return (
        <div className="app-container">
            <header className="app-header">
                <h1>QR Code Generator</h1>
                <p className="subtitle">Buat QR code dari text atau URL</p>
            </header>

            <div className="app-content">
                <div className="left-section">
                    <InputForm
                        value={inputText}
                        onChange={setInputText}
                        disabled={loading}
                    />

                    <LogoUploader
                        onLogoChange={handleLogoChange}
                        logoName={logoName}
                        disabled={loading}
                    />

                    <PatternSelector
                        value={markPattern}
                        onChange={(newPattern) => {
                            setMarkPattern(newPattern)
                            localStorage.setItem('qr-mark-pattern', newPattern)
                        }}
                        disabled={loading}
                    />
                </div>

                <div className="right-section">
                    <QRPreview
                        qrCode={qrCode}
                        loading={loading}
                        logoName={logoName}
                    />
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            <footer className="app-footer">
                <button
                    className="btn btn-primary"
                    onClick={handleGenerateQR}
                    disabled={loading || !inputText.trim()}
                >
                    {loading ? 'Generating...' : 'Generate QR'}
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={handleDownloadQR}
                    disabled={!qrCode}
                >
                    Download PNG
                </button>
                <button className="btn btn-tertiary" onClick={handleReset}>
                    Reset
                </button>
            </footer>
        </div>
    )
}

export default App
