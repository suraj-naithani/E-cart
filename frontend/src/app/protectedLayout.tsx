"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname(); 

    useEffect(() => {
        const token = localStorage.getItem("token");

        const protectedRoutes = ["/dashboard", "/profile", '/cart'];
        const publicRoutes = ["/signup", "/signin"];

        if (publicRoutes.includes(pathname) && token) {
            router.push("/"); 
        } else if (protectedRoutes.includes(pathname) && !token) {
            router.push("/signin");
        }
    }, [pathname, router]);

    return <>{children}</>;
}
