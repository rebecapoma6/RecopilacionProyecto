import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export default function InputFieldClase({
    label,
    error,
    id,
    ...props
}: InputFieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block mb-1">
                {label}
            </label>

            <input
                id={id}
                className="block w-full border rounded p-2"
                {...props}
            />

            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error}
                </p>
            )}
        </div>
    );
}


// Ejemplo de uso

// <InputFieldClase
//   label="Contraseña"
//   id="password"
//   type="password"
//   name="password"
//   value={formData.password}
//   onChange={handleChange}
//   onBlur={handleBlur}
//   error={errors.password}
// />
