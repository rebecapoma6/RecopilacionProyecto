import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { validateField } from "../../utils/regex";
import Button from "./Button";
import InputField from "./InputField";
import { SupabaseUserRepository } from "../../database/supabase/SupabaseUserRepository";
import { useNavigate } from "react-router-dom";


const userRepository = new SupabaseUserRepository();

interface DatosFormularioProps {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

interface ErrorsProps {
  username: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

export default function Registro() {
  const navigate = useNavigate();
  const [datosFormulario, setDatosFormulario] = useState<DatosFormularioProps>({
    username: "",
    email: "",
    password: "",
    passwordRepeat: "",
  });

  const [errors, setErrors] = useState<ErrorsProps>({
    username: "",
    email: "",
    password: "",
    passwordRepeat: ""
  });

  const [loading, setLoading] = useState(false);


  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ErrorsProps]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };


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


    const error = validateField(name === "username" ? "nombre" : name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Envío del formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors = {
      username: validateField("nombre", datosFormulario.username),
      email: validateField("email", datosFormulario.email),
      password: validateField("password", datosFormulario.password),
      passwordRepeat: datosFormulario.password !== datosFormulario.passwordRepeat
        ? "Las contraseñas no coinciden"
        : "",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((error) => error !== "");

    if (hasErrors) return;

    setLoading(true);

    try {
      const dataToSend = {
        email: datosFormulario.email,
        password: datosFormulario.password,
        username: datosFormulario.username,
        role: 'user'
      };

      const { data, error } = await userRepository.createUser(dataToSend);

      if (error) {
        alert("Error al registrar: " + (error.message || "Error desconocido"));
        console.error(error);
      } else {
        console.log("✅username registrado:", data);
        alert("¡Registro exitoso!");

      }

    } catch (err) {
      console.error("Error crítico:", err);
      alert("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="flex justify-center items-center min-h-screen bg-neutral-100 font-sf-pro">

      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
        <div className="text-left mb-6">

          <h1 className="text-2xl font-bold text-primary-50 mb-1">Crear Cuenta</h1>
          <p className="text-neutral-500 text-sm">Crea una nueva cuenta para comenzar</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <InputField
            id="username"
            label="username"
            name="username"
            type="text"
            placeholder="Tu nombre deusername"
            value={datosFormulario.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.username}

          />

          <InputField
            id="email"
            label="Correo"
            name="email"
            type="email"
            placeholder="Tu correo electrónico"
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
            placeholder="contraseña"
            value={datosFormulario.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
          />

          <InputField
            id="passwordRepeat"
            label="Repetir contraseña"
            name="passwordRepeat"
            type="password"
            placeholder="contraseña"
            value={datosFormulario.passwordRepeat}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.passwordRepeat}
          />

          <div className="flex gap-4 pt-4">
            {/* <Button
              type="button"
              
              className="w-full py-2 bg-white border border-neutral-300 text-neutral-600 font-medium rounded-lg hover:bg-neutral-100 transition"
            >
              Cancelar
            </Button> */}
            <Button
              type="button"
              onClick={() => navigate("/")}
              className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition cursor-pointer"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-medium rounded-lg transition ${loading ? 'bg-primary-400' : 'bg-primary-50 hover:bg-primary-700'}`}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}