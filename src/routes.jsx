import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./pages/app";

export default function Rotas(){
    return(
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>}/>
        </Routes>
        </BrowserRouter>
    )
}