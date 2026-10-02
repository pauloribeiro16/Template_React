import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { RouteEnum } from "@/config/constants"
import { Home, Settings, Users } from "lucide-react"
import { Link } from "react-router"

const items = [
  { title: "Início", url: RouteEnum.HOME, icon: Home },
  { title: "Utilizadores", url: RouteEnum.HOME, icon: Users },
  { title: "Definições", url: RouteEnum.HOME, icon: Settings },
]

function Header() {
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            React Template
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}

function Content() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navegação</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  {/* Link do react-router, nunca <a href> — é uma SPA */}
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}

function Footer() {
  return (
    <SidebarFooter>
      <p className="px-2 text-xs text-muted-foreground">
        frontend · backend · prisma
      </p>
    </SidebarFooter>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <Header />
      <Content />
      <Footer />
    </Sidebar>
  )
}
