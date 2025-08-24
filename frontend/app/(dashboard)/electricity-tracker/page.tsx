"use client"

import { useState } from "react"
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

// Dummy Device awal
const initialDevices = [
    {
        id: 1,
        date: "21/08/25",
        name: "KulKas",
        consumption: "21 kWh",
        emission: "1,79 kg CO₂e",
        status: "Aktif",
    },
    {
        id: 2,
        date: "21/08/25",
        name: "CRM Admin Pages",
        consumption: "21 kWh",
        emission: "1,79 kg CO₂e",
        status: "Aktif",
    },
    {
        id: 3,
        date: "21/08/25",
        name: "Client Pages",
        consumption: "21 kWh",
        emission: "1,79 kg CO₂e",
        status: "Tidak Aktif",
    },
    {
        id: 4,
        date: "20/08/25",
        name: "Admin Dashboard",
        consumption: "21 kWh",
        emission: "1,79 kg CO₂e",
        status: "Tidak Aktif",
    },
    {
        id: 5,
        date: "20/08/25",
        name: "App Landing Page",
        consumption: "21 kWh",
        emission: "1,79 kg CO₂e",
        status: "Aktif",
    },
]

export default function ElectrictyTracker() {
    const [devices, setDevices] = useState(initialDevices)
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState<"All" | "Aktif" | "Tidak Aktif">("All")
    const [sortAsc, setSortAsc] = useState(true)

    // State Modal
    const [open, setOpen] = useState(false)
    const [newDevice, setNewDevice] = useState({
        name: "",
        consumption: "",
        emission: "0 kg CO₂e",
        status: "Aktif",
    })

    // Handler Tambah Device
    const handleAdd = () => {
        if (!newDevice.name) return
        const device = {
            id: devices.length + 1,
            date: new Date().toLocaleDateString("id-ID"),
            ...newDevice,
        }
        setDevices([...devices, device])
        setNewDevice({ name: "", consumption: "", emission: "", status: "Aktif" })
        setOpen(false)
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
    const filteredDevices = devices
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
            <DeviceTable devices={filteredDevices} />

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
