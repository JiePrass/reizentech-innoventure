"use client"

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
import { GetVehicleTracker } from "@/helpers/GetVehicleTracker"
import VehicleSliderPublic from "@/components/shared/vehicle-slider-public"

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


export default function VehicleTracker() {
    
    const [location, setLocation] = useState<{lat: number, lng: number} | null>(null)
    const [error, setError] = useState<string | null>(null)
    
    const getLocation = () => {
        if (!navigator.geolocation) {
        setError("Geolocation tidak didukung oleh browser ini.")
        return
        }

        navigator.geolocation.getCurrentPosition(
        (position) => {
            setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            })
            setError(null)
        },
        (err) => {
            setError("Gagal mendapatkan lokasi: " + err.message)
        },
        {
            enableHighAccuracy: true, // lebih akurat (GPS, tapi lebih lama & boros baterai)
            timeout: 10000, // max tunggu 10 detik
            maximumAge: 0, // selalu ambil posisi terbaru
        }
        )
    }

    const { data: vehicle } = GetVehicleTracker()

    console.log(vehicle)

    return (
        <div className="p-6 space-y-6 overflow-x-hidden">
             <div className="p-4">
                <button 
                    onClick={getLocation} 
                    className="px-4 py-2 bg-green-600 text-white rounded"
                >
                    Aktifkan GPS
                </button>

                {location && (
                    <p className="mt-2">
                    Latitude: {location.lat}, Longitude: {location.lng}
                    </p>
                )}

                {error && <p className="mt-2 text-red-500">{error}</p>}
            </div>
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
            <VehicleSliderPublic />


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
