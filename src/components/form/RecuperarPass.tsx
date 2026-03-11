import { useState } from 'react';
import { validateField } from '../../utils/regex';
import InputFieldClase from './InputField';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

export default function RecuperarPass() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '' });
  const [errors, setErrors] = useState({ email: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField('email', value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const error = validateField('email', formData.email);
    if (error) {
      setErrors({ email: error });
      return;
    }
    setEnviado(true);
  };

  return (
    <div>
      {!enviado ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4 text-left">
            <p className="app-muted mt-1 text-sm">Te enviaremos indicaciones a tu correo electrónico.</p>
          </div>

          <InputFieldClase label="Correo electrónico" id="email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button type="button" variant="secondary" onClick={() => navigate('/iniciarSesion')} className="w-full">Volver</Button>
            <Button type="submit" className="w-full">Enviar email</Button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          <p className="text-base font-medium text-success-700">Revisa tu bandeja de entrada.</p>
          <Button variant="primary" onClick={() => navigate('/')} className="mt-4 w-full">Volver al inicio</Button>
        </div>
      )}
    </div>
  );
}
