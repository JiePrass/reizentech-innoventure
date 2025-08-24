'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconPencil, IconTrendingUp } from "@tabler/icons-react"
import Image from "next/image"
import { useState } from "react"

const badges = [
    {
        id: 1,
        title: "Penjelajah Baru",
        description: "Daftar dan bergabung ke GreenHero untuk pertama kalinya.",
        icon: "/icons/badge.svg",
    },
    {
        id: 2,
        title: "Jejak Awal",
        description: "Mengisi data kendaraan atau elektronik untuk pertama kali.",
        icon: "/icons/badge.svg",
    },
    {
        id: 3,
        title: "Penyelesai Misi",
        description: "Menyelesaikan 1 misi harian di halaman misi.",
        icon: "/icons/badge.svg",
    },
    {
        id: 4,
        title: "Kolektor Koin I",
        description: "Kumpulkan setidaknya 100 Koin dari aktivitas ramah lingkungan.",
        icon: "/icons/badge.svg",
    },
]

export default function Profile() {
    const [open, setOpen] = useState(false)

    return (
        <div className="p-6 space-y-6">
            <Card className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="/avatar.png" alt="Avatar" />
                        <AvatarFallback>AT</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-lg font-semibold">Abdul Terizla</h2>
                        <p className="text-sm text-muted-foreground">abdulterizla@gmail.com</p>
                        <div className="flex gap-2 mt-2">
                            <span className="px-3 py-1 text-xs rounded-full border">Peringkat 22</span>
                            <span className="px-3 py-1 text-xs rounded-full border">Streak 12 Hari</span>
                        </div>
                    </div>
                </div>

                <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                    Edit data <IconPencil className="ml-2 h-4 w-4" />
                </Button>
            </Card>

            {/* Modal Edit */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Data Profil</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nama</Label>
                            <Input id="name" defaultValue="Abdul Terizla" />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" defaultValue="abdulterizla@gmail.com" />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Batal
                        </Button>
                        <Button onClick={() => setOpen(false)}>Simpan</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="gap-0">
                    <CardHeader className="flex gap-4 mb-2">
                        <CardTitle className="font-normal text-sm">Total Karbon Yang Dihasilkan</CardTitle>
                        <Badge variant="outline" className="mt-2">
                            <IconTrendingUp className="w-4 h-4 mr-1" /> +11.0%
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-[28px] whitespace-nowrap font-semibold text-black mb-2">
                            34,54 kg CO₂e
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-muted-foreground">Kenaikan Bulan Ini</p>
                    </CardFooter>
                </Card>
                <Card className="gap-0">
                    <CardHeader className="flex gap-4 mb-2">
                        <CardTitle className="font-normal text-sm">Total Karbon Yang Dihasilkan</CardTitle>
                        <Badge variant="outline" className="mt-2">
                            <IconTrendingUp className="w-4 h-4 mr-1" /> +11.0%
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-[28px] whitespace-nowrap font-semibold text-black mb-2">
                            34,54 kg CO₂e
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-muted-foreground">Kenaikan Bulan Ini</p>
                    </CardFooter>
                </Card>
                <Card className="gap-0">
                    <CardHeader className="flex gap-4 mb-2">
                        <CardTitle className="font-normal text-sm">Total Lencana Yang Diperoleh</CardTitle>
                        <Badge variant="outline" className="mt-2">
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-[28px] whitespace-nowrap font-semibold text-black mb-2">
                            6 Lencana
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-muted-foreground">Didapatkan</p>
                    </CardFooter>
                </Card>
                <Card className="gap-0">
                    <CardHeader className="flex gap-4 mb-2">
                        <CardTitle className="font-normal text-sm">Total Misi Yang Diselesaikan</CardTitle>
                        <Badge variant="outline" className="mt-2">
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-[28px] whitespace-nowrap font-semibold text-black mb-2">
                            15 Misi
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-muted-foreground">Terselesaikan</p>
                    </CardFooter>
                </Card>
            </div>

            <div className="rounded-xl shadow border-[#c7c7c7] border p-6">
                <h1 className="text-2xl font-bold mb-6">Lencana yang Belum Dimiliki</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {badges.map((badge) => (
                        <Card key={badge.id}>
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
            </div>
        </div>
    )
}