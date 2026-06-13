import { useState, useRef } from "react";
import {
  ShieldCheck,
  Upload,
  CheckCircle,
  XCircle,
  Video,
} from "lucide-react";
import { getConfidenceBreakdown } from "../utils/confidence";

type Verdict = "REAL" | "FAKE" | null;

interface ResultDetails {
  aiGenerated?: { verdict: string; score: number };
  deepfake?: { verdict: string; score: number };
  generator?: { name: string; score: number };
  audio?: { verdict: string; score: number };
}

interface ResultData {
  verdict: Verdict;
  confidence: number;
  reasoning: string;
  details?: ResultDetails;
  frameCount?: number;
}

export default function VideoDetection() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [verdict, setVerdict] = useState<Verdict>(null);
  const [realConfidence, setRealConfidence] = useState(0);
  const [fakeConfidence, setFakeConfidence] = useState(0);
  const [reasoning, setReasoning] = useState("");
  const [details, setDetails] = useState<ResultDetails | null>(null);
  const [frameCount, setFrameCount] = useState<number | undefined>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalyzing(true);
    videoRef.current?.pause();
    setVerdict(null);
    setReasoning("");
    setDetails(null);
    setFrameCount(undefined);
    setStatusMessage("");

    const formData = new FormData();
    formData.append("media", file);

    try {
      const res = await fetch("/api/detect", { method: "POST", body: formData });
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const obj = JSON.parse(line);
          if (obj.type === "status") {
            setStatusMessage(obj.message);
          } else if (obj.type === "result") {
            const data = obj.data as ResultData;
            setVerdict(data.verdict);
            const breakdown = getConfidenceBreakdown(data.confidence);
            setRealConfidence(breakdown.realConfidence);
            setFakeConfidence(breakdown.fakeConfidence);
            setReasoning(data.reasoning);
            setDetails(data.details ?? null);
            setFrameCount(data.frameCount);
          } else if (obj.type === "error") {
            throw new Error(obj.message);
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert("Analysis failed: " + msg);
    } finally {
      setAnalyzing(false);
      setStatusMessage("");
    }
  };

  const resetState = () => {
    setFile(null);
    setVerdict(null);
    setRealConfidence(0);
    setFakeConfidence(0);
    setReasoning("");
    setDetails(null);
    setFrameCount(undefined);
    setStatusMessage("");
  };

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
        <div className="flex items-center gap-3">
          <a href="/image-detect" className="border border-gray-300 text-gray-500 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Image Detection
          </a>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center px-4 py-16">
        <div className="w-14 h-14 bg-[#3B4FE0] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <Video size={28} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-[#1a2744] text-center mb-2">
          Video Deepfake Detection
        </h1>
        <p className="text-[#3B4FE0] font-semibold text-lg text-center mb-3">
          भिडियो प्रमाण सत्यापन
        </p>
        <p className="text-gray-500 text-sm text-center max-w-lg mb-12">
          Upload a video to detect AI-generated content, deepfakes, and manipulations using Hive AI.
        </p>

        <div className="w-full max-w-2xl">
          {!verdict ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center transition-colors cursor-pointer ${
                dragging ? "border-[#3B4FE0] bg-blue-50" : "border-gray-300 bg-gray-50 hover:border-[#3B4FE0]"
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
                accept="video/*"
                onChange={(e) => e.target.files && setFile(e.target.files[0])}
              />
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                <Upload size={28} className="text-gray-400" />
              </div>
              {file ? (
                <div className="flex flex-col items-center gap-3 w-full">
                  {analyzing ? (
                    <div className="scanner-container rounded-lg shadow-sm">
                      <video
                        ref={videoRef}
                        src={URL.createObjectURL(file)}
                        className="max-h-64 w-full object-contain"
                      />
                      <div className="scanner-glow" />
                      <div className="scanner-line" />
                      <div className="absolute top-0 left-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_12px_#3b82f6] z-20" />
                      <div className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_12px_#3b82f6] z-20" />
                      <div className="absolute bottom-0 left-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_12px_#3b82f6] z-20" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_12px_#3b82f6] z-20" />
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      src={URL.createObjectURL(file)}
                      controls
                      className="max-h-64 rounded-lg shadow-sm"
                    />
                  )}
                  <p className="font-semibold text-[#1a2744] text-center text-sm">{file.name}</p>
                </div>
              ) : (
                <>
                  <p className="font-semibold text-[#1a2744] text-center text-base">
                    Upload video to check integrity
                  </p>
                  <p className="text-[#3B4FE0] text-sm text-center mt-1">
                    भिडियोको वास्तविकता जाँच गर्न अपलोड गर्नुहोस्
                  </p>
                  <p className="text-gray-400 text-xs mt-3">
                    Supports: MP4, WebM, AVI, MKV, WMV, MOV (Max 50MB)
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className={`px-8 py-5 flex items-center justify-between ${verdict === "REAL" ? "bg-green-50" : "bg-red-50"}`}>
                <div className="flex items-center gap-3">
                  {verdict === "REAL" ? <CheckCircle size={32} className="text-green-600" /> : <XCircle size={32} className="text-red-600" />}
                  <div>
                    <p className={`text-2xl font-bold ${verdict === "REAL" ? "text-green-700" : "text-red-700"}`}>
                      {verdict === "REAL" ? "REAL / वास्तविक" : "FAKE / कृत्रिम"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {verdict === "REAL" ? "No signs of AI manipulation detected." : "AI/Deepfake manipulation detected."}
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold text-sm ${verdict === "REAL" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                  {verdict === "REAL" ? `${realConfidence}% real confidence` : `${fakeConfidence}% fake confidence`}
                </div>
              </div>

              <div className="px-8 py-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs font-semibold text-gray-600">Real confidence</p>
                  <p className="text-lg font-bold text-green-700">{realConfidence}%</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <p className="text-xs font-semibold text-gray-600">Fake confidence</p>
                  <p className="text-lg font-bold text-red-700">{fakeConfidence}%</p>
                </div>
              </div>

              <div className="px-8 py-4 bg-white border-t border-gray-100">
                <p className="text-sm text-gray-700">{reasoning}</p>
              </div>

              {details && (
                <div className="px-8 py-4 bg-white border-t border-gray-100 grid grid-cols-2 gap-4">
                  {details.aiGenerated && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-xs font-semibold text-gray-600">AI Generated</span>
                      <span className={`text-xs font-bold ${details.aiGenerated.verdict === "FAKE" ? "text-red-600" : "text-green-600"}`}>
                        {details.aiGenerated.verdict} ({(details.aiGenerated.score * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                  {details.deepfake && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-xs font-semibold text-gray-600">Deepfake</span>
                      <span className={`text-xs font-bold ${details.deepfake.verdict === "FAKE" ? "text-red-600" : "text-green-600"}`}>
                        {details.deepfake.verdict} ({(details.deepfake.score * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                  {details.generator && details.generator.name !== "none" && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-xs font-semibold text-gray-600">Generator</span>
                      <span className="text-xs font-bold text-[#3B4FE0]">
                        {details.generator.name} ({(details.generator.score * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                  {details.audio && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                      <span className="text-xs font-semibold text-gray-600">AI Audio</span>
                      <span className={`text-xs font-bold ${details.audio.verdict === "FAKE" ? "text-red-600" : "text-green-600"}`}>
                        {details.audio.verdict} ({(details.audio.score * 100).toFixed(1)}%)
                      </span>
                    </div>
                  )}
                  {frameCount && frameCount > 1 && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 col-span-2">
                      <span className="text-xs font-semibold text-gray-600">Video Frames Analyzed</span>
                      <span className="text-xs font-bold text-gray-700">{frameCount}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-3">
                <button
                  onClick={resetState}
                  className="flex items-center gap-2 border border-gray-300 text-gray-500 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors ml-auto"
                >
                  Analyze Another Video
                </button>
              </div>
            </div>
          )}

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
                  {statusMessage || "Analyzing... / विश्लेषण हुँदैछ..."}
                </span>
              ) : (
                "Analyze Video / भिडियो विश्लेषण गर्नुहोस्"
              )}
            </button>
          )}
        </div>


      </main>

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
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Home / गृहपृष्ठ</a></li>
              <li><a href="/image-detect" className="hover:text-white transition-colors">Image Detection / तस्बिर जाँच</a></li>
              <li><a href="/video-detect" className="hover:text-white transition-colors">Video Detection / भिडियो जाँच</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">Emergency Contact</h4>
            <p className="text-4xl font-bold text-white mb-1">100</p>
            <p className="text-gray-400 text-sm mb-4">Nepal Police Hotline</p>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-gray-500">
          © 2026 Nepal Police AI Evidence Integrity System. Authorized Access Only.
        </div>
      </footer>
    </div>
  );
}
