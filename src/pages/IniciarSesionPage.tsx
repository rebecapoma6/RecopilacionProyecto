import { useNavigate } from "react-router-dom";
import IniciarSesion from "../components/form/IniciarSesion";
import Modal from "../components/modal/Modal";

export default function IniciarSesionPage() {
  const navigate = useNavigate();

  return (
    <Modal title="Iniciar sesión" isOpen={true} onClose={() => navigate('/')}>
      <IniciarSesion />
    </Modal>
  );
}
