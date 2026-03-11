import { useNavigate } from "react-router-dom";
import RecuperarPass from "../components/form/RecuperarPass";
import Modal from "../components/modal/Modal";

export default function PageRecuperarPassPage() {
  const navigate = useNavigate();

  return (
    <Modal title="Recuperar acceso" isOpen={true} onClose={() => navigate('/iniciarSesion')}>
      <RecuperarPass />
    </Modal>
  );
}
