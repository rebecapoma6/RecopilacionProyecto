import Footer from "../components/footer/Footer";
import RecuperarPass from "../components/form/RecuperarPass";
import Navbar from "../components/navbar/Navbar";

export default function PageRecuperarPassPage(){
    return (
      <>
      <Navbar></Navbar>
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <RecuperarPass />
      </div>
    </main>
    <Footer></Footer>
    </>
  );
}