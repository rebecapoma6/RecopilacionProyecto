import { useNavigate } from "react-router-dom";
import AgregarItems from "../components/form/AgregarItems";
import Button from "../components/form/Button";

export default function AgregarItemsPage(){
    const navigate = useNavigate();
    return(
        <>
            <AgregarItems></AgregarItems>

    
        </>
    )
}