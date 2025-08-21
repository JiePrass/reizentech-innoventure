import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function HeroSection() {
    return (
        <section className="relative flex items-center justify-center w-full overflow-hidden rounded-2xl">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/images/hero-bg.png')", // ganti dengan gambar kamu
                }}
            />

            {/* Konten */}
            <div className="relative z-10 max-w-2xl text-center text-white px-4 py-24 pb-48">
                <Badge
                    variant="outline"
                    className="mb-4 bg-white/10 text-white backdrop-blur-sm border-white/30 px-4 py-2 font-light text-base"
                >
                    <Image src="/icons/stars.svg" alt="stars" width={24} height={24} className="inline-block mr-2" />
                    Selamat Datang Di GreenFlow
                </Badge>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Mulai Hidup Sejahtera dan Sehat Bersama GreenFlow
                </h1>

                <p className="text-lg md:text-xl text-gray-200 mb-6">
                    Bergabunglah bersama kami untuk mengurangi jejak karbon dan buat Indonesia lebih hijau.
                </p>

                <div className="flex items-center justify-center gap-4">
                    <Button className="bg-white text-black hover:bg-gray-200" asChild>
                        <Link href="/dashboard">
                            Masuk Dashboard <ChevronRight />
                        </Link>
                    </Button>
                    <Button variant="link" className="text-white underline-offset-4">
                        Berlangganan
                    </Button>
                </div>
            </div>

            {/* Preview Dashboard */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
                <Image
                    src="/images/dashboard-preview.svg"
                    alt="dashboard preview"
                    width={1000}
                    height={600}
                    className="drop-shadow-2xl"
                />
            </div>
        </section>
    )
}
