"use client"

import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IconCheck } from "@tabler/icons-react"

// Dummy data leaderboard
const leaderboard = [
    { id: 1, name: "John Lenon", avatar: "/images/profile.png", point: 34.54, missions: 14, totalPoint: 123 },
    { id: 2, name: "Jane Doe", avatar: "/images/profile.png", point: 32.12, missions: 14, totalPoint: 123 },
    { id: 3, name: "Michael Smith", avatar: "/images/profile.png", point: 30.45, missions: 14, totalPoint: 123 },
    { id: 4, name: "Sarah Johnson", avatar: "/images/profile.png", point: 28.76, missions: 14, totalPoint: 123 },
    { id: 5, name: "David Lee", avatar: "/images/profile.png", point: 27.89, missions: 14, totalPoint: 123 },
    { id: 6, name: "Emily Davis", avatar: "/images/profile.png", point: 26.32, missions: 14, totalPoint: 123 },
    { id: 7, name: "Chris Martin", avatar: "/images/profile.png", point: 25.67, missions: 14, totalPoint: 123 },
]

export default function LeaderboardPage() {
    const topThree = leaderboard.slice(0, 3)

    return (
        <div className="p-6 space-y-6">
            {/* Statistik di atas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="flex justify-center">
                    <CardContent>
                        <div className="flex w-full mb-3 justify-between">
                            <p className="text-4xl font-semibold">15 Misi</p>
                            <div className="bg-green-700 p-2 rounded-full aspect-square text-white">
                                <IconCheck size={32} />
                            </div>
                        </div>
                        <CardTitle className="font-normal">Misi Yang Terselesaikan</CardTitle>
                    </CardContent>
                </Card>
                <Card className="flex justify-center">
                    <CardContent>
                        <div className="flex w-full mb-3 justify-between">
                            <p className="text-4xl font-semibold">1234</p>
                            <div className="rounded-full aspect-square">
                                <Image src="/icons/green-point.svg" alt="point" width={52} height={52} />
                            </div>
                        </div>
                        <CardTitle className="font-normal">Poin Yang Didapatkan</CardTitle>
                    </CardContent>
                </Card>
                <Card className="flex col-span-2 justify-center">
                    <CardContent className="flex justify-between items-center">
                        <div className="space-y-6">
                            <CardTitle className="text-4xl">Papan Peringkat</CardTitle>
                            <p>Peringkat Selama Agustus 2025</p>
                        </div>
                        <Image src="/icons/trophy.svg" alt="point" width={80} height={80} />
                    </CardContent>
                </Card>
            </div>

            {/* Top 3 Leaderboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topThree.map((user, index) => (
                    <Card key={user.id} className={index === 0 ? "border-yellow-400 border-2" : ""}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Image
                                src={user.avatar}
                                alt={user.name}
                                width={48}
                                height={48}
                                className="rounded-full"
                            />
                            <CardTitle className="text-2xl">{user.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between">
                            <div className="flex flex-col">
                                <p>Poin Didapatkan</p>
                                <p className="text-2xl font-bold">{user.point}</p>
                            </div>
                            <div className="flex flex-col">
                                <p>Misi Terselesaikan</p>
                                <p className="text-2xl font-bold">{user.point}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Tabel Ranking Lainnya */}
            <Card>
                <CardHeader>
                    <CardTitle>Daftar Peringkat Lainnya</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Poin Yang Didapatkan</TableHead>
                                <TableHead>Misi Yang Terselesaikan</TableHead>
                                <TableHead>Total Poin Peringkat</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboard.map((user, idx) => (
                                <TableRow key={user.id}>
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        {user.name}
                                    </TableCell>
                                    <TableCell>{user.point}</TableCell>
                                    <TableCell>{user.missions}</TableCell>
                                    <TableCell className="text-primary font-semibold">{user.totalPoint}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
