import { useState, useEffect, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { validateField } from "../../utils/regex";
import Button from "./Button";
import InputField from "./InputField";

import { SupabaseUserRepository } from "../../database/supabase/SupabaseUserRepository";

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

export default function EditarPerfil() {
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
    passwordRepeat: "",
  });

  const [loading, setLoading] = useState(false);

  // Cargar datos actuales del usuario (una sola vez)
  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        const { data: user, error } = await userRepository.getCurrentUser();
        if (error || !user) {
          alert("No se pudo cargar tu perfil. Inicia sesión nuevamente.");
          return;
        }

        setDatosFormulario({
          username: (user.user_metadata?.username as string) || "",
          email: user.email || "",
          password: "",           // nunca mostramos la contraseña actual
          passwordRepeat: "",
        });
      } catch (err) {
        console.error(err);
        alert("Error al cargar perfil");
      }
    };

    cargarUsuario();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof ErrorsProps]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Contraseña repetida (solo validar si el usuario está intentando cambiar contraseña)
    if (name === "passwordRepeat") {
      if (datosFormulario.password && value !== datosFormulario.password) {
        setErrors((prev) => ({ ...prev, passwordRepeat: "Las contraseñas no coinciden" }));
      } else {
        setErrors((prev) => ({ ...prev, passwordRepeat: "" }));
      }
      return;
    }

    // Nueva contraseña (opcional)
    if (name === "password") {
      const error = value ? validateField("password", value) : "";
      setErrors((prev) => ({ ...prev, password: error }));
      return;
    }

    // username y email
    const error = validateField(name === "username" ? "nombre" : name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validaciones
    const newErrors: ErrorsProps = {
      username: validateField("nombre", datosFormulario.username),
      email: validateField("email", datosFormulario.email),
      password: datosFormulario.password
        ? validateField("password", datosFormulario.password)
        : "",
      passwordRepeat: datosFormulario.password
        ? (datosFormulario.password !== datosFormulario.passwordRepeat
            ? "Las contraseñas no coinciden"
            : "")
        : "",
    };

    setErrors(newErrors);
    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) return;

    setLoading(true);

    try {
      // Solo enviamos lo que el usuario quiere cambiar
      const dataToSend: any = {
        username: datosFormulario.username,
        email: datosFormulario.email,
      };
      if (datosFormulario.password) {
        dataToSend.password = datosFormulario.password;
      }

      const { error } = await userRepository.updateUser(dataToSend);

      if (error) {
        alert("Error al actualizar: " + (error.message || "Error desconocido"));
      } else {
        alert("✅ ¡Datos actualizados correctamente!");
        // Opcional: recargar para ver cambios inmediatos
        // window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-neutral-100 font-sf-pro">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
        <div className="text-left mb-6">
          <h1 className="text-2xl font-bold text-primary-50 mb-1">Editar Perfil</h1>
          <p className="text-neutral-500 text-sm">Actualiza tu información</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="username"
            label="Nombre de usuario"
            name="username"
            type="text"
            placeholder="Tu nombre de usuario"
            value={datosFormulario.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.username}
          />

          <InputField
            id="email"
            label="Correo electrónico"
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
            label="Nueva contraseña (opcional)"
            name="password"
            type="password"
            placeholder="Nueva contraseña"
            value={datosFormulario.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
          />

          <InputField
            id="passwordRepeat"
            label="Repetir nueva contraseña"
            name="passwordRepeat"
            type="password"
            placeholder="Repetir nueva contraseña"
            value={datosFormulario.passwordRepeat}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.passwordRepeat}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={() => window.history.back()}
              className="w-full py-2 bg-white border border-neutral-300 text-neutral-600 font-medium rounded-lg hover:bg-neutral-100 transition"
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full py-2 text-white font-medium rounded-lg transition ${
                loading ? "bg-primary-400" : "bg-primary-50 hover:bg-primary-700"
              }`}
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}