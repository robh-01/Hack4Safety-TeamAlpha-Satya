import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicPortal from "./pages/PublicPortal";
import OfficerLogin from "./pages/OfficerLogin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPortal />} />
        <Route path="/login" element={<OfficerLogin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;