# QR Code Generator Chrome Extension

Extension untuk generate QR code dari text atau URL dengan logo overlay.

## Features

- Generate QR code dari text atau URL
- Upload logo (PNG, JPG, GIF)
- Real-time preview
- Download QR code sebagai PNG
- 8 pattern styles
- localStorage persistence

## Tech Stack

- React 18 + TypeScript
- Vite
- qr-code-styling
- Chrome Extension Manifest V3

## Quick Start

```bash
# Install
npm install

# Build
npm run build

# Load ke Chrome
# 1. chrome://extensions/
# 2. Enable "Developer mode"
# 3. Click "Load unpacked" → select dist/
```

## Usage

1. Click extension icon
2. Masukkan text atau URL
3. (Optional) Upload logo
4. Download PNG

## Customization

- **Patterns**: 8 style options di dropdown
- **QR Size**: Default 400px (edit di src/core/qr-core.ts)
- **Logo Size**: 20% dari QR
- **Error Correction**: Level M

## Features

| Feature | Status |
|---------|--------|
| QR Generation | ✅ |
| Logo Overlay | ✅ |
| Pattern Styles | ✅ |
| Download | ✅ |
| Persistence | ✅ |

## Troubleshooting

- **Extension tidak muncul**: Refresh chrome://extensions/
- **QR tidak generate**: Cek input tidak kosong
- **Logo tidak terlihat**: Gunakan format PNG/JPG, size < 1MB

## License

MIT
