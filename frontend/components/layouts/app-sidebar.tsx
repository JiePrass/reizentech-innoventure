"use client"

import * as React from "react"
import {
  IconShoppingCartFilled,
  IconLayoutDashboardFilled,
  IconCarFilled,
  IconDeviceMobileFilled,
  IconHelp,
  IconSparkles,
  IconSettings,
  IconTargetArrow,
  IconTrophyFilled,
  IconAwardFilled,
} from "@tabler/icons-react"

import { NavMain } from "@/components/shared/nav-main"
import { NavSecondary } from "@/components/shared/nav-secondary"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { NavTracker } from "../shared/nav-tracker"
import { NavGamifikasi } from "../shared/nav-gamifikasi"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: IconLayoutDashboardFilled,
    },
    {
      title: "ChatBot AI",
      url: "#",
      icon: IconSparkles,
    },
    {
      title: "Toko Penukaran",
      url: "#",
      icon: IconShoppingCartFilled,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: IconHelp,
    },
  ],
  navTracker: [
    {
      title: "Karbon Kendaraan",
      url: "#",
      icon: IconCarFilled,
    },
    {
      title: "Karbon Alat Elektronik",
      url: "#",
      icon: IconDeviceMobileFilled,
    },
  ],
  navGamifikasi: [
    {
      title: "Misi Harian",
      url: "#",
      icon: IconTargetArrow,
    },
    {
      title: "Lencana Saya",
      url: "#",
      icon: IconAwardFilled,
    },
    {
      title: "Papan Peringkat",
      url: "#",
      icon: IconTrophyFilled,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <Image src="/icons/main-logo.svg" alt="Logo" width={150} height={150} />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavTracker items={data.navTracker} />
        <NavGamifikasi items={data.navGamifikasi} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  )
}
