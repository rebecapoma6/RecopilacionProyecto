import { useState } from 'react';
import InputField from '../form/InputField';
import Button from '../form/Button';
import '../../index.css';  
import { validateField } from '../../utils/regex';

interface DatosFormularioProps {
  email: string,
  password: string
}

interface ErrorsProps{
  email: string,
  password: string
}

export default function IniciarSesion() {
  const [datosFormulario, setDatosFormulario] = useState<DatosFormularioProps>({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState<ErrorsProps>({
    email: "",
    password: ""
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos de inicio de sesión:', datosFormulario);
  

  const newErrors = {
    email: validateField("email", datosFormulario.email),
    password: validateField("password", datosFormulario.password)
  };
    setErrors(newErrors);
  
          const hasErrors = Object.values(newErrors).some(Boolean);
          if (!hasErrors) {
              alert("Formulario válido ✅");
          }
          };

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl m-15">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Iniciar Sesión</h1>
          <p className="text-gray-500">Ingresa tus credenciales para acceder</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Email"
            id="email"
            type="email"
            name="email"
            value={datosFormulario.email}
            onChange={handleChange}
          />
          {errors.email}
          <InputField
            label="Contraseña"
            id="password"
            type="password"
            name="password"
            value={datosFormulario.password}
            onChange={handleChange}
          />
          {errors.password}
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
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}