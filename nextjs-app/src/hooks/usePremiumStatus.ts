import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export function usePremiumStatus() {
  const { data: session } = useSession();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      setLoading(true);
      // Fetch subscription status
      fetch("/api/user/subscription")
        .then((res) => res.json())
        .then((data) => {
          setIsPremium(data.hasActiveSubscription);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching subscription status:", err);
          setIsPremium(false);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [session]);

  return { isPremium, loading };
}
