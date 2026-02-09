
import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { validateField } from "../../utils/regex"; 
import Button from "../form/Button"; 
import InputField from "../form/InputField";

interface FormDataProps {
  name: string;
  surnames: string;
  email: string;
  password: string;
}

interface ErrorsProps {
  name: string;
  surnames: string;
  email: string;
  password: string;
}

export default function FormularioRegistro() {
  // 1. Estados para datos y errores
  const [formData, setFormData] = useState<FormDataProps>({
    name: "",
    surnames: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorsProps>({
    name: "",
    surnames: "",
    email: "",
    password: "",
  });

  // 2. Manejador de cambios (al escribir)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpia el error al escribir
  };

  // 3. Manejador de desenfoque (al salir del input)
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // 4. Envío del formulario
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validar todos los campos a la vez
    const newErrors = {
      name: validateField("name", formData.name),
      surnames: validateField("surnames", formData.surnames),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    // Comprobar si hay errores (si algún string no está vacío)
    const hasErrors = Object.values(newErrors).some(Boolean);
    
    if (!hasErrors) {
      alert("✅ Formulario válido. Datos listos para enviar.");
      console.log(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white border rounded-lg shadow-sm mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">Registro de Usuario</h2>

      <InputField 
        label="Nombre"
        name="name"
        type="text"
        placeholder="Tu nombre"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
      />

      <InputField 
        label="Apellidos"
        name="surnames"
        type="text"
        placeholder="Tus apellidos"
        value={formData.surnames}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.surnames}
      />

      <InputField 
        label="Correo Electrónico"
        name="email"
        type="email"
        placeholder="ejemplo@correo.com"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
      />

      <InputField 
        label="Contraseña"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
      />

      <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 mt-4">
        Registrarse
      </Button>
    </form>
  );
}