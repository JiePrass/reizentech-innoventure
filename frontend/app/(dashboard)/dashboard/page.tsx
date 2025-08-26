"use client"

import Image from "next/image"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { SectionSumCards } from "@/components/shared/section-summary-cards"
import { useAuthMe } from "@/helpers/AuthMe"

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

export default function DashboardPage() {
  const { data: dataUser, loading, error } = useAuthMe()

  if (loading) return console.log('loadingg..')
  if (error) return console.log('error get me..', error)
  return (
    <div className="p-6 space-y-6">
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-card p-6 rounded-2xl shadow-sm">
        <Image src="/images/dashboard.png" alt="" width={200} height={200} className="object-contain md:hidden" />
        <div>
          <h1 className="text-2xl font-semibold">
            Hallo, <span className="text-primary">{dataUser?.data?.Username ?? 'Guest'}</span>
          </h1>
          <p className="text-muted-foreground max-w-sm">
            Anda telah berkontribusi mengurangi emisi karbon sebesar <span className="font-semibold">34,54 kg CO₂e</span> bulan ini
          </p>
        </div>
        <div className="gap-6 justify-center hidden md:flex">
          <Image src="/images/dashboard.png" alt="" width={200} height={200} className="object-contain" />
          <Image src="/images/dashboard-2.png" alt="" width={200} height={200} className="object-contain" />
        </div>
      </div>

      {/* Statistik Cards */}
      <SectionSumCards />

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
