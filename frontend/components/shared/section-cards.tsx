import { IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GetElectricityTracker } from "@/helpers/GetElectricityTracker"
import { useEffect, useState } from "react"

export function SectionCards() {
  const { data: dataElectricty } = GetElectricityTracker()
  
  const [totalEmission, setTotalEmission] = useState(0)

  useEffect(() => {
    if (dataElectricty?.data && dataElectricty?.data?.length > 0) {
      // hitung sum emisi
      const sum = dataElectricty.data.reduce((acc, d) => {
        return acc + (d.power_watts * 0.0275)
      }, 0)
      setTotalEmission(sum)
    }
  }, [dataElectricty?.data])
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
      <Card className="gap-0">
        <CardHeader className="flex gap-4 mb-2">
          <CardTitle className="font-normal text-sm">Total Karbon Yang Dihasilkan</CardTitle>
          <Badge variant="outline" className="mt-2">
            <IconTrendingUp className="w-4 h-4 mr-1" /> +11.0%
          </Badge>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-[28px] whitespace-nowrap font-semibold text-black mb-4">
            {totalEmission.toFixed(2)} kg CO₂e
          </CardDescription>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Kenaikan Bulan Ini</p>
        </CardFooter>
      </Card>
      {/* <Card className="gap-0">
        <CardHeader className="flex gap-4 mb-2">
          <CardTitle className="font-normal text-sm">Total Karbon Yang Dihasilkan</CardTitle>
          <Badge variant="outline" className="mt-2">
            <IconTrendingUp className="w-4 h-4 mr-1" /> +11.0%
          </Badge>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-[28px] whitespace-nowrap font-semibold text-black mb-4">
            34,54 kg CO₂e
          </CardDescription>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Kenaikan Bulan Ini</p>
        </CardFooter>
      </Card>
      <Card className="gap-0">
        <CardHeader className="flex gap-4 mb-2">
          <CardTitle className="font-normal text-sm">Total Karbon Yang Dihasilkan</CardTitle>
          <Badge variant="outline" className="mt-2">
            <IconTrendingUp className="w-4 h-4 mr-1" /> +11.0%
          </Badge>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-[28px] whitespace-nowrap font-semibold text-black mb-4">
            34,54 kg CO₂e
          </CardDescription>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Kenaikan Bulan Ini</p>
        </CardFooter>
      </Card>
      <Card className="gap-0">
        <CardHeader className="flex gap-4 mb-2">
          <CardTitle className="font-normal text-sm">Total Karbon Yang Dihasilkan</CardTitle>
          <Badge variant="outline" className="mt-2">
            <IconTrendingUp className="w-4 h-4 mr-1" /> +11.0%
          </Badge>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-[28px] whitespace-nowrap font-semibold text-black mb-4">
            34,54 kg CO₂e
          </CardDescription>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">Kenaikan Bulan Ini</p>
        </CardFooter>
      </Card> */}
    </div>
  )
}
