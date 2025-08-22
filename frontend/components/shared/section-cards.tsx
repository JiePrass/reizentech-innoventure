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

export function SectionCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      </Card>
    </div>
  )
}
