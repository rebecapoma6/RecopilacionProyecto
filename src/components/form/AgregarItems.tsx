import { useState, type ChangeEvent, type FocusEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Select from "./Select";
import InputField from "./InputField";
import Button from "./Button";
import { validateField } from "../../utils/regex";
import type { Product } from "../../interfaces/Products";
import { SupabaseProductRepository } from "../../database/supabase/SupabaseProductRepository";
import ImageInput from "./ImageInput";
import toast from 'react-hot-toast';

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
  const productToEdit: Product | undefined = initialData || location.state?.product;

  const [datosFormulario, setDatosFormulario] = useState<DatosFormularioProps>({
    tipo: productToEdit?.tipo || "",
    titulo: productToEdit?.titulo || "",
    autor: productToEdit?.autor || "",
    genero: productToEdit?.genero || "",
    fecha_fin: productToEdit?.fecha_fin?.toString() || "",
    puntuacion: productToEdit?.puntuacion || 0,
    reseña: productToEdit?.resena || "",
    imagen: productToEdit?.imagen_url || "",
  });

  const [errors, setErrors] = useState<ErrorsProps>({ tipo: "", titulo: "", autor: "", genero: "", fecha_fin: "", puntuacion: "", reseña: "", imagen: "" });

  const opcionesGenero = [
    { value: "", label: "Selecciona un género de libro o videojuego" },
    { value: "fantasía", label: "Fantasía", tipo: "Libro" },
    { value: "terror", label: "Terror", tipo: "Libro" },
    { value: "ciencia-ficción", label: "Ciencia ficción", tipo: "Libro" },
    { value: "novelanegra", label: "Novela negra", tipo: "Libro" },
    { value: "ensayo", label: "Ensayo", tipo: "Libro" },
    { value: "poesia", label: "Poesía", tipo: "Libro" },
    { value: "shooter", label: "Shooter (FPS/TPS)", tipo: "Videojuego" },
    { value: "rpg", label: "RPG / Rol", tipo: "Videojuego" },
    { value: "survaival", label: "Survival horror", tipo: "Videojuego" },
    { value: "estrategia", label: "Estrategia", tipo: "Videojuego" },
    { value: "lucha", label: "Lucha / Fighting", tipo: "Videojuego" },
    { value: "battleroyale", label: "Battle Royale", tipo: "Videojuego" },
  ];

  const opcionesTipo = [
    { value: "", label: "Selecciona un tipo" },
    { value: "libro", label: "Libro" },
    { value: "videojuego", label: "Videojuego" },
  ];

  const handleImage = (file: File) => {
    setDatosFormulario((prev) => ({ ...prev, imagen_file: file }));
    setErrors((prev) => ({ ...prev, imagen: "" }));
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

    const newErrors = {
      tipo: validateField("tipo", datosFormulario.tipo),
      titulo: validateField("titulo", datosFormulario.titulo),
      autor: validateField("autor", datosFormulario.autor),
      genero: validateField("genero", datosFormulario.genero),
      fecha_fin: validateField("fecha_fin", datosFormulario.fecha_fin),
      puntuacion: validateField("puntuacion", datosFormulario.puntuacion.toString()),
      reseña: validateField("reseña", datosFormulario.reseña),
      imagen: validateField("imagen", datosFormulario.imagen),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    if (productToEdit) {
      const { error } = await repository.updateProduct({
        ...productToEdit,
        titulo: datosFormulario.titulo,
        resena: datosFormulario.reseña,
        imagen_url: datosFormulario.imagen,
        imagen_file: datosFormulario.imagen_file,
        tipo: datosFormulario.tipo,
        genero: datosFormulario.genero,
        autor: datosFormulario.autor,
        fecha_fin: new Date(datosFormulario.fecha_fin),
        puntuacion: datosFormulario.puntuacion,
      });

      if (error) {
        toast.error("Error al actualizar");
        console.error(error);
        return;
      }

      toast.success("Producto actualizado correctamente");
    } else {
      const { error } = await repository.createProduct({
        titulo: datosFormulario.titulo,
        resena: datosFormulario.reseña,
        imagen_url: datosFormulario.imagen,
        imagen_file: datosFormulario.imagen_file,
        tipo: datosFormulario.tipo,
        genero: datosFormulario.genero,
        autor: datosFormulario.autor,
        fecha_fin: new Date(datosFormulario.fecha_fin),
        puntuacion: datosFormulario.puntuacion,
        id: null,
      });

      if (error) {
        toast.error("Error al guardar");
        console.error(error);
        return;
      }

      toast.success("Registro creado correctamente");
    }

    navigate('/products');
  };

  return (
    <div>
      <div className="mb-6 text-left">
        <p className="app-muted mt-1 text-sm">Mantén tu colección actualizada con el mismo estilo que el resto de formularios.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Select name="tipo" label="Tipo" value={datosFormulario.tipo} options={opcionesTipo} onChange={handleChange} onBlur={handleBlur} />
        {errors.tipo && <p className="text-sm text-red-500">{errors.tipo}</p>}

        <InputField label="Título" placeholder="Título de libro o videojuego" name="titulo" type="text" value={datosFormulario.titulo} onChange={handleChange} onBlur={handleBlur} error={errors.titulo} />
        <InputField label="Autor" placeholder="Nombre del autor o creador" name="autor" type="text" value={datosFormulario.autor} onChange={handleChange} onBlur={handleBlur} error={errors.autor} />

        <Select name="genero" label="Género" value={datosFormulario.genero} options={opcionesGenero} onChange={handleChange} onBlur={handleBlur} />
        {errors.genero && <p className="text-sm text-red-500">{errors.genero}</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <InputField label="Fecha fin" name="fecha_fin" type="date" value={datosFormulario.fecha_fin} onChange={handleChange} onBlur={handleBlur} error={errors.fecha_fin} />
          <InputField label="Puntuación" name="puntuacion" type="number" value={datosFormulario.puntuacion} onChange={handleChange} onBlur={handleBlur} error={errors.puntuacion} />
        </div>

        <InputField label="Reseña" name="reseña" type="text" value={datosFormulario.reseña} onChange={handleChange} onBlur={handleBlur} error={errors.reseña} />

        <div className="app-surface rounded-2xl border p-4">
          <p className="mb-3 text-sm font-medium">Imagen del item</p>
          <ImageInput name="ImagenProducto" defaultImageUrl={datosFormulario.imagen} onFileSelect={handleImage} />
        </div>

        <div className="flex flex-col gap-3 pt-3 sm:flex-row">
          <Button type="button" onClick={() => navigate('/products')} variant="secondary" className="w-full">Cancelar</Button>
          <Button type="submit" className="w-full">{productToEdit ? 'Actualizar' : 'Guardar'}</Button>
        </div>
      </form>
    </div>
  );
}
