import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { validateField } from "../../utils/regex";
import Button from "./Button";
import InputField from "./InputField";

interface FormData {
  name: string;
  surnames: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

interface Errors {
  name?: string;
  surnames?: string;
  email?: string;
  password?: string;
  passwordRepeat?: string;
}

export default function FormularioRegistro() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    surnames: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  // Manejar cambios en los inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo mientras el usuario escribe
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validación al salir del campo (onBlur)
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "passwordRepeat") {
      if (value !== formData.password) {
        setErrors((prev) => ({ ...prev, passwordRepeat: "Las contraseñas no coinciden" }));
      } else {
        setErrors((prev) => ({ ...prev, passwordRepeat: "" }));
      }
      return;
    }

    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Envío del formulario
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Errors = {
      name: validateField("name", formData.name),
      surnames: validateField("surnames", formData.surnames),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
      passwordRepeat: formData.password !== formData.passwordRepeat 
        ? "Las contraseñas no coinciden" 
        : "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      console.log("✅ Formulario enviado correctamente:", formData);
      alert("¡Registro exitoso!");
      // Aquí iría tu lógica de registro (Supabase, Firebase, API, etc.)
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl m-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Crear Cuenta</h1>
          <p className="text-gray-500">Completa tus datos para registrarte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            id="name"
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
            id="surnames"
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
            id="email"
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
            id="password"
            label="Contraseña"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
          />

          <InputField
            id="passwordRepeat"
            label="Repetir Contraseña"
            name="passwordRepeat"
            type="password"
            placeholder="Repite tu contraseña"
            value={formData.passwordRepeat}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.passwordRepeat}
          />

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Registrarse
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}