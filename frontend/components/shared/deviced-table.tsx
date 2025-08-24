"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react"

type Device = {
    id: number
    date: string
    name: string
    consumption: string
    emission: string
    status: string
}

interface DeviceTableProps {
    devices: Device[]
}

export default function DeviceTable({ devices }: DeviceTableProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40px]" />
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Perangkat</TableHead>
                        <TableHead>Konsumsi (kWh)</TableHead>
                        <TableHead>Emisi CO₂e</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[40px]" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {devices.map((device) => (
                        <TableRow key={device.id}>
                            <TableCell className="flex justify-center">
                                <Checkbox aria-label={`Select ${device.name}`} />
                            </TableCell>
                            <TableCell>{device.date}</TableCell>
                            <TableCell>{device.name}</TableCell>
                            <TableCell>{device.consumption}</TableCell>
                            <TableCell>{device.emission}</TableCell>
                            <TableCell>
                                <Badge
                                    className={
                                        device.status === "Aktif"
                                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                            : "bg-red-100 text-red-700 hover:bg-red-200"
                                    }
                                >
                                    {device.status}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-1 rounded hover:bg-muted">
                                            <IconDots size={18} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <IconPencil className="mr-2 h-4 w-4" /> Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                                            <IconTrash className="mr-2 h-4 w-4" /> Hapus
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
