"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { Search } from "lucide-react"

const products = [
    {
        id: 1,
        name: "Totebag Daur Ulang",
        vendor: "EcoBag Studio",
        points: 345,
        image: "/images/tumbler.png",
    },
    {
        id: 2,
        name: "Tumbler Daur Ulang",
        vendor: "EcoBag Studio",
        points: 345,
        image: "/images/tumbler.png",
    },
    {
        id: 3,
        name: "Dompet Daur Ulang",
        vendor: "EcoBag Studio",
        points: 345,
        image: "/images/tumbler.png",
    },
    {
        id: 4,
        name: "Buku Catatan Eco",
        vendor: "EcoBag Studio",
        points: 345,
        image: "/images/tumbler.png",
    },
    {
        id: 5,
        name: "Tempat Pensil Multiguna",
        vendor: "EcoBag Studio",
        points: 345,
        image: "/images/tumbler.png",
    },
]

export default function RewardStorePage() {
    const [search, setSearch] = useState("")

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-xl font-semibold">Toko Penukaran Poin</h1>
                <div className="relative max-w-sm">
                    <Input
                        placeholder="Cari Barang"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden border-none shadow-none">
                        <div className="relative flex items-center justify-center hover:shadow-md transition aspect-square border border-gray-200 rounded-xl">
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={150}
                                height={150}
                                className="object-contain"
                            />
                        </div>
                        <CardContent className="p-0">
                            <h3 className="text-lg font-medium">{product.name}</h3>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">{product.vendor}</p>
                                <div className="flex gap-2 items-center">
                                    <p className="font-semibold">{product.points}</p>
                                    <Image
                                        src="/icons/green-point.svg"
                                        alt="Green Point"
                                        width={16}
                                        height={16}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4">
                <Button variant="outline" size="sm">Sebelumnya</Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm">1</Button>
                    <Button size="sm" className="bg-primary text-white">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                </div>
                <Button variant="outline" size="sm">Selanjutnya</Button>
            </div>
        </div>
    )
}
