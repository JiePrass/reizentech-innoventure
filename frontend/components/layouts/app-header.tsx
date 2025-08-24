"use client"

import Image from "next/image"
import { ChevronDown, LogOut, Settings, User } from "lucide-react"
import { IconBellFilled } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthMe } from "@/helpers/AuthMe"

export function AppHeader() {
  const { data: dataUser, loading, error } = useAuthMe()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error}</p>
  console.log(dataUser  )
  return (
    <header className="flex py-4 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Dashboard</h1>

        <div className="ml-auto flex items-center gap-4">
          {/* 🔔 Notifikasi */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <IconBellFilled />
                {/* indikator notif */}
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>✅ Project berhasil dibuat</DropdownMenuItem>
              <DropdownMenuItem>⚠️ Server sedang maintenance</DropdownMenuItem>
              <DropdownMenuItem>📩 Pesan baru dari tim</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 👤 Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <Image
                  src="/images/profile.png"
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">{dataUser?.data?.Username ?? 'Guest'}</span>
                  <span className="text-xs text-muted-foreground">{dataUser?.data?.Role ?? 'User'}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Pengaturan</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
