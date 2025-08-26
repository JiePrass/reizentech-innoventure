"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { IconPencil, IconTrendingUp } from "@tabler/icons-react"
import Image from "next/image"

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
]

export default function Profile() {
    const [open, setOpen] = useState(false)
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("authtoken")
                if (!token) {
                    console.error("Token tidak ditemukan")
                    return
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/custom/my-data`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                const data = await res.json()
                if (data.status) {
                    setProfile(data.data)
                } else {
                    console.error("Gagal ambil profil:", data.message)
                }
            } catch (err) {
                console.error("Error fetch profil:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [])


    if (loading) return <p className="p-6">Loading...</p>

    return (
        <div className="p-6 space-y-6">
            <Card className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={profile?.user?.avatar_url || "/avatar.png"} alt="Avatar" />
                        <AvatarFallback>{profile?.user?.full_name.slice(0, 2).toUpperCase() || "NA"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-lg font-semibold">{profile?.user?.FullName || profile?.user.username}</h2>
                        <p className="text-sm text-muted-foreground">{profile?.Email}</p>
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
                            <Input id="name" defaultValue={profile?.profile?.FullName || profile?.Username} />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" defaultValue={profile?.Email} />
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

            {/* Statistik + badge section tetap sama */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex gap-4 mb-2">
                        <CardTitle className="font-normal text-sm">Total Karbon Yang Dihasilkan</CardTitle>
                        <Badge variant="outline" className="mt-2">
                            <IconTrendingUp className="w-4 h-4 mr-1" /> +11.0%
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-[28px] font-semibold text-black mb-2">
                            34,54 kg CO₂e
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-muted-foreground">Kenaikan Bulan Ini</p>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className="flex gap-4 mb-2">
                        <CardTitle className="font-normal text-sm">Total Misi Yang Diselesaikan</CardTitle>
                        <Badge variant="outline" className="mt-2">
                            <IconTrendingUp className="w-4 h-4 mr-1" /> +11.0%
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-[28px] font-semibold text-black mb-2">
                            0 Misi
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-muted-foreground">Kenaikan Bulan Ini</p>
                    </CardFooter>
                </Card>
            </div>

            <div className="rounded-xl shadow border p-6">
                <h1 className="text-2xl font-bold mb-6">Lencana yang Belum Dimiliki</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {badges.map((badge) => (
                        <Card key={badge.id}>
                            <CardHeader className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 relative mb-2">
                                    <Image src={badge.icon} alt={badge.title} fill className="object-contain" />
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
