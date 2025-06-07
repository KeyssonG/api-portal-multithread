import { useState } from "react";
import "../styles/dashboard.module.css"
import Header from "../components/Header";
import Footer from "../components/Footer";

const Dashboard = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const userName = 'keysson G';

    const handleLogout = () => {
        alert('Usuário deslogado');
    };
    
    return (
    <div>
        <Header userName="keysson G" onLogout={handleLogout} />
         <main>
            
         </main>

         <Footer />
    </div>  
    );

};

export default Dashboard;