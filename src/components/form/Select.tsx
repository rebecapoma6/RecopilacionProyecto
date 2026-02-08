import type { SelectHTMLAttributes } from "react";

interface SelectClaseProps extends SelectHTMLAttributes<HTMLSelectElement>{
    options: Option[];
    label: string;
}

interface Option{
    value: string;
    label: string;
}

export default function Select({options, label, ...props}: SelectClaseProps){

    return(
        <>
        <label htmlFor={label}>{label}</label>
        
        <select {...props}>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        </>
    )
}