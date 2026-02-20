"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { createClient } from "@/utils/supabase/client";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    isOnboarded,
    setUser,
    setBusiness,
    completeOnboarding,
    getUserOnboarding,
  } = useOnboardingStore();
  const [isChecked, setIsChecked] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        // If accessing dashboard
        if (pathname.startsWith("/dashboard")) {
          if (!authUser) {
            // Not logged in - redirect to onboarding
            router.replace("/onboarding");
          } else if (!isOnboarded) {
            // Logged in but not onboarded - redirect to onboarding
            router.replace("/onboarding");
          } else {
            // Logged in and onboarded - allow access
            setIsChecked(true);
          }
        } else {
          setIsChecked(true);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setIsChecked(true);
      }
    };

    checkAuth();
  }, [isOnboarded, pathname, router]);

  // Prevent flash of content while checking
  if (!isChecked) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
