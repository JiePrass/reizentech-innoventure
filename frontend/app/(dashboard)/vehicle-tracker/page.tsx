"use client"

import Image from "next/image"
import { useState } from "react"
import VehicleSlider from "@/components/shared/vehicle-slider"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
    CardContent,
} from "@/components/ui/card"
import { IconTrendingUp } from "@tabler/icons-react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { GetVehicleTracker } from "@/helpers/GetVehicleTracker"

// Dummy data grafik
const data = [
    { name: "1k", value: 20 },
    { name: "5k", value: 64 },
    { name: "10k", value: 45 },
    { name: "20k", value: 78 },
    { name: "30k", value: 35 },
    { name: "40k", value: 60 },
    { name: "50k", value: 70 },
]

type Vehicle = {
    id: number
    title: string
    type: "pribadi" | "umum"
    image: string
    total: string
    percentage: string
    active: boolean
}

const kendaraanUmum: Vehicle[] = [
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
    {
        id: 4,
        title: "Mobil Pribadi 2",
        type: "pribadi",
        image: "/icons/motor.svg",
        total: "0 kg CO₂e",
        percentage: "0%",
        active: false,
    },
]

export default function VehicleTracker() {
    const [vehicles] = useState<Vehicle[]>(kendaraanUmum)
    
    const { data: vehicle } = GetVehicleTracker()

    console.log(vehicle)

    return (
        <div className="p-6 space-y-6 overflow-x-hidden">

            {/* Statistik Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="gap-0">
                    <CardHeader className="flex gap-4 mb-2">
                        <CardTitle className="font-normal text-sm">Total Karbon Yang Dihasilkan</CardTitle>
                        <Badge variant="outline" className="mt-2">
                            <IconTrendingUp className="w-4 h-4 mr-1" /> +11.0%
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <CardDescription className="text-[28px] whitespace-nowrap font-semibold text-black mb-4">
                            124 kg CO₂e
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
                        <CardDescription className="text-[28px] whitespace-nowrap font-semibold text-black mb-4">
                            124 kg CO₂e
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
                        <CardDescription className="text-[28px] whitespace-nowrap font-semibold text-black mb-4">
                            124 kg CO₂e
                        </CardDescription>
                    </CardContent>
                    <CardFooter>
                        <p className="text-sm text-muted-foreground">Kenaikan Bulan Ini</p>
                    </CardFooter>
                </Card>
            </div>

            <VehicleSlider />

            <div className="flex flex-col space-y-6">
                <h2 className="text-xl font-semibold">Kendaraan Pribadi</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {vehicles.map((v) => (
                        <Card key={v.id}>
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
                </div>
            </div>

            {/* Grafik Tren */}
            <Card>
                <CardHeader>
                    <CardTitle>Tren Pengurangan Karbon Bulanan</CardTitle>
                    <CardDescription>Oktober</CardDescription>
                </CardHeader>
                <CardFooter>
                    <div className="w-full overflow-x-auto">
                        <div className="h-64 min-w-[600px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="value" stroke="#16a34a" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
