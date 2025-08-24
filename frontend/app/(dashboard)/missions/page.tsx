"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const missions = [
    {
        id: 1,
        category: "Produktifitas",
        points: 125,
        title: "Lakukan Sekarang",
        description: "Login ke aplikasi selama 5 hari berturut-turut.",
        progress: 100,
    },
    {
        id: 2,
        category: "Produktifitas",
        points: 125,
        title: "Aksi Harian",
        description: "Aktifkan aplikasi setiap hari selama 5 hari penuh.",
        progress: 100,
    },
    {
        id: 3,
        category: "Produktifitas",
        points: 125,
        title: "Misi Hijau",
        description: "Konsisten menggunakan aplikasi selama 5 hari.",
        progress: 100,
    },
    {
        id: 4,
        category: "Produktifitas",
        points: 125,
        title: "Ambisi Membara",
        description: "Masuk aplikasi selama 5 hari berturut-turut.",
        progress: 100,
    },
    {
        id: 5,
        category: "Produktifitas",
        points: 125,
        title: "Cek Dashboard",
        description: "Lihat dashboard GreenFlow setidaknya 5 kali.",
        progress: 60,
    },
    {
        id: 6,
        category: "Produktifitas",
        points: 125,
        title: "Lengkapi Profil",
        description: "Selesaikan pengisian data profil pada aplikasi.",
        progress: 100,
    },
    {
        id: 7,
        category: "Produktifitas",
        points: 125,
        title: "Kendaraan Umum",
        description: "Lihat penggunaan kendaraan umum selama 5 hari.",
        progress: 20,
    },
    {
        id: 8,
        category: "Produktifitas",
        points: 125,
        title: "Cek Carbon Tracker",
        description: "Pantau data carbon tracker minimal 5 kali.",
        progress: 40,
    },
    {
        id: 9,
        category: "Produktifitas",
        points: 125,
        title: "Minggu Produktif",
        description: "Login rutin selama 7 hari berturut-turut.",
        progress: 80,
    },
    {
        id: 10,
        category: "Produktifitas",
        points: 125,
        title: "Kolektor Koin",
        description: "Kumpulkan koin dari aktivitas aplikasi selama 5 hari.",
        progress: 50,
    },
]

export default function MissionPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="grid lg:grid-cols-6">

                {/* Header Section */}
                <div className="flex flex-col lg:col-span-4 md:flex-row items-center justify-between bg-card p-6 rounded-2xl shadow-sm">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            Selesaikan Misi Rutin Anda
                        </h1>
                        <p className="text-muted-foreground max-w-sm">
                            Anda telah berkontribusi mengurangi emisi karbon sebesar{" "}
                            <span className="font-medium">34,54 kg CO₂e</span> bulan ini!
                        </p>
                    </div>
                    <Image
                        src="/icons/alarm.svg"
                        alt="Alarm Icon"
                        width={100}
                        height={100}
                    />
                </div>

                {/* Summary Section */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Misi Harian Selesai</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">15 <span className="text-base font-normal">Selesai</span></p>
                        <p className="text-sm text-muted-foreground">Terselesaikan</p>
                    </CardContent>
                </Card>
            </div>

            {/* Missions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {missions.map((mission) => (
                    <Card key={mission.id} className="flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <Badge variant="secondary">{mission.category}</Badge>
                            <Badge variant="secondary">
                                <Image
                                    src="/icons/green-point.svg"
                                    alt="Alarm Icon"
                                    width={12}
                                    height={12}
                                />
                                <span className="text-xs font-medium">{mission.points} Poin</span>
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <h3 className="font-semibold">{mission.title}</h3>
                            <p className="text-sm text-muted-foreground">{mission.description}</p>
                            <Progress value={mission.progress} />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
