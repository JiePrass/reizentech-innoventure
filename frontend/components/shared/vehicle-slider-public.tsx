"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { PostVehicleTracker } from "@/helpers/PostVehicleTracker"
import { useAuthMe } from "@/helpers/AuthMe"
import { GetVehicleTracker } from "@/helpers/GetVehicleTracker"

type Vehicle = {
  id: number
  title: string
  type: "car" | "motorcycle" | "public_transport" | "walk"
  image: string
  total: string
  percentage: string
  active: boolean
}

const kendaraanPribadi: Vehicle[] = [
  {
    id: 1,
    title: "Sepeda Motor 1",
    type: "car",
    image: "/icons/motor.svg",
    total: "9,82 kg CO₂e",
    percentage: "5,63%",
    active: true,
  },
  {
    id: 2,
    title: "Mobil Pribadi 1",
    type: "car",
    image: "/icons/motor.svg",
    total: "0 kg CO₂e",
    percentage: "6,35%",
    active: false,
  },
]

export default function VehicleSliderPublic() {
  const { data: dataMe } = useAuthMe()
  const [vehicles, setVehicles] = useState<Vehicle[]>(kendaraanPribadi)
  const { data: vehicle } = GetVehicleTracker()

  console.log(vehicle)

  
  useEffect(() => {
        if (vehicle && vehicle?.data && vehicle?.data?.length > 0 ) {
            const initialDevices = vehicle?.data?.filter((item) => item.vehicle_type === 'public_transport').map((d) => ({
                id: d.id,
                date: d.created_at.split("T")[0],
                title: d.name,
                image: "/icons/motor.svg",
                type: d.type,
                percentage: "0%",
                total: "0 kg CO₂e",
                active: false
            }));
            setVehicles(initialDevices ?? [])
            console.log(vehicle.data)
        }
    } , [vehicle?.data])
  const [open, setOpen] = useState(false)

  // state form
  const [newVehicle, setNewVehicle] = useState({
    name: "",
    vehicle_type: "car",
    fuel_type: "petrol",
  })

  // handle tambah kendaraan
  const handleAddVehicle = async () => {
    if (!newVehicle.name) return

    try {
      console.log(newVehicle)
      const res = await PostVehicleTracker({
        user_id: dataMe?.data?.ID ? parseInt(dataMe.data.ID) : null,
        ...newVehicle,
      })

      if (res) {
        const newData: Vehicle = {
          id: vehicles.length + 1,
          title: newVehicle.name,
          type: newVehicle.vehicle_type as "car" | "motorcycle" | "public_transport" | "walk",
          image: "/icons/motor.svg",
          total: `0 kg CO₂e`,
          percentage: "0%", // bisa dihitung dari total semua kalau mau
          active: true,
        }
        setVehicles([...vehicles, newData])
        setNewVehicle({ name: "", vehicle_type: "pribadi", fuel_type: "bensin" })
        setOpen(false)
      } else {
        console.error("Gagal menambahkan kendaraan:", res)
      }
    } catch (err) {
      console.error("Error add vehicle:", err)
    }
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Kendaraan Umum</h2>

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
                  <Button variant={v.active ? "destructive" : "outline"} className="w-full">
                    {v.active ? "Matikan Kendaraan" : "Aktifkan Kendaraan"}
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Tambah Kendaraan */}
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Card className="w-64 flex-shrink-0 flex items-center justify-center cursor-pointer hover:bg-muted">
                  <CardContent className="text-center p-6">
                    <p className="text-4xl">+</p>
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
                    value={newVehicle.name}
                    onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                    className="w-full border rounded-md p-2"
                  />
                  <select
                    className="w-full border rounded-md p-2"
                    value={newVehicle.vehicle_type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_type: e.target.value })}
                  >
                    <option value="car">Car</option>
                    <option value="motorcycle">Motorcycle</option>
                    <option value="bicycle">Bicycle</option>
                    <option value="public_transport">Public Transport</option>
                    <option value="walk">Walk</option>
                  </select>
                  <select
                    className="w-full border rounded-md p-2"
                    value={newVehicle.fuel_type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, fuel_type: e.target.value })}
                  >
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="none">None</option>
                  </select>
                  <Button className="w-full" onClick={handleAddVehicle}>
                    Simpan
                  </Button>
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
