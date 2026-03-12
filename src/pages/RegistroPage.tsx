import { useNavigate } from "react-router-dom";
import Registro from "../components/form/Registro";
import Modal from "../components/modal/Modal";

export default function RegistroPage() {
  const navigate = useNavigate();

  return (
    <Modal title="Registro" isOpen={true} onClose={() => navigate('/')}>
      <Registro />
    </Modal>
  );
}
