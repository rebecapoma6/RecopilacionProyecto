import { useState } from 'react';
import InputField from '../components/form/InputField';
import Button from '../components/form/Button';

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos de inicio de sesión:', formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-2xl shadow-xl m-4">
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
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="Contraseña"
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
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
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}