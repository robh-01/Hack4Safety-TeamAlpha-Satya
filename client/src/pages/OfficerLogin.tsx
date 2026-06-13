import { useState } from "react";
import { ShieldCheck, User, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function OfficerLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // navigate to dashboard — wire up your router here
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Top bar */}
      <div className="bg-[#1a2744] py-3 px-6 flex items-center justify-center gap-2">
        <ShieldCheck size={16} className="text-gray-400" />
        <span className="text-gray-400 text-xs tracking-widest uppercase">
          Nepal Police — Cyber Bureau Headquarters
        </span>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#3B4FE0] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a2744] tracking-wide">SATYA</h1>
          <p className="text-[#3B4FE0] font-semibold text-sm mt-1">NEPAL POLICE</p>
          <p className="text-gray-400 text-xs tracking-widest uppercase">
            Cyber Bureau Headquarters
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
          {/* Card Header */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-[#1a2744] text-center">
              SATYA Officer Portal
            </h2>
            <p className="text-gray-400 text-sm text-center mt-1">
              अधिकारी पोर्टल — लगइन गर्नुहोस्
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="px-8 py-6 space-y-5">
            {/* Username */}
            <div>
              <label className="block font-bold text-[#1a2744] text-sm mb-1">
                प्रयोगकर्ता नाम
              </label>
              <p className="text-gray-400 text-xs mb-2">USERNAME</p>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Officer ID / Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE0] focus:border-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-bold text-[#1a2744] text-sm mb-1">
                पासवर्ड
              </label>
              <p className="text-gray-400 text-xs mb-2">PASSWORD</p>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B4FE0] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#3B4FE0]"
                />
                <span className="text-sm text-gray-500">Remember Me</span>
              </label>
              <a
                href="#"
                className="text-sm text-[#3B4FE0] font-semibold hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1a2744] text-white rounded-lg py-3 font-bold text-sm hover:bg-[#243459] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Verifying...
                </>
              ) : (
                "लगइन गर्नुहोस् / Login"
              )}
            </button>

            {/* Authorized only */}
            <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              <AlertCircle size={14} className="text-red-500 shrink-0" />
              <p className="text-red-600 text-xs font-semibold uppercase tracking-wide">
                Authorized Personnel Only / अधिकृत कर्मचारीहरूको लागि मात्र
              </p>
            </div>
          </form>

          {/* Card Footer */}
          <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-center gap-6">
            <a href="/" className="text-xs text-gray-500 hover:text-[#3B4FE0] transition-colors">
              Public Portal / सार्वजनिक पोर्टल
            </a>
            <span className="text-gray-300">•</span>
            <a href="#" className="text-xs text-gray-500 hover:text-[#3B4FE0] transition-colors">
              Help Desk / सहायता डेस्क
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        © 2026 Nepal Police AI Evidence Integrity System. Authorized Access Only.
      </div>
    </div>
  );
}