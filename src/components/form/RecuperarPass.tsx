import { useState } from 'react';
import { validateField } from '../../utils/regex';
import InputFieldClase from './InputField';
import Button from './Button';
import { useNavigate } from 'react-router-dom';
import { createUserRepository } from '../../database/repositories';
import toast from 'react-hot-toast';


export default function RecuperarPass() {
    const navigate = useNavigate();
    const userRepository = createUserRepository();

    const [formData, setFormData] = useState({ email: "" });
    const [errors, setErrors] = useState({ email: "" });

    const [enviado, setEnviado] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: validateField("email", value) }); // Usamos lógica de email
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = validateField("email", formData.email);
        if (error) {
            setErrors({ email: error });
            return;
        }
        // Lógica de envío...
        setEnviado(true);

        try {
            if (!formData.email) {
                toast.error('Error al obtener el email');
                setLoading(false);
                return;
            }
        
        const result = await userRepository.resetPasswordForEmail(formData.email);
        
        if (result.error) {
                toast.error('Error al restablecer la contraseña');
                setLoading(false);
                return;
            }

            toast.success('Se ha enviado un enlace a tu correo');
            setEnviado(true);



            
        } catch (error) {
            toast.error('Ocurrió un error inesperado');
            console.log(error);
        }finally {
            setLoading(false);
        }
        




    };

    return (
       <>
            <div className="p-3 rounded-lg shadow-sm bg-white">
                {!enviado ? (
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <h2 className="text-xl font-bold">Recuperar Acceso</h2>
                        <InputFieldClase
                            label="Correo Electrónico"
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-primary-700 hover:bg-primary-600 text-white font-medium py-2 rounded-md transition"
                        >
                            {loading ? 'Enviando...' : 'Enviar Email'}
                        </Button>
                    </form>
                ) : (
                    <div className="text-center">
                        <p className="text-green-600 font-medium">Revisa tu bandeja de entrada</p>
                        <Button
                            variant="primary"
                            onClick={() => navigate("/")}
                            className="w-full mt-4"
                        >
                            Volver al Inicio
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}