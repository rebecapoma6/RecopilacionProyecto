import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { validateField } from "../../utils/regex"; 
import Button from "../ui/Button"; 
import InputField from "./InputField";

interface FormDataProps {
  name: string;
  
  email: string;
  password: string;
  passwordRepeat: string;
}

interface ErrorsProps {
  name: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

export default function FormularioRegistro() {
  // 1. Estados para datos y errores
  const [formData, setFormData] = useState<FormDataProps>({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [errors, setErrors] = useState<ErrorsProps>({
    name: "",
    email: "",
    password: "",
    passwordRepeat: "",
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
      
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      passwordRepeat: validateField("passwordRepeat", formData.passwordRepeat),
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
      <h1 className="text-4xl-h1">Crear cuenta</h1>
      <p className="text-base-body">Crea una nueva cuenta para comenzar</p>


      <InputField 
        label="Usuario"
        name="name"
        type="text"
        placeholder="Tu nombre"
        value={formData.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
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

      <InputField 
        label="Repetir contraseña"
        name="password"
        type="password"
        value={formData.passwordRepeat}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.passwordRepeat}
      />

       <Button type="submit" className="bg-color-primary-50">
        Registrarse
      </Button>

      <Button type="submit" className="">
        Cancelar
      </Button>
    </form>
  );
}