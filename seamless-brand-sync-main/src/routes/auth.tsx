import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Mail, User as UserIcon, Eye, EyeOff, X, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import { cn, getImageUrl } from "@/lib/utils";
import { AuthSlideshow } from "@/components/AuthSlideshow";
import logo from "@/assets/mocs-logo.png";

type AuthSearch = { redirect?: string; mode?: "login" | "signup" };

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): AuthSearch => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
    mode: s.mode === "login" || s.mode === "signup" ? s.mode : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign in or create account — MOCS" },
      { name: "description", content: "Sign in to your MOCS account or create one to start shopping." },
    ],
  }),
  component: AuthPage,
});

function cleanErrorMessage(err: any): string {
  let msg = err?.message || (typeof err === "string" ? err : "");
  if (msg.includes("API ")) {
    const jsonStart = msg.indexOf("{");
    if (jsonStart !== -1) {
      try {
        const jsonStr = msg.substring(jsonStart);
        const parsed = JSON.parse(jsonStr);
        if (parsed.message) {
          return parsed.message;
        }
      } catch (e) {}
    }
    msg = msg.replace(/^API\s+\d+:\s*/, "");
  }
  return msg || "An unexpected error occurred.";
}

function AuthPage() {
  const navigate = useNavigate();
  const { redirect, mode: initialMode } = useSearch({ from: "/auth" });
  const { login, user } = useStore();

  const [mode, setMode] = useState<"login" | "signup">(initialMode ?? "login");
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: "",
    message: "",
  });

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dynamic Auth Visual Slides Config
  const [authSlides, setAuthSlides] = useState<any[]>([
    {
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800",
      title: "Discover Your Style",
      subtitle: "Explore premium MOCS collections tailored just for you.",
    },
    {
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800",
      title: "Create Your Vision",
      subtitle: "Join our community to unlock custom footwear and personalized styles.",
    },
    {
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800",
      title: "Crafted For Comfort",
      subtitle: "Every pair is built for active lifestyles and durable comfort.",
    },
  ]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);

  // Load Auth custom settings
  useEffect(() => {
    const loadAuthAssets = async () => {
      try {
        const res = await apiClient.settings.get("auth_settings").catch(() => null);
        if (res && res.value && res.value.slides && Array.isArray(res.value.slides) && res.value.slides.length > 0) {
          setAuthSlides(res.value.slides);
        }
      } catch (err) {
        console.warn("Failed to load auth settings, using defaults.", err);
      }
    };
    loadAuthAssets();
  }, []);

  // Slide cycle for mobile circle visual
  useEffect(() => {
    if (authSlides.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % authSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [authSlides.length]);

  // Handle local state redirects
  const targetRedirect = redirect && redirect !== "/auth" ? redirect : "/";

  useEffect(() => {
    if (user) {
      if (user.role === "admin" || user.role === "superadmin") {
        navigate({ to: "/admin/dashboard" });
      } else {
        navigate({ to: targetRedirect });
      }
    }
  }, [user, navigate, targetRedirect]);

  // Load Google GSI Client Script
  useEffect(() => {
    const scriptId = "google-gsi-client";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  }, []);

  // Google Account Chooser Popup Handler
  const handleGoogleSignIn = () => {
    const googleClientId =
      (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
      "44245383395-mturmuberljno376tmp99as975b8l9oo.apps.googleusercontent.com";
    const windowGoogle = (window as any).google;

    if (!windowGoogle?.accounts?.oauth2) {
      toast.error("Google Sign-In is initializing. Please click again in a second.");
      return;
    }

    setLoading(true);

    try {
      const tokenClient = windowGoogle.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: "email profile openid",
        callback: async (tokenResponse: any) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              });
              const profile = await userRes.json();

              if (profile && profile.email) {
                const email = profile.email;
                const name = profile.name || profile.given_name || "Google User";
                const avatar = profile.picture || "";
                const clerkId = `google-${profile.sub || Date.now()}`;

                const res = await apiClient.auth.clerkSync({ email, name, clerkId, avatar, mode });
                if (res && res.token && res.user) {
                  login(res.token, res.user);
                  toast.success("Signed in with Google!", { id: "auth-toast" });
                  window.location.href = targetRedirect;
                }
              }
            } catch (err: any) {
              const msg = cleanErrorMessage(err);
              if (mode === "login" && (msg.includes("No account found") || msg.includes("404"))) {
                setMode("signup");
                setErrorModal({
                  isOpen: true,
                  title: "Account Not Found",
                  message:
                    msg ||
                    `No account exists for this Google email. We have switched you to the Sign Up tab so you can create your account.`,
                });
              } else {
                setErrorModal({
                  isOpen: true,
                  title: "Google Sign-In Error",
                  message: msg || "Failed to sign in with Google.",
                });
              }
            } finally {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        },
      });

      tokenClient.requestAccessToken({ prompt: "select_account" });
    } catch (err: any) {
      console.error("Google Popup error:", err);
      toast.error("Failed to open Google sign in popup.");
      setLoading(false);
    }
  };

  // Submit Handler
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim();
    const password = String(fd.get("password") ?? "");
    const firstName = String(fd.get("firstName") ?? "").trim();
    const lastName = String(fd.get("lastName") ?? "").trim();
    const confirmPassword = String(fd.get("confirmPassword") ?? "");

    if (!email) {
      setErrorModal({
        isOpen: true,
        title: "Validation Error",
        message: "Please enter your email address",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorModal({
        isOpen: true,
        title: "Validation Error",
        message: "Please enter a valid email address",
      });
      return;
    }

    if (password.length < 8) {
      setErrorModal({
        isOpen: true,
        title: "Validation Error",
        message: "Password must be at least 8 characters",
      });
      return;
    }

    if (mode === "signup" && password !== confirmPassword) {
      setErrorModal({
        isOpen: true,
        title: "Validation Error",
        message: "Passwords do not match",
      });
      return;
    }

    setLoading(true);

    try {
      const name = `${firstName} ${lastName}`.trim() || "Local User";
      const res =
        mode === "login"
          ? await apiClient.auth.login(email, password)
          : await apiClient.auth.register({ name, email, password });

      login(res.token, res.user);
      toast.success(mode === "login" ? "Welcome back" : "Account created", { id: "auth-toast" });
      navigate({ to: targetRedirect });
    } catch (err: any) {
      const msg = err?.message ?? "Sign-in failed";
      if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
        const dummyUser = { id: `guest-${Date.now()}`, name: "Guest User", email: "guest@example.com", role: "user" };
        login("mock-token", dummyUser);
        toast.info("Offline mode: Logged in as demo guest.", { id: "auth-toast" });
        navigate({ to: targetRedirect });
      } else {
        setErrorModal({
          isOpen: true,
          title: mode === "login" ? "Login Error" : "Sign Up Error",
          message: cleanErrorMessage(err),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const currentSlide = authSlides[activeSlideIdx] || authSlides[0];

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-3 sm:p-6 font-sans bg-[#0c0b0a] md:bg-gradient-to-br md:from-[#faf7f2] md:to-[#f0eae1] md:dark:from-[#141210] md:dark:to-[#0f0e0d] text-stone-100 md:text-stone-900">
      
      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 1. MOBILE PHONE DESIGN (< md)                                         */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="block md:hidden w-full max-w-[430px] rounded-[32px] bg-[#141312] border border-white/[0.09] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden text-left">
        
        {/* Top Header / Brand Visual Pane */}
        <div className="p-5 pb-4 flex flex-col items-center relative border-b border-white/[0.06] bg-gradient-to-b from-[#181615] to-[#141312]">
          {/* Top Bar: Brand Logo & Close Action */}
          <div className="w-full flex items-center justify-between">
            <Link to="/" className="flex items-center group">
              <img
                src={logo}
                alt="MOCS"
                className="h-7 sm:h-8 w-auto object-contain select-none"
                draggable={false}
              />
            </Link>

            <Link
              to="/"
              aria-label="Close and return to store"
              className="h-8 w-8 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/10 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </Link>
          </div>

          {/* Center Circular Visual / Focus Badge */}
          <div className="my-5 relative flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border border-white/15 bg-black/40 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden p-1">
              {currentSlide?.image ? (
                <img
                  src={getImageUrl(currentSlide.image, { width: 300, quality: 80 })}
                  alt="MOCS Footwear"
                  className="h-full w-full object-cover rounded-full select-none"
                />
              ) : (
                <img
                  src={logo}
                  alt="MOCS"
                  className="h-8 w-auto object-contain select-none"
                />
              )}
            </div>
            {/* Subtle glow behind circle */}
            <div className="absolute inset-0 rounded-full bg-[#ea580c]/10 blur-xl pointer-events-none" />
          </div>
        </div>

        {/* Lower Form Pane */}
        <div className="p-5 space-y-5">
          {/* Sign Up / Log In Toggle Switch */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-[#0e0d0c] border border-white/[0.06]">
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={cn(
                "py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer",
                mode === "signup"
                  ? "bg-[#ea580c] text-white shadow-md shadow-orange-600/30"
                  : "bg-transparent text-stone-400 hover:text-white"
              )}
            >
              Sign up
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={cn(
                "py-2.5 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 cursor-pointer",
                mode === "login"
                  ? "bg-[#ea580c] text-white shadow-md shadow-orange-600/30"
                  : "bg-transparent text-stone-400 hover:text-white"
              )}
            >
              Log in
            </button>
          </div>

          {/* Form Header */}
          <div>
            <h1 className="font-serif text-2xl font-normal text-white tracking-[-0.015em] leading-tight">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-xs text-stone-400 font-light mt-1">
              {mode === "login"
                ? "Sign in to continue your order."
                : "Sign up to track your orders and exclusive drops."}
            </p>
          </div>

          {/* Form Fields */}
          <form onSubmit={onSubmit} className="space-y-3.5">
            {/* Sign up Mode: Name Inputs */}
            <AnimatePresence initial={false}>
              {mode === "signup" && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="grid grid-cols-2 gap-3 overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-stone-400 block">First Name</label>
                    <input
                      name="firstName"
                      required={mode === "signup"}
                      placeholder="e.g. Ethan"
                      className="w-full rounded-xl bg-[#1c1a18] border border-white/[0.08] focus:border-[#ea580c] px-3.5 py-3 text-sm text-white placeholder-stone-500 outline-none transition duration-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-stone-400 block">Last Name</label>
                    <input
                      name="lastName"
                      required={mode === "signup"}
                      placeholder="e.g. Walker"
                      className="w-full rounded-xl bg-[#1c1a18] border border-white/[0.08] focus:border-[#ea580c] px-3.5 py-3 text-sm text-white placeholder-stone-500 outline-none transition duration-200"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-stone-400 block">Email address</label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@email.com"
                autoComplete="email"
                className="w-full rounded-xl bg-[#1c1a18] border border-white/[0.08] focus:border-[#ea580c] px-4 py-3 text-sm text-white placeholder-stone-500 outline-none transition duration-200"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-stone-400 block">Password</label>
              <div className="relative flex items-center">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full rounded-xl bg-[#1c1a18] border border-white/[0.08] focus:border-[#ea580c] px-4 py-3 pr-11 text-sm text-white placeholder-stone-500 outline-none transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-stone-400 hover:text-white transition cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password in Sign Up Mode */}
            <AnimatePresence initial={false}>
              {mode === "signup" && (
                <motion.div
                  initial={{ height: 0, opacity: 0, y: -10 }}
                  animate={{ height: "auto", opacity: 1, y: 0 }}
                  exit={{ height: 0, opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="space-y-1.5 overflow-hidden"
                >
                  <label className="text-[11px] font-medium text-stone-400 block">Confirm Password</label>
                  <div className="relative flex items-center">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required={mode === "signup"}
                      placeholder="Confirm password"
                      autoComplete="new-password"
                      className="w-full rounded-xl bg-[#1c1a18] border border-white/[0.08] focus:border-[#ea580c] px-4 py-3 pr-11 text-sm text-white placeholder-stone-500 outline-none transition duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-stone-400 hover:text-white transition cursor-pointer p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Forgot Password Link */}
            {mode === "login" && (
              <div className="flex justify-end pt-0.5">
                <button
                  type="button"
                  onClick={() =>
                    setErrorModal({
                      isOpen: true,
                      title: "Password Reset",
                      message: "Please contact support@mocs.in or use Google Account login to regain instant access.",
                    })
                  }
                  className="text-xs text-[#ea580c] hover:underline transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-xl bg-[#ea580c] hover:bg-[#f97316] text-white font-bold py-3.5 text-sm uppercase tracking-wider shadow-lg shadow-orange-600/25 active:scale-[0.98] transition cursor-pointer disabled:opacity-60"
            >
              {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <span className="relative bg-[#141312] px-3 text-[11px] text-stone-500">
              or continue with
            </span>
          </div>

          {/* Google Account Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border border-white/[0.08] bg-[#1c1a18] hover:bg-white/[0.06] hover:border-white/20 active:scale-[0.98] transition text-xs font-semibold text-white cursor-pointer disabled:opacity-50"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google account</span>
          </button>

          {/* Legal / Policy Note */}
          <p className="text-center text-[10px] text-stone-500 leading-normal pt-1">
            By continuing you agree to the{" "}
            <Link to="/terms" className="text-[#ea580c] hover:underline">
              terms
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-[#ea580c] hover:underline">
              privacy policy
            </Link>
            .
          </p>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────── */}
      {/* 2. DESKTOP / BIG SCREEN SPLIT-PANE DESIGN (md: and above)             */}
      {/* ───────────────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col items-center justify-center w-full max-w-3xl">
        {/* Top Back Action Header */}
        <div className="w-full mb-3.5 flex items-center justify-between px-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to store</span>
          </Link>
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="MOCS"
              className="h-7 sm:h-8 w-auto object-contain select-none"
              draggable={false}
            />
          </Link>
        </div>

        {/* Card with Split Pane Layout */}
        <div className="w-full rounded-[26px] bg-white border border-stone-200/80 flex flex-row overflow-hidden shadow-card text-stone-900">
          {/* Left Visual Slideshow Pane */}
          <AuthSlideshow authSlides={authSlides} />

          {/* Right Form Pane */}
          <div className="w-[55%] p-7 lg:p-8 flex flex-col justify-center text-stone-900 bg-white text-left">
            {/* Sliding Tab Mode Selector */}
            <div className="flex mb-4">
              <div className="relative flex rounded-full bg-stone-100 border border-stone-200/80 p-0.5 text-[11px] font-bold w-fit">
                {(["signup", "login"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={cn(
                      "relative rounded-full px-5 py-2 uppercase tracking-wider transition-colors duration-300 z-10 cursor-pointer",
                      mode === m ? "text-white font-extrabold" : "text-stone-500 hover:text-stone-800"
                    )}
                  >
                    {mode === m && (
                      <motion.div
                        layoutId="activeTabPillDesktop"
                        className="absolute inset-0 rounded-full bg-primary z-[-1]"
                        transition={{ type: "spring", stiffness: 350, damping: 28 }}
                      />
                    )}
                    {m === "login" ? "Log In" : "Sign Up"}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Title & Subtitle */}
            <div className="mb-4">
              <h1 className="font-serif text-2xl font-bold tracking-tight text-stone-900">
                {mode === "login" ? "Welcome Back" : "Create An Account"}
              </h1>
              <p className="mt-1 text-xs text-stone-500 font-light">
                {mode === "login"
                  ? "Sign in to continue your order and save changes."
                  : "Become a member to get early shoe drops, coupons, and orders track."}
              </p>
            </div>

            {/* Desktop Form */}
            <form onSubmit={onSubmit} className="space-y-3">
              {/* Sign up Mode: First / Last Name side-by-side */}
              <AnimatePresence initial={false}>
                {mode === "signup" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -15 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="grid grid-cols-2 gap-3 overflow-hidden"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">First Name</label>
                      <label className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 focus-within:border-primary focus-within:bg-white transition duration-200">
                        <UserIcon className="h-4 w-4 text-stone-400" />
                        <input
                          name="firstName"
                          required={mode === "signup"}
                          placeholder="e.g. Ethan"
                          className="w-full bg-transparent text-sm outline-none text-stone-900 placeholder-stone-400"
                        />
                      </label>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Last Name</label>
                      <label className="flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2 focus-within:border-primary focus-within:bg-white transition duration-200">
                        <UserIcon className="h-4 w-4 text-stone-400" />
                        <input
                          name="lastName"
                          required={mode === "signup"}
                          placeholder="e.g. Walker"
                          className="w-full bg-transparent text-sm outline-none text-stone-900 placeholder-stone-400"
                        />
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Email Address</label>
                <label className="flex items-center gap-3.5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 focus-within:border-primary focus-within:bg-white transition duration-200">
                  <Mail className="h-4 w-4 text-stone-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="enter your email"
                    autoComplete="off"
                    className="w-full bg-transparent text-sm outline-none text-stone-900 placeholder-stone-400"
                  />
                </label>
              </div>

              {/* Password input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400 font-semibold">Password</label>
                <label className="flex items-center gap-3.5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 focus-within:border-primary focus-within:bg-white transition duration-200">
                  <Lock className="h-4 w-4 text-stone-400" />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full bg-transparent text-sm outline-none text-stone-900 placeholder-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-stone-400 hover:text-stone-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </label>
              </div>

              {/* Confirm Password input for Sign up */}
              <AnimatePresence initial={false}>
                {mode === "signup" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, y: -10 }}
                    animate={{ height: "auto", opacity: 1, y: 0 }}
                    exit={{ height: 0, opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="space-y-1 overflow-hidden"
                  >
                    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Confirm Password</label>
                    <label className="flex items-center gap-3.5 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 focus-within:border-primary focus-within:bg-white transition duration-200">
                      <Lock className="h-4 w-4 text-stone-400" />
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required={mode === "signup"}
                        placeholder="Confirm Password"
                        autoComplete="new-password"
                        className="w-full bg-transparent text-sm outline-none text-stone-900 placeholder-stone-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-stone-400 hover:text-stone-600 transition cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl font-bold uppercase tracking-wider text-white bg-primary hover:bg-primary-glow active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer shadow-md shadow-orange-500/10"
              >
                {loading ? "Please wait..." : mode === "login" ? "Log In" : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-3.5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <span className="relative bg-white px-3 text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                Or continue with
              </span>
            </div>

            {/* Google Sign In via Official GSI */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-stone-200/90 bg-stone-50 hover:bg-stone-100 active:scale-[0.98] transition-all text-xs font-bold uppercase tracking-wider text-stone-700 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google Account</span>
            </button>

            <p className="mt-3.5 text-center text-[10px] text-stone-400 leading-normal font-medium">
              By continuing you agree to the MOCS{" "}
              <Link to="/terms" className="font-semibold text-primary hover:underline">Terms of Service</Link>,{" "}
              <Link to="/privacy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>, and{" "}
              <Link to="/shipping" className="font-semibold text-primary hover:underline">Shipping Policy</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* ── ERROR / NOTIFICATION MODAL ────────────────────────────────────── */}
      <AnimatePresence>
        {errorModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#1c1a18] p-6 shadow-2xl space-y-4 text-left font-sans text-stone-100"
            >
              <div className="flex items-center gap-3 text-[#ea580c]">
                <div className="rounded-full bg-orange-500/10 p-2 border border-orange-500/20">
                  <X className="h-5 w-5 text-[#ea580c]" />
                </div>
                <h3 className="font-display text-base font-bold text-white">{errorModal.title}</h3>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed break-words">
                {errorModal.message}
              </p>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setErrorModal({ isOpen: false, title: "", message: "" })}
                  className="rounded-xl bg-[#ea580c] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-orange-600 cursor-pointer shadow-md shadow-orange-600/20"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
