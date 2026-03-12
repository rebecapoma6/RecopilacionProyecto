import { useLocation, useNavigate } from "react-router-dom";
import AgregarItems from "../components/form/AgregarItems";
import Modal from "../components/modal/Modal";

export default function AgregarItemsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const productToEdit = location.state?.product;

  return (
    <Modal
      title={productToEdit ? "Editar item" : "Añadir item"}
      isOpen={true}
      onClose={() => navigate('/products')}
    >
      <AgregarItems />
    </Modal>
  );
}
