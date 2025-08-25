"use client"

import { useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { UpdateElectricityTracker } from "@/helpers/UpdateElectricityTracker"
import { DeleteElectricityTracker } from "@/helpers/DeleteElectricityTracker"

type Device = {
  id: number
  device_name: string
  device_type: string
  power_watts: number
}

interface DeviceTableProps {
  devices: Device[]
  onUpdate: (device: Device) => void
  onDelete: (id: number) => void
}

export default function DeviceTable({ devices, onUpdate, onDelete }: DeviceTableProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)

  // Submit Edit
  const handleEdit = async () => {
    if (!selectedDevice) return
    try {
      const payload = {
        device_name: selectedDevice.name,
        power_watts: parseInt(selectedDevice.consumption),
        device_type: "default",
      }
      await UpdateElectricityTracker(selectedDevice.id, payload)
      onUpdate(selectedDevice)
      setEditOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  // Submit Delete
  const handleDelete = async () => {
    if (!selectedDevice) return
    try {
      await DeleteElectricityTracker(selectedDevice.id)
      onDelete(selectedDevice.id)
      setDeleteOpen(false)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]" />
            <TableHead>Perangkat</TableHead>
            <TableHead>Tipe</TableHead>
            <TableHead>Konsumsi (kWh)</TableHead>
            <TableHead className="w-[40px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.length > 0 ? devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell className="flex justify-center">
                <Checkbox aria-label={`Select ${device.name}`} />
              </TableCell>
              <TableCell>{device.device_name}</TableCell>
              <TableCell>{device.device_type}</TableCell>
              <TableCell>{device.power_watts}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded hover:bg-muted">
                      <IconDots size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedDevice(device)
                        setEditOpen(true)
                      }}
                    >
                      <IconPencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={() => {
                        setSelectedDevice(device)
                        setDeleteOpen(true)
                      }}
                    >
                      <IconTrash className="mr-2 h-4 w-4" /> Hapus
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Loading..
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Modal Edit */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-4">
              <Input
                value={selectedDevice.name}
                onChange={(e) => setSelectedDevice({ ...selectedDevice, name: e.target.value })}
                placeholder="Nama device"
              />
              <Input
                value={selectedDevice.consumption}
                onChange={(e) => setSelectedDevice({ ...selectedDevice, consumption: e.target.value })}
                placeholder="Konsumsi (kWh)"
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>Batal</Button>
            <Button onClick={handleEdit}>Simpan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Delete */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Device</DialogTitle>
          </DialogHeader>
          <p>Yakin ingin menghapus {selectedDevice?.name}?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Batal</Button>
            <Button variant="destructive" onClick={handleDelete}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
