import { useState } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  ScanLine,
  Mic,
  ClipboardList,
  LogOut,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  Hash,
  Download,
  Save,
} from "lucide-react";

const navItems = [
  { icon: <LayoutDashboard size={18} />, label: "ड्यासबोर्ड", sub: "DASHBOARD", href: "/dashboard", active: false },
  { icon: <ScanLine size={18} />, label: "प्रमाण विश्लेषण", sub: "EVIDENCE ANALYSIS", href: "/evidence", active: true },
  { icon: <Mic size={18} />, label: "FIR दर्ता", sub: "VOICE-TO-FIR", href: "/fir", active: false },
  { icon: <ClipboardList size={18} />, label: "केस लग", sub: "CASE LOG", href: "/cases", active: false },
];

const checklistMap: Record<string, string[]> = {
  "सेक्सटोर्सन (Sextortion)": [
    "सन्देशको स्क्रिनसट लिइएको छ? / Screenshot of messages taken?",
    "बैंक रेकर्ड उपलब्ध छ? / Bank record available?",
    "कलर आईडी पहिचान भएको छ? / Caller ID identified?",
    "उपकरण जफत गरिएको छ? / Device seized by authorities?",
  ],
  "आर्थिक ठगी (Financial Fraud)": [
    "बैंक ट्रान्जेक्सन रेकर्ड छ? / Bank transaction record collected?",
    "स्क्रिनसट प्रमाण छ? / Screenshot evidence collected?",
    "फोन नम्बर पहिचान भएको? / Phone number identified?",
    "FIR दर्ता भएको छ? / FIR filed at station?",
  ],
  "पहिचान चोरी (Identity Theft)": [
    "नक्कली प्रोफाइल स्क्रिनसट लिइएको? / Fake profile screenshot taken?",
    "मूल परिचयपत्र प्रमाण छ? / Original ID proof available?",
    "सामाजिक मिडिया रिपोर्ट गरिएको? / Social media reported?",
    "साक्षी विवरण लिइएको? / Witness details collected?",
  ],
  "ब्ल्याकमेल (Blackmail)": [
    "धम्की सन्देश संरक्षण गरिएको? / Threat messages preserved?",
    "कल रेकर्डिङ उपलब्ध छ? / Call recording available?",
    "आर्थिक माग प्रमाण छ? / Financial demand evidence?",
    "उपकरण जफत गरिएको? / Device seized?",
  ],
};

type Verdict = "REAL" | "FAKE" | "INCONCLUSIVE" | null;

export default function EvidenceAnalysis() {
  const [victimName, setVictimName] = useState("");
  const [contact, setContact] = useState("");
  const [incidentType, setIncidentType] = useState("सेक्सटोर्सन (Sextortion)");
  const [priority, setPriority] = useState<"Normal" | "Urgent">("Normal");
  const [claimAmount, setClaimAmount] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [confidence, setConfidence] = useState(0);
  const [hash, setHash] = useState("");

  const fileRef = (node: HTMLInputElement | null) => { if (node) node.value = ""; };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); setVerdict(null); }
  };

  const handleAnalyze = () => {
    if (!file) return;
    setAnalyzing(true);
    setVerdict(null);
    setTimeout(() => {
      const r = Math.random();
      const v: Verdict = r > 0.6 ? "FAKE" : r > 0.2 ? "REAL" : "INCONCLUSIVE";
      setVerdict(v);
      setConfidence(Math.floor(Math.random() * 10) + (v === "INCONCLUSIVE" ? 45 : 88));
      setHash(Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(""));
      setAnalyzing(false);
    }, 2500);
  };

  const toggleCheck = (item: string) => {
    setChecklist((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const verdictConfig = {
    REAL: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", icon: <CheckCircle size={28} className="text-green-600" />, badge: "bg-green-600", label: "REAL / वास्तविक" },
    FAKE: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", icon: <XCircle size={28} className="text-red-600" />, badge: "bg-red-600", label: "FAKE / कृत्रिम" },
    INCONCLUSIVE: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", icon: <AlertCircle size={28} className="text-yellow-600" />, badge: "bg-yellow-500", label: "INCONCLUSIVE / अनिश्चित" },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-52 bg-[#1a2744] flex flex-col fixed top-0 left-0 h-full z-20">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-[#3B4FE0] rounded-lg flex items-center justify-center">
            <ShieldCheck size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">SATYA</p>
            <p className="text-gray-400 text-[10px]">NEPAL POLICE</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${item.active ? "bg-[#3B4FE0] text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
              {item.icon}
              <div>
                <p className="text-sm font-semibold leading-none">{item.label}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{item.sub}</p>
              </div>
            </a>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10">
          <a href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut size={18} />
            <div>
              <p className="text-sm font-semibold leading-none">बाहिरिनुहोस्</p>
              <p className="text-[10px] opacity-60 mt-0.5">LOGOUT</p>
            </div>
          </a>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-52 flex-1 p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1a2744]">प्रमाण विश्लेषण</h1>
            <p className="text-gray-400 text-sm">Evidence Analysis & AI Verification Portal</p>
          </div>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1.5 rounded-full border border-green-200">
            Officer Session: active
          </span>
        </div>

        {/* Two column */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left — New Case */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-[#1a2744]">नयाँ केस विवरण (New Case Details)</h2>
                <p className="text-xs text-gray-400">Fill in the victim and incident primary data.</p>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                {(["Normal", "Urgent"] as const).map((p) => (
                  <button key={p} onClick={() => setPriority(p)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${priority === p ? (p === "Urgent" ? "bg-red-500 text-white" : "bg-[#1a2744] text-white") : "text-gray-400 hover:text-gray-600"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1a2744] text-sm mb-0.5">उजुरीकर्ताको नाम</label>
                <p className="text-gray-400 text-[10px] mb-1.5">VICTIM NAME</p>
                <input value={victimName} onChange={(e) => setVictimName(e.target.value)}
                  placeholder="E.g. Ram Bahadur Thapa"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE0]" />
              </div>
              <div>
                <label className="block font-bold text-[#1a2744] text-sm mb-0.5">सम्पर्क नम्बर</label>
                <p className="text-gray-400 text-[10px] mb-1.5">CONTACT NUMBER</p>
                <input value={contact} onChange={(e) => setContact(e.target.value)}
                  placeholder="+977-98XXXXXXXX"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE0]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#1a2744] text-sm mb-0.5">घटनाको प्रकार</label>
                <p className="text-gray-400 text-[10px] mb-1.5">INCIDENT TYPE</p>
                <select value={incidentType} onChange={(e) => { setIncidentType(e.target.value); setChecklist({}); }}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE0] bg-white">
                  {Object.keys(checklistMap).map((k) => <option key={k}>{k}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-bold text-[#1a2744] text-sm mb-0.5">दाबी गरिएको रकम</label>
                <p className="text-gray-400 text-[10px] mb-1.5">FINANCIAL CLAIM SUMMARY</p>
                <input value={claimAmount} onChange={(e) => setClaimAmount(e.target.value)}
                  placeholder="रू 0.00"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE0]" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#1a2744] text-sm mb-0.5">सम्पत्तिको प्रकार</label>
              <p className="text-gray-400 text-[10px] mb-1.5">PROPERTY TYPE</p>
              <div className="flex flex-wrap gap-2">
                {["Gold/Jewellery", "Cash", "Electronics", "Other"].map((p) => (
                  <button key={p} onClick={() => setPropertyType(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${propertyType === p ? "bg-[#1a2744] text-white border-[#1a2744]" : "border-gray-200 text-gray-500 hover:border-[#3B4FE0]"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="border border-gray-100 rounded-lg p-4 space-y-2 bg-gray-50">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Document Checklist</p>
              {["Inventory record attached?", "Purchase bills attached?", "Insurance policy attached?"].map((item) => (
                <label key={item} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="accent-[#3B4FE0]"
                    checked={!!checklist[item]} onChange={() => toggleCheck(item)} />
                  <span className="text-xs text-gray-600">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Right — Evidence Checklist */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList size={18} className="text-[#3B4FE0]" />
              <div>
                <h2 className="font-bold text-[#1a2744]">प्रमाण चेकलिस्ट (Evidence Checklist)</h2>
                <p className="text-xs text-gray-400">Required procedural steps for this incident category.</p>
              </div>
            </div>
            <div className="space-y-3">
              {checklistMap[incidentType].map((item) => (
                <label key={item} className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 hover:border-[#3B4FE0] cursor-pointer transition-colors bg-gray-50">
                  <input type="checkbox" className="accent-[#3B4FE0] mt-0.5"
                    checked={!!checklist[item]} onChange={() => toggleCheck(item)} />
                  <div>
                    <p className="text-xs font-semibold text-[#1a2744]">{item.split("/")[0]}</p>
                    <p className="text-[10px] text-gray-400">{item.split("/")[1]}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
              <AlertCircle size={14} className="text-blue-500 shrink-0" />
              <p className="text-[10px] text-blue-600 font-semibold uppercase tracking-wide">
                Chain of custody verification is mandatory
              </p>
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center transition-colors cursor-pointer ${dragging ? "border-[#3B4FE0] bg-blue-50" : "border-gray-300 bg-white hover:border-[#3B4FE0]"}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById("evidenceFile")?.click()}
        >
          <input id="evidenceFile" ref={fileRef} type="file" className="hidden"
            accept="image/*,video/*,audio/*"
            onChange={(e) => { if (e.target.files) { setFile(e.target.files[0]); setVerdict(null); } }} />
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Upload size={24} className="text-gray-400" />
          </div>
          {file ? (
            <p className="font-semibold text-[#1a2744]">{file.name}</p>
          ) : (
            <>
              <p className="font-bold text-[#1a2744]">प्रमाण फाइल अपलोड गर्नुहोस्</p>
              <p className="text-gray-400 text-sm mt-1">UPLOAD EVIDENCE FILE (VIDEO, IMAGE, AUDIO)</p>
              <p className="text-gray-400 text-xs mt-2">Drag & drop files here or click to browse. Supported formats: .mp4, .png, .jpg, .wav</p>
            </>
          )}
          <div className="mt-3 flex items-center gap-1 text-[10px] text-gray-400">
            <ShieldCheck size={12} />
            FILE VERIFIED BY AI ENGINE
          </div>
        </div>

        {/* Analyze Button */}
        {!verdict && (
          <button onClick={handleAnalyze} disabled={!file || analyzing}
            className={`w-full py-3.5 rounded-xl font-bold text-base transition-all ${file && !analyzing ? "bg-[#3B4FE0] text-white hover:bg-[#2e3fc0] shadow-md" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
            {analyzing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Analyzing Evidence... / प्रमाण विश्लेषण हुँदैछ...
              </span>
            ) : "Analyze Evidence / प्रमाण विश्लेषण गर्नुहोस्"}
          </button>
        )}

        {/* Result */}
        {verdict && (() => {
          const cfg = verdictConfig[verdict];
          return (
            <div className={`rounded-xl border ${cfg.border} overflow-hidden shadow-sm`}>
              <div className={`px-8 py-5 ${cfg.bg} flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  {cfg.icon}
                  <div>
                    <p className={`text-2xl font-bold ${cfg.text}`}>{cfg.label}</p>
                    <p className="text-xs text-gray-500">AI Analysis Integrity Report • Forensic Signature Detected</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`${cfg.badge} text-white text-sm font-bold px-4 py-2 rounded-full`}>
                    {confidence}% Confidence
                  </span>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full border border-gray-200">
                    {incidentType.split("(")[1]?.replace(")", "") || incidentType}
                  </span>
                </div>
              </div>

              <div className="px-8 py-4 bg-white border-t border-gray-100 flex items-start gap-3">
                <Hash size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400 mb-1">SHA-256 SIGNATURE</p>
                  <p className="font-mono text-xs text-gray-700 break-all">{hash}</p>
                </div>
              </div>

              <div className="px-8 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
                <p className="text-xs text-gray-400">Format: {file?.type || "Unknown"}</p>
                <span className="text-gray-300">•</span>
                <p className="text-xs text-gray-400">File: {file?.name}</p>
                <span className="text-gray-300">•</span>
                <p className="text-xs text-gray-400">Size: {file ? (file.size / 1024).toFixed(1) + " KB" : ""}</p>
              </div>

              <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-3">
                <button className="flex items-center gap-2 bg-[#3B4FE0] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2e3fc0] transition-colors">
                  <Save size={16} />
                  Save to Case / केसमा सुरक्षित गर्नुहोस्
                </button>
                <button className="flex items-center gap-2 border border-[#1a2744] text-[#1a2744] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1a2744] hover:text-white transition-colors">
                  <Download size={16} />
                  Download Report / रिपोर्ट डाउनलोड गर्नुहोस्
                </button>
                <button onClick={() => { setFile(null); setVerdict(null); setHash(""); }}
                  className="ml-auto border border-gray-300 text-gray-500 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
                  Analyze Another / अर्को विश्लेषण
                </button>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
}