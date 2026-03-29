import '../styles/qr-preview.css'

interface QRPreviewProps {
    qrCode: { dataUrl: string; text: string } | null
    loading: boolean
    logoName?: string
}

function QRPreview({ qrCode, loading, logoName }: QRPreviewProps) {
    return (
        <div className="qr-preview">
            <label>Preview QR Code:</label>
            <div className="preview-container">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Generating...</p>
                    </div>
                ) : qrCode ? (
                    <div className="qr-display">
                        <img src={qrCode.dataUrl} alt="QR Code" className="qr-image" />
                        {logoName && <p className="logo-indicator">✓ Logo: {logoName}</p>}
                    </div>
                ) : (
                    <div className="empty-state">
                        <p className="empty-icon">📱</p>
                        <p className="empty-text">Masukkan text untuk preview QR code</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default QRPreview
