import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function AboutSection() {
    return (
        <section className="container mx-auto py-16" id="about">
            <div className="flex justify-between items-center">

                <div className="flex w-1/2 flex-col justify-between gap-16">
                    <div className="flex flex-col gap-2">
                        <Badge
                            variant="outline"
                            className="mb-4 text-gray-700 border-gray-700 px-4 py-2 font-light text-base"
                        >
                            <Image src="/icons/stars-black.svg" alt="stars" width={24} height={24} className="inline-block mr-2" />
                            Perkenalan Aplikasi GreenFlow
                        </Badge>
                        <h2 className="text-6xl font-medium">Apa Itu <span className="text-primary">GreenFlow?</span></h2>
                    </div>
                    <Button className="rounded-full px-[32px] text-base w-fit" asChild>
                        <Link href="/dashboard">
                            Mulai dan Masuk Dashboard<ChevronRight />
                        </Link>
                    </Button>
                </div>
                <p className="text-4xl text-gray-700 w-1/2">
                    GreenFlow adalah aplikasi untuk memantau jejak karbon dan <span className="opacity-70">berpartisipasi dalam program pengurangan karbon.</span>
                </p>
            </div>

            <div className="flex gap-8 py-12">
                <Card className="flex w-full flex-row items-center rounded-2xl p-0 bg-gradient-to-tr from-[#C8EAD8] to-[#DFF1EF] max-w-[600px]">
                    <CardContent className="p-8 flex justify-between flex-col h-full">
                        <CardTitle className="text-2xl font-semibold mb-2">
                            Atur Jadwal, <br /> Kolaborasi Lebih <br /> Mudah
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Lorem ipsum dolor sit amet consectetur. Maecenas diam sit nunc
                            bibendum
                        </p>
                    </CardContent>
                    <div className="w-full md:w-1/2 h-40 md:h-auto">
                        <Image
                            src="/images/flower.png" // ganti dengan gambar kamu
                            alt="feature"
                            className="object-cover w-full h-full max-w-[320px]"
                            width={500}
                            height={500}
                        />
                    </div>
                </Card>

                <Card className="rounded-2xl bg-gradient-to-tr from-[#27423B] to-primary text-white justify-between">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">
                            Atur Jadwal, <br /> Kolaborasi Lebih Mudah
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm opacity-90">
                            Lorem ipsum dolor sit amet consectetur. Maecenas diam sit nunc
                            bibendum
                        </p>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl bg-gradient-to-tr from-[#27423B] to-primary text-white justify-between">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold">
                            Atur Jadwal, <br /> Kolaborasi Lebih Mudah
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm opacity-90">
                            Lorem ipsum dolor sit amet consectetur. Maecenas diam sit nunc
                            bibendum
                        </p>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}