import { ChangeEvent } from 'react'
import { MarkPattern } from '../core/qr-core'
import '../styles/pattern-selector.css'

interface PatternSelectorProps {
    value: MarkPattern
    onChange: (pattern: MarkPattern) => void
    disabled?: boolean
}

const patterns: { value: MarkPattern; label: string; description: string }[] = [
    { value: 0, label: 'Classic', description: 'Square dots, square corners' },
    { value: 1, label: 'Rounded', description: 'Rounded dots, rounded corners' },
    { value: 2, label: 'Dots', description: 'Circular dots, extra rounded corners' },
    { value: 3, label: 'Classy', description: 'Classy style dots with square corners' },
    { value: 4, label: 'Classy Rounded', description: 'Classy rounded dots and corners' },
    { value: 5, label: 'Extra Rounded', description: 'Extra rounded dots with dot corners' },
    { value: 6, label: 'Mixed 1', description: 'Square dots with dots corners' },
    { value: 7, label: 'Mixed 2', description: 'Rounded dots with classy rounded corners' },
]

function PatternSelector({ value, onChange, disabled = false }: PatternSelectorProps) {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange(parseInt(e.target.value) as MarkPattern)
    }

    return (
        <div className="pattern-selector">
            <label htmlFor="pattern-select">Pattern:</label>
            <select
                id="pattern-select"
                value={value}
                onChange={handleChange}
                disabled={disabled}
            >
                {patterns.map((pattern) => (
                    <option key={pattern.value} value={pattern.value}>
                        {pattern.label} - {pattern.description}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default PatternSelector
