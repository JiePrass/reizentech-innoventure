"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";

const navItems = [
    { href: "/", label: "Beranda" },
    { href: "#about", label: "Tentang Kami" },
    { href: "#feature", label: "Layanan Kami" },
    { href: "#faq", label: "FAQ" },
];

export default function Header() {
    const pathname = usePathname();

    return (
        <header>
            <div className="flex container mx-auto items-center justify-between py-6">
                {/* Logo */}
                <Image
                    src="/icons/main-logo.svg"
                    alt="Logo"
                    width={200}
                    height={200}
                />

                {/* Navigation */}
                <nav className="flex items-center gap-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`transition-colors ${isActive
                                        ? "text-primary underline font-medium"
                                        : "text-muted-foreground hover:text-primary"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Button */}
                <Button className="rounded-full px-[24px] text-base" asChild>
                    <Link href="/dashboard">
                        Dashboard <ChevronRight />
                    </Link>
                </Button>
            </div>
        </header>
    );
}
