import { ShieldCheck, Send, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SubmitReport() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3B4FE0] rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-[#1a2744] text-base">SATYA</span>
            <span className="text-gray-400 text-xs ml-2">नेपाल प्रहरी</span>
            <div className="text-[10px] text-gray-400 leading-none">NEPAL POLICE</div>
          </div>
        </a>
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      </nav>

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#1a2744] flex items-center justify-center">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[#1a2744] text-lg">
                Submit to Nepal Police
              </h2>
              <p className="text-xs text-gray-500">नेपाल प्रहरीमा पठाउनुहोस्</p>
            </div>
          </div>
          <div className="space-y-4">
            <input
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE0]"
            />
            <input
              placeholder="+977-98XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE0]"
            />
            <button className="w-full bg-[#1a2744] text-white rounded-lg py-3 font-semibold text-sm hover:bg-[#243459] transition-colors flex items-center justify-center gap-2">
              <Send size={16} />
              Submit Report / रिपोर्ट पठाउनुहोस्
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
