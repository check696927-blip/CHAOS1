import { useState } from "react";
import { X, Mail, Lock, User as UserIcon } from "lucide-react";
import {
  loginWithEmail,
  loginWithGoogle,
  signupWithEmail,
} from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

export const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const { login } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let user;

      if (mode === "login") {
        user = await loginWithEmail(formData.email, formData.password);
      } else {
        user = await signupWithEmail(
          formData.email,
          formData.password,
          formData.name
        );
      }

      if (user) {
        // 🔒 SAFE NORMALIZATION (prevents Supabase shape crashes)
        const safeUser = {
          ...user,
          name:
            formData.name ||
            (user as any)?.user_metadata?.name ||
            (user as any)?.user_metadata?.full_name ||
            (user as any)?.name ||
            "",
        };

        login(safeUser);
        onClose();
      } else {
        setError("Authentication failed");
      }
    } catch (err: any) {
      setError(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setError(err?.message || "Google login failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-chaos-dark border-2 border-chaos-purple/50 rounded-lg max-w-md w-full shadow-2xl">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-chaos-purple/20 to-chaos-red/20 p-6 border-b border-chaos-purple/30 flex items-center justify-between">
          <h2 className="font-chaos text-2xl neon-text-purple">
            {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 text-sm rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full bg-chaos-darker border border-chaos-purple/30 rounded-lg pl-10 py-3 text-white"
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, email: e.target.value }))
                }
                className="w-full bg-chaos-darker border border-chaos-purple/30 rounded-lg pl-10 py-3 text-white"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, password: e.target.value }))
                }
                className="w-full bg-chaos-darker border border-chaos-purple/30 rounded-lg pl-10 py-3 text-white"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-chaos-purple to-chaos-red py-3 rounded-lg text-white font-bold disabled:opacity-50"
            >
              {loading
                ? "Loading..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            className="w-full border border-chaos-purple/30 py-3 rounded-lg text-white"
          >
            Continue with Google
          </button>

          {/* SWITCH MODE */}
          <p className="text-center text-sm text-gray-400">
            {mode === "login" ? (
              <>
                No account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-chaos-purple"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-chaos-purple"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};