import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Documents from "./pages/Documents";
import Chat from "./pages/Chat";
import KnowledgeGraph from "./pages/KnowledgeGraph";
import Compliance from "./pages/Compliance";

function Placeholder({ title }: { title: string }) {
    return <h1>{title}</h1>;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/chat" element={<Chat />}/>
                <Route path="/settings" element={<Placeholder title="Settings" />} />
                <Route path="/graph" element={<KnowledgeGraph />} />
                <Route path="/compliance" element={<Compliance />} />
            </Routes>
        </BrowserRouter>
    );
}