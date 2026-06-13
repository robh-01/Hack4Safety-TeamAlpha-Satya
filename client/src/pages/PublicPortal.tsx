import { useState, useRef } from "react";
import {
  ShieldCheck,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Send,
  Hash,
  X,
} from "lucide-react";

type Verdict = "REAL" | "FAKE" | null;

interface SubmitModalProps {
  onClose: () => void;
}

function SubmitModal({ onClose }: SubmitModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.45)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-[#1a2744] flex items-center justify-center">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-[#1a2744] text-lg">Submit to Nepal Police</h2>
            <p className="text-xs text-gray-500">नेपाल प्रहरीमा पठाउनुहोस्</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-[#1a2744] text-sm mb-1">
              नाम <span className="font-normal text-gray-400 text-xs ml-1">/ Name</span>
            </label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE0]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#1a2744] text-sm mb-1">
              सम्पर्क नम्बर <span className="font-normal text-gray-400 text-xs ml-1">/ Contact Number</span>
            </label>
            <input
              type="tel"
              placeholder="+977-98XXXXXXXX"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE0]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#1a2744] text-sm mb-1">
              संक्षिप्त विवरण <span className="font-normal text-gray-400 text-xs ml-1">/ Brief Description</span>
            </label>
            <textarea
              rows={3}
              placeholder="Describe the incident briefly..."
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE0] resize-none"
            />
          </div>
          <button className="w-full bg-[#1a2744] text-white rounded-lg py-3 font-semibold text-sm hover:bg-[#243459] transition-colors flex items-center justify-center gap-2">
            <Send size={16} />
            Submit Report / रिपोर्ट पठाउनुहोस्
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PublicPortal() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [confidence, setConfidence] = useState(0);
  const [hash, setHash] = useState("");
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleAnalyze = () => {
    if (!file) return;
    setAnalyzing(true);
    setVerdict(null);
    setTimeout(() => {
      const isReal = Math.random() > 0.5;
      setVerdict(isReal ? "REAL" : "FAKE");
      setConfidence(Math.floor(Math.random() * 15) + (isReal ? 85 : 90));
      setHash(
        Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("")
      );
      setAnalyzing(false);
    }, 2500);
  };

  const resetState = () => {
    setFile(null);
    setVerdict(null);
    setConfidence(0);
    setHash("");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {showModal && <SubmitModal onClose={() => setShowModal(false)} />}

      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3B4FE0] rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-[#1a2744] text-base">SATYA</span>
            <span className="text-gray-400 text-xs ml-2">नेपाल प्रहरी</span>
            <div className="text-[10px] text-gray-400 leading-none">NEPAL POLICE</div>
          </div>
        </div>
        <a
          href="/login"
          className="border border-[#1a2744] text-[#1a2744] text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1a2744] hover:text-white transition-colors"
        >
          Officer Login / लगइन
        </a>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-4 py-16">
        <div className="w-14 h-14 bg-[#3B4FE0] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <ShieldCheck size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-[#1a2744] text-center mb-2">
          AI Evidence Integrity System
        </h1>
        <p className="text-[#3B4FE0] font-semibold text-lg text-center mb-3">
          डिजिटल प्रमाण सत्यापन प्रणाली
        </p>
        <p className="text-gray-500 text-sm text-center max-w-lg mb-12">
          Official platform for the Nepal Police to verify the authenticity of
          digital media. Upload files to detect deepfakes, manipulations, and
          AI-generated content.
        </p>

        {/* Upload / Result Area */}
        <div className="w-full max-w-2xl">
          {!verdict ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center transition-colors cursor-pointer ${
                dragging
                  ? "border-[#3B4FE0] bg-blue-50"
                  : "border-gray-300 bg-gray-50 hover:border-[#3B4FE0]"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                className="hidden"
                accept="image/*,video/*,audio/*"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <Upload size={28} className="text-gray-400" />
              </div>
              {file ? (
                <p className="font-semibold text-[#1a2744] text-center">{file.name}</p>
              ) : (
                <>
                  <p className="font-semibold text-[#1a2744] text-center text-base">
                    Upload image, video, or audio to check integrity
                  </p>
                  <p className="text-[#3B4FE0] text-sm text-center mt-1">
                    वास्तविक वा कृत्रिम जाँच गर्नका लागि फाइल अपलोड गर्नुहोस्
                  </p>
                  <p className="text-gray-400 text-xs mt-3">
                    Supports: JPG, PNG, MP4, MP3 (Max 50MB)
                  </p>
                </>
              )}
            </div>
          ) : (
            /* Result Card */
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Verdict Banner */}
              <div
                className={`px-8 py-5 flex items-center justify-between ${
                  verdict === "REAL" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {verdict === "REAL" ? (
                    <CheckCircle size={32} className="text-green-600" />
                  ) : (
                    <XCircle size={32} className="text-red-600" />
                  )}
                  <div>
                    <p
                      className={`text-2xl font-bold ${
                        verdict === "REAL" ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {verdict === "REAL"
                        ? "REAL / वास्तविक"
                        : "FAKE / कृत्रिम"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {verdict === "REAL"
                        ? "No signs of AI manipulation detected."
                        : "AI/Deepfake manipulation detected."}
                    </p>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full font-bold text-lg ${
                    verdict === "REAL"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {confidence}% Confidence
                </div>
              </div>

              {/* Hash */}
              <div className="px-8 py-4 bg-white border-t border-gray-100 flex items-start gap-3">
                <Hash size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">SHA-256 SIGNATURE</p>
                  <p className="font-mono text-xs text-gray-700 break-all">{hash}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-3">
                <button className="flex items-center gap-2 bg-[#1a2744] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#243459] transition-colors">
                  <Download size={16} />
                  Download Report
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-2 border border-[#1a2744] text-[#1a2744] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a2744] hover:text-white transition-colors"
                >
                  <Send size={16} />
                  Submit to Nepal Police
                </button>
                <button
                  onClick={resetState}
                  className="flex items-center gap-2 border border-gray-300 text-gray-500 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors ml-auto"
                >
                  Analyze Another File
                </button>
              </div>
            </div>
          )}

          {/* Analyze Button */}
          {!verdict && (
            <button
              onClick={handleAnalyze}
              disabled={!file || analyzing}
              className={`mt-5 w-full py-3.5 rounded-xl font-bold text-base transition-all ${
                file && !analyzing
                  ? "bg-[#3B4FE0] text-white hover:bg-[#2e3fc0] shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {analyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Analyzing... / विश्लेषण हुँदैछ...
                </span>
              ) : (
                "Analyze / विश्लेषण गर्नुहोस्"
              )}
            </button>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl w-full">
          {[
            {
              icon: <ShieldCheck size={24} className="text-[#3B4FE0]" />,
              title: "Official Verification",
              desc: "Directly linked to Nepal Police Cyber Bureau databases for official forensic audit.",
            },
            {
              icon: <AlertCircle size={24} className="text-[#3B4FE0]" />,
              title: "Blockchain Logging",
              desc: "Every analysis generates a cryptographic hash to ensure the evidence chain remains untampered.",
            },
            {
              icon: <Hash size={24} className="text-[#3B4FE0]" />,
              title: "Privacy Guaranteed",
              desc: "Uploaded files are encrypted and automatically purged after 24 hours if not submitted for investigation.",
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-start gap-3 p-6 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="font-semibold text-[#1a2744] text-sm">{item.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1a2744] text-white mt-16">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <ShieldCheck size={16} className="text-[#1a2744]" />
              </div>
              <span className="font-bold text-white">SATYA</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              AI Evidence Integrity System for authentication of digital media.
              Empowering the Nepal Police with cutting-edge verification technology.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Public Portal / सार्वजनिक पोर्टल</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Officer Login / अधिकारी लगइन</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy / गोपनीयता नीति</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">
              Emergency Contact
            </h4>
            <p className="text-4xl font-bold text-white mb-1">100</p>
            <p className="text-gray-400 text-sm mb-4">Nepal Police Hotline</p>
            <div className="flex gap-2">
              <a href="https://facebook.com/nepalpolice" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors text-xs font-bold">
                f
              </a>
              <a href="https://twitter.com/nepalpolice" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors text-xs font-bold">
                𝕏
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-gray-500">
          © 2026 Nepal Police AI Evidence Integrity System. Authorized Access Only.
        </div>
      </footer>
    </div>
  );
}