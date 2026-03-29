import { ChangeEvent } from 'react'
import '../styles/input-form.css'

interface InputFormProps {
    value: string
    onChange: (value: string) => void
    disabled?: boolean
}

function InputForm({ value, onChange, disabled = false }: InputFormProps) {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
    }

    return (
        <div className="input-form">
            <label htmlFor="text-input">Text atau URL:</label>
            <input
                id="text-input"
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Masukkan text atau URL untuk di-generate menjadi QR code..."
                disabled={disabled}
                maxLength={2953}
            />
        </div>
    )
}

export default InputForm
