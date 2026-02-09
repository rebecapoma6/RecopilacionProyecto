import { useState } from 'react';
import InputField from '../components/form/InputField';
import Button from '../components/form/Button';

export default function RecuperarPass() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Recuperando contraseña para:', email);
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Recuperar Contraseña</h1>
      <form onSubmit={handleSubmit}>
        <InputField
          label="Email"
          id="email"
          type="email"
          name="email"
          value={email}
          onChange={handleChange}
          error={error}
        />
        <Button type="submit">Enviar Enlace de Recuperación</Button>
      </form>
    </div>
  );
}