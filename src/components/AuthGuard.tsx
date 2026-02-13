"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useOnboardingStore } from "@/store/useOnboardingStore";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isOnboarded } = useOnboardingStore();
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    // If we are on the dashboard and not onboarded, redirect to onboarding
    if (!isOnboarded && pathname.startsWith("/dashboard")) {
      router.replace("/onboarding");
    } else {
      setIsChecked(true);
    }
  }, [isOnboarded, pathname, router]);

  // Prevent flash of content while checking
  if (!isChecked && !isOnboarded) {
    return (
        <div className="h-screen w-screen bg-black flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
    );
  }

  return <>{children}</>;
}
