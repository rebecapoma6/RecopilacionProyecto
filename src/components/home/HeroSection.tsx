import { useNavigate } from "react-router-dom";
import Button from "../form/Button";

export default function HeroSection() {
    const navigate = useNavigate();
    return (
        <section className="font-sf-pro py-20 px-4 flex justify-center text-center">

            <div className="max-w-3xl w-full">

                <h1 className="text-4xl-h1 font-bold text-primary-50 mb-6">Tu biblioteca personal de libros y videojuegos</h1>
                <p className="text-lg-subtitle text-primary-50 mb-10 max-w-2xl mx-auto">Organiza, gestiona y lleva el control de toda tu coleccción en un solo lugar.</p>

                <Button 
      type="button"
      onClick={() => navigate("/products")}
      className="bg-primary-700 hover:bg-primary-600 text-white py-2 rounded-md"
    >
      Comenzar
    </Button>
            </div>
        </section>
    )
}