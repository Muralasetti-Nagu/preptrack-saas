import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchAPI } from "../services/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

export const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await fetchAPI("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      login(data.user, data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <style>{`
        .auth-page { background: #f8fafc; }
        .auth-card {
          background: rgba(255,255,255,0.85);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(226,232,240,0.6);
          border-radius: 1.25rem;
          box-shadow: 0 4px 24px -4px rgba(0,0,0,0.06), 0 12px 48px -8px rgba(0,0,0,0.04);
          animation: authFadeUp 0.6s ease-out both;
        }
        .auth-input-group {
          position: relative;
        }
        .auth-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          transition: color 0.2s;
        }
        .auth-input-group:focus-within .auth-input-icon {
          color: #6366f1;
        }
        .auth-blob-1 {
          position: absolute;
          top: -120px;
          right: -80px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        .auth-blob-2 {
          position: absolute;
          bottom: -100px;
          left: -60px;
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
        }
        @keyframes authFadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] bg-slate-900 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99,102,241,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(59,130,246,0.2) 0%, transparent 50%)'
        }} />
        <div className="relative z-10 max-w-md space-y-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              Prep<span className="text-indigo-400">Track</span>
            </h1>
            <p className="text-slate-400 mt-4 text-lg leading-relaxed">
              Your all-in-one interview preparation tracker. Organize problems, visualize progress, and stay consistent.
            </p>
          </div>
          <div className="space-y-4 pt-4">
            {[
              "Track problems across LeetCode, HackerRank & more",
              "Visualize progress with beautiful analytics",
              "Build consistency with streak tracking",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                </div>
                <p className="text-sm text-slate-300">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 auth-page flex items-center justify-center p-6 relative">
        <div className="auth-blob-1" />
        <div className="auth-blob-2" />

        <div className="w-full max-w-[420px] space-y-8 relative z-10">
          {/* Mobile Logo */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight lg:hidden">
              Prep<span className="text-primary">Track</span>
            </h1>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-2 lg:mt-0">
              Create your account
            </h2>
            <p className="mt-1.5 text-sm text-slate-400 font-medium">
              Start your preparation journey today
            </p>
          </div>

          <div className="auth-card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-rose-50 p-3.5 text-sm text-rose-600 border border-rose-100 font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="name">Full name</label>
                <div className="auth-input-group">
                  <User className="auth-input-icon h-4 w-4" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email</label>
                <div className="auth-input-group">
                  <Mail className="auth-input-icon h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700" htmlFor="password">Password</label>
                <div className="auth-input-group">
                  <Lock className="auth-input-icon h-4 w-4" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-11 text-sm font-semibold mt-2 gap-2" disabled={isLoading}>
                {isLoading ? "Creating account..." : (
                  <>Get started <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>
          </div>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:text-primaryHover trans-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
