import { useState, type ChangeEvent, type FocusEvent } from "react";
import Select from "../components/form/Select";
import InputField from "../components/form/InputField";
import { validateField } from "../utils/regex";
import Button from "../components/form/Button";


interface DatosFormularioProps {
    tipo: string,
    titulo: string;
    autor: string;
    genero: string;
    fecha_fin: string;
    puntuacion: number;
    reseña: string;
    imagen: string;
}

interface ErrorsProps {
    tipo: string,
    titulo: string;
    autor: string;
    genero: string;
    fecha_fin: string;
    puntuacion: string;
    reseña: string;
    imagen: string;
}

export default function FormularioLibros() {

    const [datosFormulario, setDatosFormulario] = useState<DatosFormularioProps>({
        tipo: "",
        titulo: "",
        autor: "",
        genero: "",
        fecha_fin: "",
        puntuacion: 0,
        reseña: "",
        imagen: ""
    });

    const [errors, setErrors] = useState<ErrorsProps>({
        tipo: "",
        titulo: "",
        autor: "",
        genero: "",
        fecha_fin: "",
        puntuacion: "",
        reseña: "",
        imagen: ""
    });

    const OpcionesGenero = [
        { value: "", label: "Selecciona un género de libro/videojuego" },
        { value: "fantasía", label: "Fantasía", tipo: "Libro" },
        { value: "terror", label: "Terror", tipo: "Libro" },
        { value: "ciencia-ficción", label: "Ciencia-Ficción", tipo: "Libro" },
        { value: "novelanegra", label: "Novela Negra", tipo: "Libro" },
        { value: "ensayo", label: "Ensayo", tipo: "Libro" },
        { value: "poesia", label: "Poesía", tipo: "Libro" },
        { value: "shooter", label: "Shooter (FPS/TPS)", tipo: "Videojuego" },
        { value: "rpg", label: "RPG/Rol", tipo: "Videojuego" },
        { value: "survaival", label: "Survival Horror", tipo: "Videojuego" },
        { value: "estrategia", label: "Estrategia", tipo: "Videojuego" },
        { value: "lucha", label: "Lucha/Fighting", tipo: "Videojuego" },
        { value: "battleroyale", label: "Battle Royale", tipo: "Videojuego" }
    ];

    const OpcionesTipo = [
        { value: "", label: "Selecciona un tipo" },
        { value: "libro", label: "Libro" },
        { value: "videojuego", label: "Videojuego" },
    ];

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDatosFormulario((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();


        console.log("Libro creado");

        const newErrors = {
            tipo: validateField("tipo", datosFormulario.tipo),
            titulo: validateField("titulo", datosFormulario.titulo),
            autor: validateField("autor", datosFormulario.autor),
            genero: validateField("genero", datosFormulario.genero),
            fecha_fin: validateField("fecha_fin", datosFormulario.fecha_fin),
            puntuacion: validateField("puntuacion", datosFormulario.puntuacion.toString()),
            reseña: validateField("reseña", datosFormulario.reseña),
            imagen: validateField("imagen", datosFormulario.imagen)
        };
        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some(Boolean);
        if (!hasErrors) {
            alert("Formulario válido ✅");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-200">
            <form onSubmit={handleSubmit} className="
        bg-primary-300
        p-6
        rounded-xl
        shadow-xl
        space-y-5
        font-sf-pro
        w-full
        max-w-md
      ">

                <Select className="bg-white"
                    name="tipo"
                    label="Tipo"
                    value={datosFormulario.tipo}
                    options={OpcionesTipo}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.tipo}

                <InputField className="bg-white"
                    label={"Título:"}
                    placeholder="Título de libro o videojuego"
                    name="titulo"
                    type="text"
                    value={datosFormulario.titulo}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.titulo}
                ></InputField>

                <InputField className="bg-white"
                    label={"Autor:"}
                    placeholder="Nombre del autor/creador"
                    name="autor"
                    type="text"
                    value={datosFormulario.autor}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.autor}
                ></InputField>

                <Select className="bg-white"
                    name="genero"
                    label="Género"
                    value={datosFormulario.genero}
                    options={OpcionesGenero}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.genero}

                <InputField className="bg-white"
                    label={"Fecha Fin:"}
                    name="fecha_fin"
                    type="date"
                    value={datosFormulario.fecha_fin}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.fecha_fin}
                ></InputField>

                <InputField className="bg-white"
                    label={"Puntuación:"}
                    name="puntuacion"
                    type="number"
                    value={datosFormulario.puntuacion}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.puntuacion}
                ></InputField>

                <InputField className="bg-white"
                    label={"Reseña:"}
                    name="reseña"
                    type="text"
                    value={datosFormulario.reseña}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.reseña}
                ></InputField>

                <InputField className="bg-white"
                    label={"Imagen:"}
                    name="imagen"
                    type="file"
                    value={datosFormulario.imagen}
                    autoComplete="off"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.imagen}
                ></InputField>

                <Button
                    type="submit"
                    className="
          w-full
          bg-primary-700
          hover:bg-primary-600
          text-white
          font-medium
          py-2
          rounded-md
          transition
        "
                >
                    Enviar
                </Button>

                <Button
                    type="submit"
                    className="
          w-full
          bg-neutral-400
          hover:bg-neutral-500
          text-white
          font-medium
          py-2
          rounded-md
          transition
        "
                >
                    Cancelar
                </Button>
            </form>
        </div>
    );
}