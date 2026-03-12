import { useNavigate } from "react-router-dom";
import ModificarDatos from "../components/form/ModificarDatos";
import Modal from "../components/modal/Modal";

export default function ModificarDatosPage() {
  const navigate = useNavigate();

  return (
    <Modal title="Editar perfil" isOpen={true} onClose={() => navigate('/perfil')}>
      <ModificarDatos />
    </Modal>
  );
}
