import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { validateField } from "../../utils/regex";
import Button from "./Button";
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ErrorsProps]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let regexKey = name;
    if (name === "name") regexKey = "nombre";
    if (name === "password") regexKey = "contrasenia";

    if (name === "passwordRepeat") {
      if (value !== formData.password) {
        setErrors((prev) => ({ ...prev, passwordRepeat: "Las contraseñas no coinciden" }));
      }
      return;
    }

    if (name === "email") {
        if (!value.includes("@")) {
            setErrors((prev) => ({ ...prev, email: "Email no válido" }));
        }
        return;
    }

    const error = validateField(regexKey, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const nameError = validateField("nombre", formData.name);
    const passError = validateField("contrasenia", formData.password);
    const emailError = !formData.email.includes("@") ? "Correo inválido" : "";
    const repeatError = formData.password !== formData.passwordRepeat ? "Las contraseñas no coinciden" : "";

    const newErrors = {
      name: nameError,
      email: emailError,
      password: passError,
      passwordRepeat: repeatError,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    
    if (!hasErrors) {
      alert("✅ Formulario válido. Datos listos para enviar.");
      console.log("Enviando:", formData);
    }
  };

  const inputStyles = "w-full px-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-600 outline-none transition-colors text-neutral-700 placeholder-neutral-400 bg-white";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-500/50">
      {/* CORRECCIÓN 1: Cambiado max-w-[500px] por max-w-lg (512px) */}
      <div className="relative w-full max-w-lg p-8 bg-white rounded-xl shadow-xl m-4">
        
        <button className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 text-2xl font-bold">
          &times;
        </button>

        <div className="mb-6">
          {/* CORRECCIÓN 2: Cambiado el texto variable manual por 'text-3xl' */}
          <h1 className="text-3xl font-bold text-primary-50 mb-2">
            Crear Cuenta
          </h1>
          {/* CORRECCIÓN 3: Cambiado el texto variable manual por 'text-base' */}
          <p className="text-base text-neutral-500">
            Crea una nueva cuenta para comenzar
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField 
            id="name"
            label="Usuario"
            name="name"
            type="text"
            placeholder="Tu nombre de usuario"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            className={inputStyles} 
          />

          <InputField 
            id="email"
            label="Correo"
            name="email"
            type="email"
            placeholder="Tu correo electrónico"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            className={inputStyles}
          />

          <InputField 
            id="password"
            label="Contraseña"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            className={inputStyles}
          />

          <InputField 
            id="passwordRepeat"
            label="Repetir contraseña"
            name="passwordRepeat"
            type="password"
            placeholder="Repite tu contraseña"
            value={formData.passwordRepeat}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.passwordRepeat}
            className={inputStyles}
          />

          <div className="flex gap-4 mt-8 pt-2">
            <Button 
                type="button" 
                className="w-full py-3 bg-white border border-neutral-300 text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Cancelar
            </Button>

            <Button 
                type="submit" 
                className="w-full py-3 bg-primary-50 text-white rounded-lg hover:opacity-90 transition-opacity shadow-md cursor-pointer"
            >
              Registrarse
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}