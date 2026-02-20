"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  User,
  Building,
  Target,
  Loader2,
  Mail,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { createClient } from "@/utils/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<number | null>(null); // null = checking session
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const {
    setUser,
    setBusiness,
    setSimulationGoal,
    completeOnboarding,
    getUserOnboarding,
    setUserOnboarding,
    business,
    user,
  } = useOnboardingStore();
  const supabase = createClient();

  // Auth State
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signup");
  const [authError, setAuthError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    businessName: "",
    businessType: "",
    businessAddress: "",
    simulationGoal: "",
  });

  // Check if user is already signed in on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (authUser) {
          // User is signed in
          const email = authUser.email || "";
          const previousOnboarding = getUserOnboarding(email);

          if (previousOnboarding && previousOnboarding.business) {
            // They have previous business data - load it and go to step 3
            setUser({
              id: authUser.id,
              name: authUser.user_metadata?.full_name || email,
              email,
            });
            setBusiness(previousOnboarding.business);
            setFormData((prev) => ({
              ...prev,
              businessName: previousOnboarding.business?.name || "",
              businessType: previousOnboarding.business?.type || "",
              businessAddress: previousOnboarding.business?.address || "",
            }));
            setStep(3); // Skip to simulation goal
          } else {
            // Signed in but no previous business data - go to step 2
            setUser({
              id: authUser.id,
              name: authUser.user_metadata?.full_name || email,
              email,
            });
            setFormData((prev) => ({ ...prev, email }));
            setStep(2); // Go to business info
          }
        } else {
          // Not signed in - start from step 1
          setStep(1);
        }
      } catch (err) {
        console.error("Session check error:", err);
        setStep(1);
      } finally {
        setIsCheckingSession(false);
      }
    };

    checkSession();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (step === 1) setAuthError(null);
  };

  const handleAuth = async () => {
    setLoading(true);
    setAuthError(null);

    try {
      if (authMode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name,
            },
          },
        });
        if (error) throw error;
        setUser({
          id: data.user?.id,
          name: formData.name,
          email: formData.email,
        });
        setStep(2);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;

        const email = data.user.email!;
        const previousOnboarding = getUserOnboarding(email);

        setUser({
          id: data.user.id,
          name: data.user.user_metadata?.full_name || email,
          email,
        });

        // If they have previous business data, skip to step 3
        if (previousOnboarding && previousOnboarding.business) {
          setBusiness(previousOnboarding.business);
          setFormData((prev) => ({
            ...prev,
            businessName: previousOnboarding.business?.name || "",
            businessType: previousOnboarding.business?.type || "",
            businessAddress: previousOnboarding.business?.address || "",
          }));
          setStep(3);
        } else {
          setStep(2);
        }
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      handleAuth();
    } else if (step && step < 3) {
      setStep(step + 1);
    } else if (step === 3) {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setLoading(true);

    const businessData = {
      name: formData.businessName,
      type: formData.businessType,
      address: formData.businessAddress,
    };

    // Save to store
    setBusiness(businessData);
    setSimulationGoal(formData.simulationGoal);
    completeOnboarding();

    // Persist this user's onboarding data for future logins
    if (user?.email) {
      setUserOnboarding(user.email, {
        userId: user.id || user.email,
        email: user.email,
        business: businessData,
        simulationGoal: formData.simulationGoal,
        completedAt: Date.now(),
      });
    }

    router.push("/dashboard");
    setLoading(false);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  if (isCheckingSession || step === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono selection:bg-white selection:text-black">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-white/5 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-4 text-xs font-mono text-white/40 uppercase tracking-widest">
            <span className={step! >= 1 ? "text-white" : ""}>01. Account</span>
            <span className={step! >= 2 ? "text-white" : ""}>02. Business</span>
            <span className={step! >= 3 ? "text-white" : ""}>03. Goal</span>
          </div>
          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: "0%" }}
              animate={{ width: `${(step! / 3) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-black border border-white/10 p-8 md:p-12 backdrop-blur-sm relative overflow-hidden">
          {/* Corner Accents */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/30" />
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/30" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/30" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/30" />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center bg-white/5">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {authMode === "signup"
                        ? "Create Account"
                        : "Welcome Back"}
                    </h2>
                    <p className="text-white/50 text-sm">
                      {authMode === "signup"
                        ? "Start your market simulation journey."
                        : "Sign in to continue."}
                    </p>
                  </div>
                </div>

                {authError && (
                  <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    {authError}
                  </div>
                )}

                <div className="space-y-4">
                  {authMode === "signup" && (
                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-2 uppercase">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border border-white/20 p-4 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20 font-mono"
                        placeholder="e.g. Alex Chen"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-2 uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border border-white/20 p-4 pl-12 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20 font-mono"
                        placeholder="e.g. alex@example.com"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-2 uppercase">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border border-white/20 p-4 pl-12 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20 font-mono"
                        placeholder="••••••••"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center text-xs">
                  <button
                    onClick={() =>
                      setAuthMode(authMode === "signup" ? "signin" : "signup")
                    }
                    className="text-white/60 hover:text-white underline decoration-white/30 underline-offset-4 transition-colors"
                  >
                    {authMode === "signup"
                      ? "Already have an account? Sign in"
                      : "Need an account? Sign up"}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center bg-white/5">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      Tell us about your business
                    </h2>
                    <p className="text-white/50 text-sm">
                      This helps us create accurate personas.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-2 uppercase">
                      Business Name
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border border-white/20 p-4 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20 font-mono"
                      placeholder="e.g. Urban Coffee Roasters"
                      autoFocus
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-2 uppercase">
                        Business Type
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-white/20 p-4 text-white focus:outline-none focus:border-white transition-colors font-mono appearance-none"
                      >
                        <option value="" disabled>
                          Select Type
                        </option>
                        <option value="cafe">Cafe / Coffee Shop</option>
                        <option value="retail">Retail Store</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="service">Service Provider</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-white/70 mb-2 uppercase">
                        Location / Address
                      </label>
                      <input
                        type="text"
                        name="businessAddress"
                        value={formData.businessAddress}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border border-white/20 p-4 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20 font-mono"
                        placeholder="e.g. New York, NY"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 border border-white/20 flex items-center justify-center bg-white/5">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      What's your goal?
                    </h2>
                    <p className="text-white/50 text-sm">
                      What specific decision are you testing?
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-mono text-white/70 mb-2 uppercase">
                      Simulation Prompt
                    </label>
                    <textarea
                      name="simulationGoal"
                      value={formData.simulationGoal}
                      onChange={handleInputChange}
                      className="w-full bg-transparent border border-white/20 p-4 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20 font-mono h-32 resize-none"
                      placeholder="e.g. I want to increase the price of my latte by $0.50. How will this affect my regulars vs. new customers?"
                      autoFocus
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 flex justify-end">
            <button
              onClick={handleNext}
              disabled={
                loading ||
                (step === 1 &&
                  (!formData.email ||
                    !formData.password ||
                    (authMode === "signup" && !formData.name))) ||
                (step === 2 &&
                  (!formData.businessName || !formData.businessType)) ||
                (step === 3 && !formData.simulationGoal)
              }
              className="px-8 py-4 bg-white text-black font-bold text-sm hover:bg-white/90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  {step === 1 ? "Authenticating" : "Processing"}
                  <Loader2 className="w-4 h-4 animate-spin" />
                </>
              ) : step === 3 ? (
                <>
                  Start Simulation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              ) : (
                <>
                  {step === 1
                    ? authMode === "signup"
                      ? "Create Account"
                      : "Sign In"
                    : "Continue"}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
