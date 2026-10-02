import { ModeToggle } from "@/components/mode-toggle"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router"
import { AppSidebar } from "../Sidebar/main-sidebar"

export const SidebarLayout = () => {
  return (
    <SidebarProvider className="flex">
      <AppSidebar />
      <div className="flex-1 flex flex-col overflow-x-hidden">
        <div className="min-h-[60px] items-center border-b justify-between flex px-2">
          <SidebarTrigger />
          <ModeToggle />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  )
}
