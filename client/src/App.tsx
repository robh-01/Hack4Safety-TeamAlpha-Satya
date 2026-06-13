import { BrowserRouter, Routes, Route } from "react-router-dom";
import PublicPortal from "./pages/PublicPortal";
import OfficerLogin from "./pages/OfficerLogin";
import Dashboard from "./pages/Dashboard";
import EvidenceUpload from "./pages/EvidenceUpload";
import VoiceRecording from "./pages/VoiceRecording";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicPortal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<OfficerLogin />} />
        <Route path="/evidence" element={<EvidenceUpload />} />
        <Route path="/fir" element={<VoiceRecording />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;