"use client";

import { app } from "@/config/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({ children }) {
  const auth = getAuth(app);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
       
        router.push("/dashboard");
      } else {
        if (pathname == "/dashboard") {
          router.replace("/login");
        } else if(pathname == "/")
            router.replace("/login");
       
      }
    });
  }, []);

  return children;
}
