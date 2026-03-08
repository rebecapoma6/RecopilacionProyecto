import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ImageInput({ name, onFileSelect, defaultImageUrl = null, maxSizeMB = 1 }: {
  name: string;
  onFileSelect: (file: File) => void;
  defaultImageUrl?: string | null;
  maxSizeMB?: number;
}) {
  const [previewUrl, setPreview] = useState<string | null>(defaultImageUrl);

  useEffect(() => {
    // Si la URL cambia externamente (ej. al cargar el producto para editar), actualizamos
    setPreview(defaultImageUrl);
  }, [defaultImageUrl]);

  useEffect(() => {
    return () => {
      // SOLO revocar si es un blob generado localmente
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`La imagen supera ${maxSizeMB}MB`);
      e.target.value = "";
      return;
    }
    
    // Crear nueva vista previa y liberar la anterior si existía
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onFileSelect(file);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Solo renderizar si existe previewUrl para evitar warnings de src="" */}
      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Vista previa"
          className="w-48 h-48 object-cover rounded bg-gray-100"
        />
      ) : (
        <div className="w-48 h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
          Sin imagen
        </div>
      )}
      
      <label className="cursor-pointer text-blue-600">
        Seleccionar imagen
        <input type="file" id={name} accept="image/*" onChange={handleChange} hidden />
      </label>
    </div>
  );
}