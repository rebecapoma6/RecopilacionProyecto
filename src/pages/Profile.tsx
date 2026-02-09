import { useState } from 'react';
import InputField from '../components/form/InputField';
import Select from '../components/form/Select';
import Button from '../components/form/Button';

export default function Profile() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Datos modificados:', formData);
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Modificar Datos</h1>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Nombre"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
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
        <Select
          label="Rol"
          name="role"
          options={[
            { value: 'user', label: 'Usuario' },
            { value: 'admin', label: 'Admin' },
          ]}
          value={formData.role}
          onChange={handleChange}
        />
        <Button type="submit">Guardar Cambios</Button>
      </form>
    </div>
  );
}