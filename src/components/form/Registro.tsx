import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { validateField } from "../../utils/regex";
import Button from "./Button";
import InputField from "./InputField";

interface DatosFormularioProps {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

interface ErrorsProps {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

export default function Registro() {
  const [datosFormulario, setDatosFormulario] = useState<DatosFormularioProps>({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [errors, setErrors] = useState<ErrorsProps>({
    nombre: "",
    apellidos: "",
    email: "",
    password: "",
    passwordRepeat: ""
  });

  // Manejar cambios en los inputs
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));

    // Limpiar error del campo mientras el usuario escribe
    if (errors[name as keyof ErrorsProps]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Validación al salir del campo (onBlur)
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "passwordRepeat") {
      if (value !== datosFormulario.password) {
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

    const newErrors = {
      nombre: validateField("nombre", datosFormulario.nombre),
      apellidos: validateField("apellidos", datosFormulario.apellidos),
      email: validateField("email", datosFormulario.email),
      password: validateField("password", datosFormulario.password),
      passwordRepeat: datosFormulario.password !== datosFormulario.passwordRepeat 
        ? "Las contraseñas no coinciden" 
        : "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (!hasErrors) {
      console.log("✅ Formulario enviado correctamente:", datosFormulario);
      alert("¡Registro exitoso!");
    }
  };

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-md p-3 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Crear Cuenta</h1>
          <p className="text-gray-500">Completa tus datos para registrarte</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <InputField
            id="nombre"
            label="Nombre"
            name="nombre"
            type="text"
            placeholder="Tu nombre"
            value={datosFormulario.nombre}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.nombre}
          />

          <InputField
            id="apellidos"
            label="Apellidos"
            name="apellidos"
            type="text"
            placeholder="Tus apellidos"
            value={datosFormulario.apellidos}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.apellidos}
          />

          <InputField
            id="email"
            label="Correo Electrónico"
            name="email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={datosFormulario.email}
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
            value={datosFormulario.password}
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
            value={datosFormulario.passwordRepeat}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.passwordRepeat}
          />

          <div className="flex gap-4 pt-6">
            <Button
              type="button"
              className="w-full py-1 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="w-full py-1 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
            >
              Registrarse
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}