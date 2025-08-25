"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Search } from "lucide-react"

type Product = {
    id: number
    name: string
    description: string
    price_points: number
    stock: number
    status: string
    image_url: string
    created_at: string
}

type ApiResponse = {
    status: boolean
    message: string
    data: Product[]
}

export default function RewardStorePage() {
    const [search, setSearch] = useState("")
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    // pagination state
    const [page, setPage] = useState(1)
    const perPage = 8

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/store/items`)
                const data: ApiResponse = await res.json()
                if (data.status) {
                    setProducts(data.data)
                }
            } catch (error) {
                console.error("Gagal fetch data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    // search
    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    )

    // pagination logic
    const totalPages = Math.ceil(filteredProducts.length / perPage)
    const startIndex = (page - 1) * perPage
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + perPage)

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <h1 className="text-xl font-semibold">Toko Penukaran Poin</h1>
                <div className="relative max-w-sm">
                    <Input
                        placeholder="Cari Barang"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value)
                            setPage(1) // reset ke halaman 1 saat search
                        }}
                        className="pl-9"
                    />
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
            </div>

            {/* Loading State */}
            {loading && <p className="text-center text-muted-foreground">Memuat data...</p>}

            {/* Products Grid */}
            {!loading && paginatedProducts.length === 0 && (
                <p className="text-center text-muted-foreground">Tidak ada produk ditemukan</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden border-none shadow-none">
                        <div className="relative flex items-center justify-center hover:shadow-md transition aspect-square border border-gray-200 rounded-xl">
                            <Image
                                src={product.image_url}
                                alt={product.name}
                                width={150}
                                height={150}
                                className="object-contain"
                            />
                        </div>
                        <CardContent className="p-0">
                            <h3 className="text-lg font-medium">{product.name}</h3>
                            <div className="flex justify-between items-center">
                                <p className="text-sm text-muted-foreground">{product.description}</p>
                                <div className="flex gap-2 items-center">
                                    <p className="font-semibold">{product.price_points}</p>
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
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        Sebelumnya
                    </Button>

                    <div className="flex gap-2">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <Button
                                key={i}
                                variant={page === i + 1 ? "default" : "outline"}
                                size="sm"
                                onClick={() => setPage(i + 1)}
                            >
                                {i + 1}
                            </Button>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                        Selanjutnya
                    </Button>
                </div>
            )}
        </div>
    )
}
