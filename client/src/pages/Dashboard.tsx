import { useState } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  Search,
  ScanLine,
  Mic,
  ClipboardList,
  Bell,
  LogOut,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const navItems = [
  { icon: <LayoutDashboard size={18} />, label: "ड्यासबोर्ड", sub: "DASHBOARD", href: "/dashboard", active: true },
  { icon: <ScanLine size={18} />, label: "प्रमाण विश्लेषण", sub: "EVIDENCE ANALYSIS", href: "/evidence", active: false },
  { icon: <Mic size={18} />, label: "FIR दर्ता", sub: "VOICE-TO-FIR", href: "/fir", active: false },
  { icon: <ClipboardList size={18} />, label: "केस लग", sub: "CASE LOG", href: "/cases", active: false },
];

const statCards = [
  { label: "आजका कुल उजुरीहरू", sub: "TOTAL CASES TODAY", value: "42", change: "+12%", up: true },
  { label: "फेक प्रमाण पहिचान", sub: "DEEPFAKES DETECTED", value: "18", change: "+5%", up: true, accent: true },
  { label: "दर्ता भएका एफआईआर", sub: "FIRS GENERATED", value: "24", change: "+8%", up: true },
  { label: "प्रतीक्षारत केसहरू", sub: "PENDING REVIEWS", value: "09", change: "-2%", up: false },
];

const cases = [
  { id: "NP-2024-8842", victim: "Ram Bahadur", victimNp: "राम बहादुर", type: "Sextortion", typeNp: "सेक्सटोर्सन", evidence: "Video", verdict: "FAKE", confidence: 98.4, officer: "Insp. Thapa" },
  { id: "NP-2024-8841", victim: "Sita Kumari", victimNp: "सीता कुमारी", type: "Financial Fraud", typeNp: "आर्थिक ठगी", evidence: "Audio", verdict: "REAL", confidence: 92.1, officer: "Sub-Insp. Rai" },
  { id: "NP-2024-8839", victim: "Hari Prasad", victimNp: "हरि प्रसाद", type: "Identity Theft", typeNp: "पहिचान चोरी", evidence: "Image", verdict: "FAKE", confidence: 87.5, officer: "Insp. Thapa" },
  { id: "NP-2024-8835", victim: "Gita Devi", victimNp: "गीता देवी", type: "Blackmail", typeNp: "ब्ल्याकमेल", evidence: "Video", verdict: "REAL", confidence: 99.2, officer: "Insp. Gurung" },
  { id: "NP-2024-8832", victim: "Anil Sharma", victimNp: "अनिल शर्मा", type: "Cyber Bullying", typeNp: "साइबर धम्की", evidence: "Image", verdict: "FAKE", confidence: 95.8, officer: "Insp. Thapa" },
];

const alerts = [
  { level: "HIGH RISK ALERT", msg: "New deepfake batch detected in Kaski District (Sextortion Pattern).", time: "2m ago", high: true },
  { level: "SYSTEM UPDATE", msg: "Grad-CAM visualization engine updated to v2.4. Improved heatmap precision.", time: "1h ago", high: false },
];

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const filtered = cases.filter(
    (c) =>
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.victim.toLowerCase().includes(search.toLowerCase())
  );

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
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? "bg-[#3B4FE0] text-white"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.icon}
              <div>
                <p className="text-sm font-semibold leading-none">{item.label}</p>
                <p className="text-[10px] opacity-60 mt-0.5">{item.sub}</p>
              </div>
            </a>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 cursor-default">
            <LogOut size={18} />
            <div>
              <p className="text-sm font-semibold leading-none">बाहिरिनुहोस्</p>
              <p className="text-[10px] opacity-60 mt-0.5">LOGOUT</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-52 flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div />
          <div className="flex items-center gap-4">
            <button className="relative w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-[#1a2744]">इन्सपेक्टर थापा</p>
                <p className="text-xs text-gray-400">Inspector Thapa</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#3B4FE0] flex items-center justify-center text-white font-bold text-sm">
                T
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-6">
          {/* Page title */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1a2744]">ड्यासबोर्ड</h1>
              <p className="text-gray-400 text-sm">Dashboard Overview & Recent Investigations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">LAST SYNCHRONIZED</p>
                <p className="text-xs text-gray-500 font-mono">2024-05-20 15:42:10</p>
              </div>
              <button className="flex items-center gap-2 bg-[#3B4FE0] text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2e3fc0] transition-colors">
                <FileText size={16} />
                नयाँ रिपोर्ट / New Report
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-4 gap-4">
            {statCards.map((card, i) => (
              <div
                key={i}
                className={`bg-white rounded-xl p-5 border-l-4 shadow-sm ${
                  card.accent ? "border-l-red-500" : "border-l-[#3B4FE0]"
                }`}
              >
                <p className="text-xs font-bold text-[#1a2744]">{card.label}</p>
                <p className="text-[10px] text-gray-400 mb-3">{card.sub}</p>
                <p className="text-3xl font-bold text-[#1a2744]">{card.value}</p>
                <p className={`text-xs mt-1 font-semibold ${card.up ? "text-green-600" : "text-red-500"}`}>
                  {card.change} vs. yesterday
                </p>
              </div>
            ))}
          </div>

          {/* Cases Table + Alerts */}
          <div className="grid grid-cols-3 gap-6">
            {/* Table */}
            <div className="col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-[#1a2744]">हालैका केसहरू (Recent Cases)</h2>
                  <p className="text-xs text-gray-400">Real-time log of forensic analysis and case files</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Case ID, Name, or Officer..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-8 pr-4 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#3B4FE0] w-52"
                    />
                  </div>
                  <button className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50">
                    <Filter size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {["CASE ID", "VICTIM / उजुरीकर्ता", "TYPE / प्रकार", "EVIDENCE", "VERDICT / फैसला", "CONF. %", "OFFICER", "ACTIONS"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <a href="/cases" className="text-[#3B4FE0] font-semibold text-xs hover:underline">
                          {c.id}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-[#1a2744] text-xs">{c.victim}</p>
                        <p className="text-gray-400 text-[10px]">{c.victimNp}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-xs text-gray-700">{c.type}</p>
                        <p className="text-[10px] text-gray-400">{c.typeNp}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {c.evidence}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            c.verdict === "REAL"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {c.verdict === "REAL" ? "REAL / वास्तविक" : "FAKE / कृत्रिम"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full ${c.verdict === "REAL" ? "bg-green-500" : "bg-red-500"}`}
                              style={{ width: `${c.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{c.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{c.officer}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button className="text-[#3B4FE0] text-xs font-semibold hover:underline">View</button>
                          <span className="text-gray-300">|</span>
                          <button className="text-gray-500 text-xs hover:text-[#1a2744]">Download</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-400">Showing {filtered.length} of 1,248 total investigation records</p>
                <div className="flex items-center gap-2">
                  <button className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50">
                    <ChevronLeft size={14} className="text-gray-400" />
                  </button>
                  <button className="w-7 h-7 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-50">
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-500" />
                  <h2 className="font-bold text-[#1a2744] text-sm">Risk Flags / जोखिम संकेतहरू</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {alerts.map((a, i) => (
                    <div key={i} className={`px-5 py-4 ${a.high ? "bg-red-50" : "bg-white"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wide ${a.high ? "text-red-600" : "text-gray-500"}`}>
                          {a.level}
                        </span>
                        <span className="text-[10px] text-gray-400">{a.time}</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{a.msg}</p>
                    </div>
                  ))}
                </div>
                <div className="px-5 py-3 border-t border-gray-100">
                  <button className="w-full text-xs text-[#3B4FE0] font-semibold hover:underline">
                    सबै अलर्टहरू हेर्नुहोस् (View All Alerts)
                  </button>
                </div>
              </div>

              {/* Analytics placeholder */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <RefreshCw size={16} className="text-gray-400" />
                  <h2 className="font-bold text-[#1a2744] text-sm">Analysis Trends / विश्लेषण प्रवृत्ति</h2>
                </div>
                <div className="px-5 py-10 flex flex-col items-center justify-center text-center">
                  <RefreshCw size={24} className="text-gray-300 mb-3" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Analytics Visualization Pending
                  </p>
                  <p className="text-[10px] text-gray-300 mt-1">
                    Real-time chart data being synchronized from headquarters...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}