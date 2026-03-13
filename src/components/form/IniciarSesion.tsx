import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserRepository } from '../../database/repositories';
import { useAuthStore } from '../../store/useAuthStore';
import toast, { Toaster } from 'react-hot-toast';
import InputField from '../form/InputField';
import Button from '../form/Button';
import '../../index.css';
import { validateField } from '../../utils/regex';
import { useTranslation } from 'react-i18next';

interface DatosFormularioProps {
  email: string;
  password: string;
}

interface ErrorsProps {
  email: string;
  password: string;
}

export default function IniciarSesion() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const userRepository = createUserRepository();

  const [loading, setLoading] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState<DatosFormularioProps>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<ErrorsProps>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: validateField('email', datosFormulario.email),
      password: validateField('password', datosFormulario.password),
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    setLoading(true);

    try {
      const result = await userRepository.login(datosFormulario.email, datosFormulario.password);

      if (result.error) {
        toast.error(result.error.message || t('auth.login.invalidCredentials'));
      } else if (result.data) {
        const supabaseUser = result.data.user;

        if (!supabaseUser) {
          toast.error(t('auth.login.userInfoError'));
          return;
        }

        await setSession(result.data, supabaseUser);
        const { data: role } = result.data.profile?.id
          ? await userRepository.fetchRole(result.data.profile.id)
          : { data: null };

        toast.success(t('auth.login.welcomeBack'));
        navigate(role === 'admin' ? '/vistaAdmin' : '/products');
      }
    } catch (err) {
      toast.error(t('auth.login.connectionError'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toaster position="top-center" />

      <div className="mb-6 text-left">
        <p className="app-muted mt-1 text-sm">{t('auth.login.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <InputField label={t('auth.fields.emailLabel')} id="email" type="email" name="email" placeholder={t('auth.fields.emailPlaceholder')} value={datosFormulario.email} onChange={handleChange} />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <InputField label={t('auth.fields.passwordLabel')} id="password" type="password" name="password" placeholder={t('auth.fields.passwordPlaceholder')} value={datosFormulario.password} onChange={handleChange} />
          {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}

          <div className="mt-2 flex justify-end">
            <Link to="/recuperarPass" className="text-sm font-medium text-primary-600 transition hover:text-primary-700">
              {t('auth.login.forgotPassword')}
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-3 sm:flex-row">
          <Button type="button" onClick={() => navigate('/')} variant="secondary" className="w-full">{t('common.back')}</Button>
          <Button type="submit" disabled={loading} className="w-full">{loading ? t('auth.login.submitting') : t('auth.login.submit')}</Button>
        </div>

        <div className="border-t border-[var(--app-border)] pt-5 text-center">
          <p className="app-muted text-sm">{t('auth.login.noAccount')}</p>
          <Link to="/registro" className="mt-2 inline-block font-semibold text-primary-600 transition hover:text-primary-700">
            {t('auth.login.createNow')}
          </Link>
        </div>
      </form>
    </div>
  );
}
