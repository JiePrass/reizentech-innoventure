import Image from "next/image"
import Link from "next/link"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardTitle } from "../ui/card"
import { ChartArea } from "lucide-react"
import { Button } from "../ui/button"
import { ChevronRight } from "lucide-react"

export default function FeatureSection() {
    return (
        <section className="bg-[#F1F4F1] container mx-auto rounded-3xl flex justify-center items-center" id="feature">
            <div className="py-24 px-4 md:max-w-7xl flex flex-col lg:p-24">
                <div className="flex flex-col items-center gap-2">
                    <Badge
                        variant="outline"
                        className="mb-4 text-gray-700 border-gray-700 px-4 py-2 font-light text-base"
                    >
                        <Image src="/icons/stars-black.svg" alt="stars" width={24} height={24} className="inline-block mr-2" />
                        Fitur Fitur Aplikasi GreenFlow
                    </Badge>
                    <div className="flex flex-col text-center items-center gap-2">
                        <h2 className="text-6xl font-medium">Jelajahi Fitur <span className="text-primary">GreenFlow</span></h2>
                        <p className="text-gray-500 text-lg max-w-md text-center">Nikmati berbagai fitur inovatif untuk mengurangi jejak karbon Anda dan berkontribusi pada lingkungan.</p>
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex flex-wrap gap-6 lg:gap-12 justify-center my-12">
                        <Card className="w-[300px]">
                            <CardContent>
                                <div className="text-primary p-1 rounded-sm shadow w-fit border-gray-100 mb-4">
                                    <ChartArea className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-xl">
                                    Lorem Ipsum Dolor
                                </CardTitle>
                                <p className="text-gray-500 mt-1">Lorem ipsum dolor sit amet consectetur. Etiam.</p>
                            </CardContent>
                        </Card>
                        <Card className="w-[300px]">
                            <CardContent>
                                <div className="text-primary p-1 rounded-sm shadow w-fit border-gray-100 mb-4">
                                    <ChartArea className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-xl">
                                    Lorem Ipsum Dolor
                                </CardTitle>
                                <p className="text-gray-500 mt-1">Lorem ipsum dolor sit amet consectetur. Etiam.</p>
                            </CardContent>
                        </Card>
                        <Card className="w-[300px]">
                            <CardContent>
                                <div className="text-primary p-1 rounded-sm shadow w-fit border-gray-100 mb-4">
                                    <ChartArea className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-xl">
                                    Lorem Ipsum Dolor
                                </CardTitle>
                                <p className="text-gray-500 mt-1">Lorem ipsum dolor sit amet consectetur. Etiam.</p>
                            </CardContent>
                        </Card>
                        <Card className="w-[300px]">
                            <CardContent>
                                <div className="text-primary p-1 rounded-sm shadow w-fit border-gray-100 mb-4">
                                    <ChartArea className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-xl">
                                    Lorem Ipsum Dolor
                                </CardTitle>
                                <p className="text-gray-500 mt-1">Lorem ipsum dolor sit amet consectetur. Etiam.</p>
                            </CardContent>
                        </Card>
                        <Card className="w-[300px]">
                            <CardContent>
                                <div className="text-primary p-1 rounded-sm shadow w-fit border-gray-100 mb-4">
                                    <ChartArea className="w-8 h-8" />
                                </div>
                                <CardTitle className="text-xl">
                                    Lorem Ipsum Dolor
                                </CardTitle>
                                <p className="text-gray-500 mt-1">Lorem ipsum dolor sit amet consectetur. Etiam.</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="flex justify-center">
                        <Button className="rounded-full bg-white text-primary font-normal hover:text-white" asChild>
                            <Link href="/dashboard">Masuk Dashboard <ChevronRight /></Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}