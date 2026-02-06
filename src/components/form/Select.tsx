import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    options: Option[];
}

interface Option {
    value: string;
    label: string;
}
export default function Select({ children, options, ...props }: SelectProps) {
    const baseStyles = "";
    const hoverStyles = "";
    const lgStyles = "lg:color-...";

    return (
        <select>
            {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}
            </option>
            ))}
        </select>
    )
}