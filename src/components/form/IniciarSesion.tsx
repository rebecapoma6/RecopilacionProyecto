import { useState, type ChangeEvent, type FocusEvent, type FormEvent} from "react";
import InputFieldClase from "./InputField";
import Button from "./Button";
import { validateField } from "../../utils/regex";


interface LoginDataProps {
    username: string;
    password: string;
}

interface LoginErrorProps{
    username?: string;
    password?: string;
}

export default function LoginForm(){
    //1. Estado para los datos
    const[formData, setFormData] = useState<LoginDataProps>({
        username: "",
        password: "",        
    });

     // 2. Estado para los errores
    const [errors, setErrors] = useState<LoginErrorProps>({
        username:"",
        password:"",
    });

    // Actualiza el valor del campo mientras el usuario escribe.
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const{name, value } = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
        setErrors((prev) => ({...prev, [name]: ""}));
    };

     // Valida el campo cuando el usuario sale de él (pierde el foco).
    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({...prev, [name]: error}));
    }

    // Manejo del envío del formulario
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Validamos todo de golpe antes de enviar
        const newErrors = {
            email: validateField("email", formData.username),
            password: validateField("password", formData.password),
        };
        setErrors(newErrors);

        // Si no hay errores (ningún string tiene texto), procedemos
        const hasErrors = Object.values(newErrors).some(Boolean);

        if(!hasErrors){
            alert("¡Inicio de sesión exitoso! 🔓");
        }

    };

    return(
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
            <h2 className="text-4xl-h1 font-bold text-center mb-4">Iniciar Sesión</h2>
            <p className="text-base-body text-center mb-4">Ingresa las credenciales para acceder</p>

            <InputFieldClase
            label="Usuario"
            name="usuario"
            type="text"
            value={formData.username}
            error={errors.username}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
            placeholder="Tu nombre de usuario"            
            ></InputFieldClase>

            <InputFieldClase
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            error={errors.password}
            onChange={handleChange}
            onBlur={handleBlur}
            autoComplete="off"
            placeholder="Tu contraseña"    
            ></InputFieldClase>

            <Button type="submit">Cancelar</Button>
            <Button type="submit">Iniciar Sesión</Button>
            
        </form>
    )


}