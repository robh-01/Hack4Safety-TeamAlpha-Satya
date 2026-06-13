import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicPortal from "./pages/PublicPortal";
import OfficerLogin from "./pages/OfficerLogin";
import Dashboard from "./pages/Dashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPortal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<OfficerLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;