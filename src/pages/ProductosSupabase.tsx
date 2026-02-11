import { useNavigate } from "react-router-dom";
import Button from "../components/form/Button";

export default function ProductosSupabase(){
const navigate = useNavigate();
    return(
        <>
        <div className="bg-primary-400">
        <h2 className="text-primary-50">Mi Colección</h2>
        <p className="text-primary-700">Gestiona tus libros y videojuegos favoritos</p>
        <Button
      type="button"
      onClick={() => navigate("/agregar-items")}
      className="bg-primary-700 hover:bg-primary-600 text-white py-2 rounded-md"
    >
      Añadir Ítem
    </Button>

    </div>
        </>
        
    )
}