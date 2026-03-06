import { useState, type ChangeEvent, type FocusEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "./Select";
import InputField from "./InputField";
import Button from "./Button";
import { validateField } from "../../utils/regex";
import type { Product } from "../../interfaces/Products";
import { SupabaseProductRepository } from "../../database/supabase/SupabaseProductRepository";
import ImageInput from "./ImageInput";

interface DatosFormularioProps {
    tipo: string;
    titulo: string;
    autor: string;
    genero: string;
    fecha_fin: string;
    puntuacion: number;
    reseña: string;
    imagen: string;
    imagen_file?: File;
}

interface ErrorsProps {
    tipo: string;
    titulo: string;
    autor: string;
    genero: string;
    fecha_fin: string;
    puntuacion: string;
    reseña: string;
    imagen: string;
}

interface AgregarItemsProps {
    initialData?: Product;
}

export default function AgregarItems({ initialData }: AgregarItemsProps) {
    const repository = new SupabaseProductRepository();
    const navigate = useNavigate();
    const location = useLocation();

    // Si vienen datos desde navigate.state
    const productToEdit: Product | undefined = initialData || location.state?.product;

    const [datosFormulario, setDatosFormulario] = useState<DatosFormularioProps>({
        tipo: productToEdit?.tipo || "",
        titulo: productToEdit?.titulo || "",
        autor: productToEdit?.autor || "",
        genero: productToEdit?.genero || "",
        fecha_fin: productToEdit?.fecha_fin?.toString() || "",
        puntuacion: productToEdit?.puntuacion || 0,
        reseña: productToEdit?.resena || "",
        imagen: productToEdit?.imagen_url || ""
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

    const handleImage = (file: File) => {
        setDatosFormulario(prev => ({ ...prev, imagen_file: file }));
        setErrors(prev => ({ ...prev, imagen: "" })); // Limpiamos error de imagen si lo había
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validaciones
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
        if (hasErrors) return;

        if (productToEdit) {
            // Actualizar producto
            const { data, error } = await repository.updateProduct({
                ...productToEdit,
                titulo: datosFormulario.titulo,
                resena: datosFormulario.reseña,
                imagen_url: datosFormulario.imagen,
                imagen_file: datosFormulario.imagen_file,
                tipo: datosFormulario.tipo,
                genero: datosFormulario.genero,
                autor: datosFormulario.autor,
                fecha_fin: new Date(datosFormulario.fecha_fin),
                puntuacion: datosFormulario.puntuacion
            });

            if (error) {
                alert("Error al actualizar ❌");
                console.error(error);
                return;
            }

            alert("Producto actualizado correctamente ✅");
        } else {
            // Crear nuevo producto
            const { data, error } = await repository.createProduct({
                titulo: datosFormulario.titulo,
                resena: datosFormulario.reseña,
                imagen_url: datosFormulario.imagen,
                imagen_file: datosFormulario.imagen_file, // <--- ESTO ES LO QUE FALTA
                tipo: datosFormulario.tipo,
                genero: datosFormulario.genero,
                autor: datosFormulario.autor,
                fecha_fin: new Date(datosFormulario.fecha_fin),
                puntuacion: datosFormulario.puntuacion,
                id: null
            });

            if (error) {
                alert("Error al guardar ❌");
                console.error(error);
                return;
            }

            alert("Registro creado correctamente ✅");
        }

        navigate("/");
    };


    

   return (
  <div className="w-screen h-screen flex items-center justify-center bg-primary-200 font-sf-pro">
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md p-8 bg-primary-300 rounded-2xl shadow-xl space-y-5"
    >
      {/* Tipo */}
      <Select
        className="bg-white"
        name="tipo"
        label="Tipo"
        value={datosFormulario.tipo}
        options={OpcionesTipo}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors.tipo && <p className="text-red-500 text-sm">{errors.tipo}</p>}

      {/* Título */}
      <InputField
        className="bg-white"
        label="Título:"
        placeholder="Título de libro o videojuego"
        name="titulo"
        type="text"
        value={datosFormulario.titulo}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.titulo}
      />

      {/* Autor */}
      <InputField
        className="bg-white"
        label="Autor:"
        placeholder="Nombre del autor/creador"
        name="autor"
        type="text"
        value={datosFormulario.autor}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.autor}
      />

      {/* Género */}
      <Select
        className="bg-white"
        name="genero"
        label="Género"
        value={datosFormulario.genero}
        options={OpcionesGenero}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {errors.genero && <p className="text-red-500 text-sm">{errors.genero}</p>}

      {/* Fecha Fin */}
      <InputField
        className="bg-white"
        label="Fecha Fin:"
        name="fecha_fin"
        type="date"
        value={datosFormulario.fecha_fin}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.fecha_fin}
      />

      {/* Puntuación */}
      <InputField
        className="bg-white"
        label="Puntuación:"
        name="puntuacion"
        type="number"
        value={datosFormulario.puntuacion}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.puntuacion}
      />

      {/* Reseña */}
      <InputField
        className="bg-white"
        label="Reseña:"
        name="reseña"
        type="text"
        value={datosFormulario.reseña}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.reseña}
      />

      {/* Imagen */}
      <ImageInput 
        name="ImagenProducto"
        defaultImageUrl={datosFormulario.imagen}
        onFileSelect={handleImage}>
      </ImageInput>
      

      {/* Botón Enviar / Actualizar */}
      <Button
        type="submit"
        className="w-full py-3 bg-primary-700 hover:bg-primary-600 text-white font-medium rounded-lg transition"
      >
        {productToEdit ? "Actualizar" : "Enviar"}
      </Button>

      {/* Botón Cancelar */}
      <Button
        type="button"
        onClick={() => navigate("/")}
        className="w-full py-3 bg-neutral-400 hover:bg-neutral-500 text-white font-medium rounded-lg transition"
      >
        Cancelar
      </Button>
    </form>
  </div>
);
}