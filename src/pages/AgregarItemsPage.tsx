import { useLocation, useNavigate } from "react-router-dom";
import AgregarItems from "../components/form/AgregarItems";
import Modal from "../components/modal/Modal";
import { useTranslation } from "react-i18next";

export default function AgregarItemsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const productToEdit = location.state?.product;

  return (
    <Modal
      title={productToEdit ? t('products.form.editTitle') : t('products.form.addTitle')}
      isOpen={true}
      onClose={() => navigate('/products')}
    >
      <AgregarItems />
    </Modal>
  );
}
