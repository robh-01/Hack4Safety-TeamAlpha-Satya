import { ShieldCheck, Image, Video, ArrowRight } from "lucide-react";

export default function PublicPortal() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#3B4FE0] rounded-lg flex items-center justify-center">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <span className="font-bold text-[#1a2744] text-base">SATYA</span>
            <span className="text-gray-400 text-xs ml-2">नेपाल प्रहरी</span>
            <div className="text-[10px] text-gray-400 leading-none">
              NEPAL POLICE
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center px-4 py-20">
        <div className="w-16 h-16 bg-[#3B4FE0] rounded-2xl flex items-center justify-center mb-6 shadow-lg">
          <ShieldCheck size={32} className="text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#1a2744] text-center mb-2">
          AI Evidence Integrity System
        </h1>
        <p className="text-[#3B4FE0] font-semibold text-lg text-center mb-3">
          डिजिटल प्रमाण सत्यापन प्रणाली
        </p>
        <p className="text-gray-500 text-sm text-center max-w-lg mb-16">
          Official platform for the Nepal Police to verify the authenticity of
          digital media. Choose a detection mode below.
        </p>

        {/* Route Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
          <a
            href="/image-detect"
            className="group bg-white rounded-2xl border border-gray-200 p-8 hover:border-[#3B4FE0] hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-[#3B4FE0] group-hover:text-white transition-colors">
              <Image
                size={28}
                className="text-[#3B4FE0] group-hover:text-white transition-colors"
              />
            </div>
            <h2 className="text-xl font-bold text-[#1a2744] mb-2">
              Image Detection
            </h2>
            <p className="text-gray-500 text-sm mb-4">तस्बिर जाँच</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Upload images to detect AI-generated content, deepfakes, and
              digital manipulations. Supports JPG, PNG, WebP, GIF.
            </p>
            <span className="inline-flex items-center gap-2 text-[#3B4FE0] font-semibold text-sm group-hover:gap-3 transition-all">
              Open Image Detection <ArrowRight size={16} />
            </span>
          </a>

          <a
            href="/video-detect"
            className="group bg-white rounded-2xl border border-gray-200 p-8 hover:border-[#3B4FE0] hover:shadow-lg transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-[#3B4FE0] group-hover:text-white transition-colors">
              <Video
                size={28}
                className="text-[#3B4FE0] group-hover:text-white transition-colors"
              />
            </div>
            <h2 className="text-xl font-bold text-[#1a2744] mb-2">
              Video Detection
            </h2>
            <p className="text-gray-500 text-sm mb-4">भिडियो जाँच</p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Upload videos for AI and deepfake detection using Hive AI.
              Analyzes per-frame with multi-frame aggregation. Supports MP4,
              WebM, AVI, MOV.
            </p>
            <span className="inline-flex items-center gap-2 text-[#3B4FE0] font-semibold text-sm group-hover:gap-3 transition-all">
              Open Video Detection <ArrowRight size={16} />
            </span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-24 flex flex-wrap justify-between gap-6 max-w-4xl w-full">
          {[
            { title: "Official Verification", desc: "Directly linked to Nepal Police Cyber Bureau databases for official forensic audit." },
            { title: "Privacy Guaranteed", desc: "Uploaded files are encrypted and automatically purged after 24 hours if not submitted for investigation." },
          ].map((item, i) => (
            <div key={i} className="flex-1 min-w-[200px] flex flex-col items-start gap-3 p-6 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <ShieldCheck size={20} className="text-[#3B4FE0]" />
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
              Empowering the Nepal Police with cutting-edge verification
              technology.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home / गृहपृष्ठ
                </a>
              </li>
              <li>
                <a
                  href="/image-detect"
                  className="hover:text-white transition-colors"
                >
                  Image Detection / तस्बिर जाँच
                </a>
              </li>
              <li>
                <a
                  href="/video-detect"
                  className="hover:text-white transition-colors"
                >
                  Video Detection / भिडियो जाँच
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">
              Emergency Contact
            </h4>
            <p className="text-4xl font-bold text-white mb-1">100</p>
            <p className="text-gray-400 text-sm mb-4">Nepal Police Hotline</p>
            <div className="flex gap-2">
              <a
                href="https://www.facebook.com/NepalPolicePHQ"
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors text-xs font-bold"
              >
                f
              </a>
              <a
                href="https://x.com/NepalPoliceHQ"
                className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors text-xs font-bold"
              >
                𝕏
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 px-6 py-4 text-center text-xs text-gray-500">
          © 2026 Nepal Police AI Evidence Integrity System. Authorized Access
          Only.
        </div>
      </footer>
    </div>
  );
}
