"use client"
/* eslint-disable */
import { useEffect, useState } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { SectionCards } from "@/components/shared/section-cards"
import DeviceTable from "@/components/shared/deviced-table"
import { IconArrowsSort, IconFilterFilled, IconPlus, IconSearch } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { GetElectricityDevice } from "@/helpers/GetElectricityDevice"
import { AddElectricityDevice } from "@/helpers/AddElectricityDevice"
import { useAuthMe } from "@/helpers/AuthMe"

type DeviceTypes = {
    id: number
    device_name: string
    device_type: string
    power_watts: number
};

export default function ElectrictyTracker() {
    const { data: dataMe } = useAuthMe()
    const { data: dataElectricty } = GetElectricityDevice()
    const [devices, setDevices] = useState<DeviceTypes[]>([])
    useEffect(() => {
        if (dataElectricty && dataElectricty?.data && dataElectricty?.data?.length > 0) {
            const initialDevices = dataElectricty?.data?.map((d) => ({
                id: d.id,
                device_name: d.device_name,
                device_type: d.device_type,
                power_watts: d.power_watts,
            }));
            setDevices(initialDevices ?? [])
            console.log(initialDevices)
        }
    }, [dataElectricty?.data])
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState<"All" | "Aktif" | "Tidak Aktif">("All")
    const [sortAsc, setSortAsc] = useState(true)


    // State Modal
    const [open, setOpen] = useState(false)
    const [newDevice, setNewDevice] = useState({
        name: "",
        consumption: "",
        type: "",
        status: "Aktif",
    })

    // Handler Tambah Device
    const handleAdd = async () => {
        if (!newDevice.name) return
        const device = {
            id: devices.length + 1,
            date: new Date().toLocaleDateString("id-ID"),
            emission: `${(parseInt(newDevice.consumption) * 0.0275).toFixed(2)} kg CO₂e`,
            ...newDevice,
        }
        try {
            const result = await AddElectricityDevice({
                device_name: newDevice.name,
                power_watts: parseInt(newDevice.consumption),
                device_type: newDevice.type,
                user_id: dataMe?.data?.ID ? parseInt(dataMe.data.ID) : null
            });

            console.log(result);
            setDevices([...devices, device])
            setNewDevice({ name: "", type: '', consumption: "", status: "Aktif" })
            setOpen(false)
        } catch {
            setOpen(false)
            console.error('error while adding')
        }
    }


    // Handler Filter
    const handleFilter = () => {
        setFilter((prev) =>
            prev === "All" ? "Aktif" : prev === "Aktif" ? "Tidak Aktif" : "All"
        )
    }

    // Handler Sort
    const handleSort = () => {
        setSortAsc(!sortAsc)
    }

    // Apply search, filter, sort
    const filteredDevices = devices!
        .filter((d) =>
            d.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((d) =>
            filter === "All" ? true : d.status === filter
        )
        .sort((a, b) => {
            if (sortAsc) {
                return a.date.localeCompare(b.date)
            } else {
                return b.date.localeCompare(a.date)
            }
        })


    const [trendData, setTrendData] = useState<{ name: string; value: number }[]>([])

    useEffect(() => {
        if (dataElectricty?.data && dataElectricty?.data?.length > 0) {
            // group by tanggal
            const grouped: Record<string, number> = {}

            dataElectricty.data.forEach((d: any) => {
                const date = d.created_at.split("T")[0]
                const consumption = d.power_watts
                grouped[date] = (grouped[date] || 0) + consumption
            })

            const chartData = Object.entries(grouped).map(([date, total]) => ({
                name: date, // jadi label sumbu X
                value: total, // total kWh
            }))

            setTrendData(chartData)
        }
    }, [dataElectricty?.data])
    return (
        <div className="p-6 space-y-6">
            {/* Statistik Cards */}
            <SectionCards />

            {/* Action Bar */}
            <div className="flex justify-between items-center bg-gray-100 px-6 py-3 rounded-md w-full overflow-x-auto">
                <h2 className="font-semibold text-lg whitespace-nowrap">Daftar Alat Elektronik</h2>
                <div className="flex gap-4 items-center">
                    {/* Utils */}
                    <div className="flex">
                        {/* Modal Add Device */}
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="ghost">
                                    <IconPlus />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Tambah Device Baru</DialogTitle>
                                    <DialogDescription>
                                        Isi detail perangkat untuk menambahkannya ke daftar.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Nama Device</Label>
                                        <Input
                                            value={newDevice.name}
                                            onChange={(e) =>
                                                setNewDevice({ ...newDevice, name: e.target.value })
                                            }
                                            placeholder="Contoh: AC Ruang Tamu"
                                        />
                                    </div>
                                    <div>
                                        <Label>Tipe Device</Label>
                                        <Input
                                            value={newDevice.type}
                                            onChange={(e) =>
                                                setNewDevice({ ...newDevice, type: e.target.value })
                                            }
                                            placeholder="Contoh: laptop"
                                        />
                                    </div>
                                    <div>
                                        <Label>Konsumsi</Label>
                                        <Input
                                            value={newDevice.consumption}
                                            onChange={(e) =>
                                                setNewDevice({ ...newDevice, consumption: e.target.value })
                                            }
                                            placeholder="Contoh: 20 kWh"
                                        />
                                    </div>
                                    <div>
                                        <Label>Status</Label>
                                        <select
                                            className="border rounded px-2 py-1 w-full"
                                            value={newDevice.status}
                                            onChange={(e) =>
                                                setNewDevice({ ...newDevice, status: e.target.value })
                                            }
                                        >
                                            <option value="Aktif">Aktif</option>
                                            <option value="Tidak Aktif">Tidak Aktif</option>
                                        </select>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setOpen(false)}>
                                        Batal
                                    </Button>
                                    <Button onClick={handleAdd}>Tambah</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Button size="icon" variant="ghost" onClick={handleFilter}>
                            <IconFilterFilled />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={handleSort}>
                            <IconArrowsSort />
                        </Button>
                    </div>

                    {/* SearchBar */}
                    <div className="w-64 relative">
                        <div className="absolute left-2 -translate-y-1/2 top-1/2 opacity-60">
                            <IconSearch />
                        </div>
                        <Input
                            className="bg-gray-50 pl-10"
                            placeholder="Cari perangkat..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Tabel */}
            <DeviceTable devices={filteredDevices}
                onUpdate={(updated) => {
                    setDevices(devices.map(d => d.id === updated.id ? updated : d))
                }}
                onDelete={(id) => {
                    setDevices(devices.filter(d => d.id !== id))
                }}
            />

            {/* Grafik Tren */}
            <Card>
                <CardHeader>
                    <CardTitle>Tren Konsumsi Listrik & Karbon</CardTitle>
                    <CardDescription>Berdasarkan Total Konsumsi kWh</CardDescription>
                </CardHeader>
                <CardFooter>
                    <div className="w-full overflow-x-auto">
                        <div className="h-64 min-w-[600px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `${value} kWh`} />
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
