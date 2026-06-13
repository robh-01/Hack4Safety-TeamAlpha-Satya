import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Shield,
  LayoutGrid,
  FileSearch,
  Mic,
  History,
  LogOut,
  Bell,
  Mic2,
  AlertTriangle,
  CheckCircle2,
  FileText,
  MapPin,
  Calendar,
  Phone,
  User,
  ClipboardList,
} from "lucide-react";

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------
interface RiskFlag {
  id: string;
  title: string;
  description: string;
  level: "high" | "medium" | "low";
}

interface ConnectedCase {
  id: string;
  description: string;
}

interface FirFormState {
  complainantName: string;
  contactNumber: string;
  incidentDate: string;
  incidentType: string;
  location: string;
  description: string;
  accusedDetails: string;
  investigatingOfficer: string;
}

// -----------------------------------------------------------------------
// Static config
// -----------------------------------------------------------------------
const NAV_ITEMS = [
  { label: "ड्यासबोर्ड", sub: "DASHBOARD", icon: LayoutGrid, to: "/dashboard" },
  { label: "प्रमाण विश्लेषण", sub: "EVIDENCE ANALYSIS", icon: FileSearch, to: "/evidence-analysis" },
  { label: "FIR दर्ता", sub: "VOICE-TO-FIR", icon: Mic, to: "/voice-to-fir" },
  { label: "केस लग", sub: "CASE LOG", icon: History, to: "/case-log" },
];

const INCIDENT_TYPES = [
  "लुटपाट (Robbery)",
  "सेक्सटोर्सन (Sextortion)",
  "वित्तीय ठगी (Financial Fraud)",
  "पहिचान चोरी (Identity Theft)",
  "साइबर धम्की (Cyber Bullying)",
  "ब्ल्याकमेल (Blackmail)",
];

const RISK_FLAGS: RiskFlag[] = [
  {
    id: "rf1",
    title: "उच्च प्राथमिकता / HIGH PRIORITY",
    description: "Detected aggressive tone and threat language in transcription.",
    level: "high",
  },
  {
    id: "rf2",
    title: "आर्थिक हानी / FINANCIAL LOSS",
    description: "Detected monetary loss reference in statement.",
    level: "medium",
  },
  {
    id: "rf3",
    title: "डिजिटल जानकारी / DIGITAL EVIDENCE",
    description: "Evidence points to location metadata and device usage.",
    level: "low",
  },
];

const CONNECTED_CASES: ConnectedCase[] = [
  { id: "#CASE-9021", description: "Similar MO detected — Gaushala Chowk" },
  { id: "#CASE-9022", description: "Similar MO detected — Motorcycle robbery" },
];

const FULL_TRANSCRIPT =
  "नमस्ते, म सुनिता शर्मा बोल्दैछु। हिजो बेलुका साढे ७ बजे म घर फर्किँदा गौशाला चोक नजिकै मेरो मोबाइल र पैसा लुटियो। एउटा रातो मोटरसाइकलमा आएका दुई जना व्यक्तिहरू थिए। उनीहरूले मलाई चक्कु देखाएर डर देखाए।";

// -----------------------------------------------------------------------
// Sidebar
// -----------------------------------------------------------------------
const Sidebar: React.FC = () => {
  return (
    <aside className="hidden lg:flex w-64 flex-col bg-[#0B1220] text-slate-200 shrink-0 min-h-screen">
      <div className="flex items-center gap-2 px-6 py-6 border-b border-white/5">
        <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-white leading-tight">SATYA</p>
          <p className="text-[10px] tracking-widest text-slate-400 leading-tight">NEPAL POLICE</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.to === "/voice-to-fir";
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex flex-col leading-tight">
                <span>{item.label}</span>
                <span className="text-[10px] tracking-widest opacity-60">{item.sub}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:bg-white/5 hover:text-white w-full transition-colors">
          <LogOut className="w-4 h-4" />
          <span className="flex flex-col leading-tight text-left">
            <span>बाहिरिनुहोस्</span>
            <span className="text-[10px] tracking-widest opacity-60">LOGOUT</span>
          </span>
        </button>
      </div>
    </aside>
  );
};

// -----------------------------------------------------------------------
// Top bar
// -----------------------------------------------------------------------
const TopBar: React.FC = () => {
  return (
    <header className="flex items-center justify-end gap-4 px-6 py-4 border-b border-slate-200 bg-white">
      <button
        className="relative p-2 rounded-full hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 text-slate-500" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
      </button>
    </header>
  );
};

// -----------------------------------------------------------------------
// Recorder panel (left column)
// -----------------------------------------------------------------------
interface RecorderPanelProps {
  isRecording: boolean;
  onToggle: () => void;
  transcript: string;
}

const RecorderPanel: React.FC<RecorderPanelProps> = ({ isRecording, onToggle, transcript }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-slate-200 p-8 flex flex-col items-center text-center">
        <button
          onClick={onToggle}
          aria-pressed={isRecording}
          className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${
            isRecording ? "bg-rose-500" : "bg-slate-200"
          }`}
        >
          {isRecording && (
            <>
              <span className="absolute inset-0 rounded-full bg-rose-500/30 animate-ping" />
              <span className="absolute -inset-3 rounded-full border border-rose-300/60" />
            </>
          )}
          <Mic2 className={`w-12 h-12 ${isRecording ? "text-white" : "text-slate-500"}`} />
        </button>

        <p className="mt-6 font-semibold text-slate-800">
          {isRecording ? "रेकर्डिङ जारी छ" : "बोल्न सुरु गर्नुहोस्"}
        </p>
        <p className="text-xs tracking-widest text-slate-400 mt-1">
          {isRecording ? "RECORDING" : "START SPEAKING"}
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Mic className="w-4 h-4 text-indigo-600" />
            <span>प्रत्यक्ष ट्रान्सक्रिप्शन</span>
            <span className="text-[10px] tracking-widest text-slate-400">/ LIVE</span>
          </div>
          {isRecording && (
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active Listening
            </span>
          )}
        </div>
        <p className="text-sm leading-relaxed text-slate-600 min-h-[96px]">
          {transcript}
          {isRecording && <span className="inline-block w-0.5 h-4 bg-indigo-500 ml-1 align-middle animate-pulse" />}
        </p>
      </div>

      <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-5">
        <p className="text-xs font-semibold tracking-widest text-indigo-700 mb-2">
          SYSTEM INSTRUCTIONS
        </p>
        <ul className="text-sm text-indigo-900/80 space-y-1.5 list-disc list-inside">
          <li>Ensure the environment is quiet for optimal transcription accuracy.</li>
          <li>Speak clearly in Nepali; the system supports local dialects.</li>
        </ul>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------
// FIR Form (center column)
// -----------------------------------------------------------------------
interface FirFormProps {
  form: FirFormState;
  onChange: (field: keyof FirFormState, value: string) => void;
  onGenerate: () => void;
}

const FirForm: React.FC<FirFormProps> = ({ form, onChange, onGenerate }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h2 className="font-bold text-slate-900 leading-tight">प्रथम सूचना प्रतिवेदन (FIR)</h2>
          <p className="text-[11px] tracking-widest text-slate-400">
            FIRST INFORMATION REPORT FORM • AUTO-GENERATED BY SATYA AI
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="उजुरीकर्ताको नाम"
          sub="COMPLAINANT NAME"
          icon={User}
          value={form.complainantName}
          onChange={(v) => onChange("complainantName", v)}
        />
        <Field
          label="सम्पर्क नम्बर"
          sub="CONTACT NUMBER"
          icon={Phone}
          value={form.contactNumber}
          onChange={(v) => onChange("contactNumber", v)}
        />
        <Field
          label="घटनाको मिति"
          sub="INCIDENT DATE"
          icon={Calendar}
          type="date"
          value={form.incidentDate}
          onChange={(v) => onChange("incidentDate", v)}
        />
        <SelectField
          label="घटनाको प्रकार"
          sub="INCIDENT TYPE"
          icon={AlertTriangle}
          value={form.incidentType}
          onChange={(v) => onChange("incidentType", v)}
          options={INCIDENT_TYPES}
        />
      </div>

      <div className="mt-4">
        <Field
          label="घटनाको स्थान"
          sub="LOCATION"
          icon={MapPin}
          value={form.location}
          onChange={(v) => onChange("location", v)}
        />
      </div>

      <div className="mt-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">घटनाको विवरण</span>
          <span className="block text-[10px] tracking-widest text-slate-400 mb-1.5">
            INCIDENT DESCRIPTION
          </span>
          <textarea
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500 focus:bg-white"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Field
          label="अभियुक्तको विवरण"
          sub="ACCUSED DETAILS"
          icon={User}
          placeholder="हुलिया वा नाम (यदि थाहा भएमा)"
          value={form.accusedDetails}
          onChange={(v) => onChange("accusedDetails", v)}
        />
        <Field
          label="अनुसन्धान अधिकृत"
          sub="INVESTIGATING OFFICER"
          icon={Shield}
          value={form.investigatingOfficer}
          onChange={(v) => onChange("investigatingOfficer", v)}
          disabled
        />
      </div>

      <div className="mt-5">
        <p className="text-sm font-medium text-slate-700 mb-2">प्रमाण सूची</p>
        <p className="text-[10px] tracking-widest text-slate-400 mb-2">EVIDENCE LIST</p>
        <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 space-y-1.5">
          <EvidenceItem label="Physical: Statement audio recorded via SATYA" />
          <EvidenceItem label="Digital: Location metadata from GPS sensor" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button
          onClick={onGenerate}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold px-4 py-3 hover:bg-indigo-700 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          <FileText className="w-4 h-4" />
          FIR PDF बनाउनुहोस् <span className="opacity-70">/ GENERATE FIR PDF</span>
        </button>
        <button className="inline-flex items-center justify-center rounded-lg border border-slate-300 text-slate-600 text-sm font-semibold px-4 py-3 hover:bg-slate-50 transition-colors">
          रद्द गर्नुहोस् (Cancel)
        </button>
      </div>
    </div>
  );
};

const EvidenceItem: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 text-sm text-slate-600">
    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
    <span>{label}</span>
  </div>
);

interface FieldProps {
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

const Field: React.FC<FieldProps> = ({ label, sub, icon: Icon, value, onChange, type = "text", placeholder, disabled }) => (
  <label className="block">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <span className="block text-[10px] tracking-widest text-slate-400 mb-1.5">{sub}</span>
    <span className="relative flex items-center">
      <Icon className="w-4 h-4 text-slate-400 absolute left-3" />
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500 ${
          disabled ? "bg-slate-100 text-slate-500" : "bg-slate-50 focus:bg-white"
        }`}
      />
    </span>
  </label>
);

interface SelectFieldProps {
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}

const SelectField: React.FC<SelectFieldProps> = ({ label, sub, icon: Icon, value, onChange, options }) => (
  <label className="block">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <span className="block text-[10px] tracking-widest text-slate-400 mb-1.5">{sub}</span>
    <span className="relative flex items-center">
      <Icon className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 bg-slate-50 pl-9 pr-3 py-2.5 text-sm text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-500 focus:bg-white appearance-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </span>
  </label>
);

// -----------------------------------------------------------------------
// Right panel: risk flags + connected cases
// -----------------------------------------------------------------------
const riskStyles: Record<RiskFlag["level"], string> = {
  high: "border-rose-200 bg-rose-50 text-rose-700",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  low: "border-indigo-200 bg-indigo-50 text-indigo-700",
};

const RightPanel: React.FC<{ confidence: number }> = ({ confidence }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <p className="text-sm font-semibold text-slate-800">जोखिम संकेतहरू</p>
          <span className="text-[10px] tracking-widest text-slate-400">/ RISK FLAGS</span>
        </div>
        <div className="space-y-2.5">
          {RISK_FLAGS.map((flag) => (
            <div key={flag.id} className={`rounded-lg border px-3 py-2.5 ${riskStyles[flag.level]}`}>
              <p className="text-xs font-bold tracking-wide">{flag.title}</p>
              <p className="text-xs mt-1 leading-relaxed opacity-90">{flag.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold text-slate-800">AI CONFIDENCE</p>
          <span className="text-sm font-bold text-indigo-600">{confidence.toFixed(1)}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-700"
            style={{ width: `${confidence}%` }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-1">Accuracy</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-3">
          <ClipboardList className="w-4 h-4 text-indigo-600" />
          <p className="text-sm font-semibold text-slate-800">CONNECTED CASES</p>
        </div>
        <div className="space-y-2">
          {CONNECTED_CASES.map((c) => (
            <div key={c.id} className="rounded-lg border border-slate-200 px-3 py-2.5 hover:border-indigo-300 transition-colors cursor-pointer">
              <p className="text-xs font-bold text-indigo-600">{c.id}</p>
              <p className="text-xs text-slate-500 mt-0.5">{c.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// -----------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------
const VoiceToFIR: React.FC = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [form, setForm] = useState<FirFormState>({
    complainantName: "Sunita Sharma (सुनिता शर्मा)",
    contactNumber: "9841234567",
    incidentDate: "2024-05-15",
    incidentType: INCIDENT_TYPES[0],
    location: "Gaushala Chowk, Kathmandu",
    description: "",
    accusedDetails: "",
    investigatingOfficer: "Inspector K.P. Thapa",
  });

  // Simulate live transcription typing effect and confidence ramp
  useEffect(() => {
    if (!isRecording) return;

    let i = transcript.length;
    intervalRef.current = setInterval(() => {
      if (i < FULL_TRANSCRIPT.length) {
        i += 2;
        const next = FULL_TRANSCRIPT.slice(0, i);
        setTranscript(next);
        setForm((f) => ({ ...f, description: next }));
        setConfidence((c) => Math.min(94.2, c + 2.1));
      } else {
        setIsRecording(false);
      }
    }, 120);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRecording]);

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsRecording(true);
    }
  };

  const handleFieldChange = (field: keyof FirFormState, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleGenerate = () => {
    navigate("/case-log");
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 px-4 sm:px-6 py-6">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-slate-900">FIR दर्ता</h1>
            <p className="text-sm text-slate-500">
              आवाजबाट प्रथम सूचना प्रतिवेदन तयार गर्नुहोस् • Voice-to-FIR Generator
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr_280px] gap-6 items-start">
            <RecorderPanel
              isRecording={isRecording}
              onToggle={handleToggleRecording}
              transcript={transcript}
            />
            <FirForm form={form} onChange={handleFieldChange} onGenerate={handleGenerate} />
            <RightPanel confidence={confidence} />
          </div>
        </main>

        <footer className="px-6 py-4 border-t border-slate-200 text-center text-xs text-slate-400">
          © 2026 Nepal Police AI Evidence Integrity System. Authorized Access Only.
        </footer>
      </div>
    </div>
  );
};

export default VoiceToFIR;