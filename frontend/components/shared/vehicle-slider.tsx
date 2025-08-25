"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

type Vehicle = {
    id: number
    title: string
    type: "pribadi" | "umum"
    image: string
    total: string
    percentage: string
    active: boolean
}

const kendaraanPribadi: Vehicle[] = [
    {
        id: 1,
        title: "Sepeda Motor 1",
        type: "pribadi",
        image: "/icons/motor.svg",
        total: "9,82 kg CO₂e",
        percentage: "5,63%",
        active: true,
    },
    {
        id: 2,
        title: "Mobil Pribadi 1",
        type: "pribadi",
        image: "/icons/motor.svg",
        total: "0 kg CO₂e",
        percentage: "6,35%",
        active: false,
    },
    {
        id: 3,
        title: "Mobil Pribadi 2",
        type: "pribadi",
        image: "/icons/motor.svg",
        total: "0 kg CO₂e",
        percentage: "0%",
        active: false,
    },
]

export default function VehicleSlider() {
    const [vehicles] = useState<Vehicle[]>(kendaraanPribadi)

    return (
        <section className="space-y-6">
            <h2 className="text-xl font-semibold">Kendaraan Pribadi</h2>

            {/* 👉 Parent fixed width & overflow hidden */}
            <div className="w-full overflow-hidden">
                <ScrollArea className="max-w-[166vh] whitespace-nowrap">
                    <div className="flex gap-4 pb-4">
                        {vehicles.map((v) => (
                            <Card key={v.id} className="w-64 flex-shrink-0">
                                <CardHeader className="flex flex-col items-center justify-center">
                                    <Image
                                        src={v.image}
                                        alt={v.title}
                                        width={80}
                                        height={80}
                                        className="aspect-square rounded-full p-1 object-contain bg-[#ECECEC]"
                                    />
                                    <CardTitle className="mt-2 text-center">{v.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="text-center space-y-2">
                                    <p className="text-sm text-muted-foreground">
                                        Total Karbon <br /> {v.title}
                                    </p>
                                    <p className="text-lg font-semibold">{v.total}</p>
                                    <p className="text-xs text-gray-500">{v.percentage}</p>
                                    <Button
                                        variant={v.active ? "destructive" : "outline"}
                                        className="w-full"
                                    >
                                        {v.active ? "Matikan Kendaraan" : "Aktifkan Kendaraan"}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}

                        {/* Tambahkan Kendaraan */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <Card className="w-64 flex-shrink-0 flex items-center justify-center cursor-pointer hover:bg-muted">
                                    <CardContent className="text-center p-6">
                                        <p className="text-4xl">＋</p>
                                        <p className="mt-2 text-sm">Tambahkan Kendaraan Anda</p>
                                    </CardContent>
                                </Card>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tambah Kendaraan Baru</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Nama Kendaraan"
                                        className="w-full border rounded-md p-2"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Total Karbon (kg CO₂e)"
                                        className="w-full border rounded-md p-2"
                                    />
                                    <Button className="w-full">Simpan</Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </section>
    )
}
