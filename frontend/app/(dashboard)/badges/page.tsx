"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

// Dummy data lencana
const badges = [
    {
        id: 1,
        title: "Penjelajah Baru",
        description: "Daftar dan bergabung ke GreenHero untuk pertama kalinya.",
        icon: "/icons/badge.svg",
        earned: true,
    },
    {
        id: 2,
        title: "Jejak Awal",
        description: "Mengisi data kendaraan atau elektronik untuk pertama kali.",
        icon: "/icons/badge.svg",
        earned: true,
    },
    {
        id: 3,
        title: "Penyelesai Misi",
        description: "Menyelesaikan 1 misi harian di halaman misi.",
        icon: "/icons/badge.svg",
        earned: true,
    },
    {
        id: 4,
        title: "Kolektor Koin I",
        description: "Kumpulkan setidaknya 100 Koin dari aktivitas ramah lingkungan.",
        icon: "/icons/badge.svg",
        earned: false,
    },
    {
        id: 5,
        title: "Kolektor Koin II",
        description: "Kumpulkan setidaknya 200 Koin dari aktivitas ramah lingkungan.",
        icon: "/icons/badge.svg",
        earned: false,
    },
    {
        id: 6,
        title: "Kolektor Koin III",
        description: "Kumpulkan setidaknya 300 Koin dari aktivitas ramah lingkungan.",
        icon: "/icons/badge.svg",
        earned: false,
    },
    {
        id: 7,
        title: "Pelanggan Setia",
        description: "Tukarkan lencana ini untuk mendapatkan voucher atau produk minimal satu kali.",
        icon: "/icons/badge.svg",
        earned: false,
    },
]

export default function BadgesPage() {
    const earnedBadges = badges.filter((badge) => badge.earned)
    const lockedBadges = badges.filter((badge) => !badge.earned)

    const renderBadgeGrid = (list: typeof badges, isEarned: boolean) => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {list.map((badge) => (
                <Card
                    key={badge.id}
                    className={`transition ${isEarned ? "opacity-100" : "opacity-50 grayscale"
                        }`}
                >
                    <CardHeader className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 relative mb-2">
                            <Image
                                src={badge.icon}
                                alt={badge.title}
                                fill
                                className="object-contain"
                            />
                        </div>
                        <CardTitle className="text-lg">{badge.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-center text-muted-foreground">
                        {badge.description}
                    </CardContent>
                </Card>
            ))}
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-12">
            {/* Lencana yang Dimiliki */}
            <section>
                <h1 className="text-2xl font-bold mb-6">Lencana yang Dimiliki</h1>
                {earnedBadges.length > 0 ? (
                    renderBadgeGrid(earnedBadges, true)
                ) : (
                    <p className="text-muted-foreground">Belum ada lencana yang dimiliki.</p>
                )}
            </section>

            {/* Lencana yang Belum Dimiliki */}
            <section>
                <h1 className="text-2xl font-bold mb-6">Lencana yang Belum Dimiliki</h1>
                {lockedBadges.length > 0 ? (
                    renderBadgeGrid(lockedBadges, false)
                ) : (
                    <p className="text-muted-foreground">Semua lencana sudah didapatkan 🎉</p>
                )}
            </section>
        </div>
    )
}
