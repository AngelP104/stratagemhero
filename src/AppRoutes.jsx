import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Menu } from "./components/Menu";
import { SimulatorPad } from "./components/SimulatorPad"

// Rutas de la aplicación
export const AppRoutes = () => {

    return (
        <Routes>
            <Route
                path="/"
                element={<Menu/>}
            />
            <Route
                path="/pad"
                element={<SimulatorPad/>}
            />
        </Routes>



    );
};