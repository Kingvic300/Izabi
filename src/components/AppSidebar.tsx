import { Home, History, User, LogOut, Brain } from "lucide-react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {BASE_URL} from "@/contants/contants.ts";

const navigationItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    description: "Upload and process PDFs"
  },
  {
    title: "History",
    url: "/dashboard/history",
    icon: History,
    description: "View uploaded files"
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
    description: "Manage your account"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  const handleLogout = async () => {
    const navigate = useNavigate();

    try {
      await axios.post(`${BASE_URL}/users/logout`, {}, {
        withCredentials: true
      });

      localStorage.removeItem("userId");
      localStorage.removeItem("authToken");

      console.log("Logout successful");
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }
  return (
      <Sidebar collapsible="icon">
        {/* Header */}
        <SidebarHeader className="border-b border-border p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            {!collapsed && (
                <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              Izabi
            </span>
            )}
          </div>
        </SidebarHeader>

        {/* Navigation */}
        <SidebarContent className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              {/* Added spacing between items */}
              <SidebarMenu className="mt-4">
                {navigationItems.map((item, index) => (
                    <SidebarMenuItem key={item.title} className="mb-6 last:mb-0">
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <a
                            href={item.url}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate(item.url);
                            }}
                            className="flex items-center space-x-4 p-4 rounded-lg transition-colors"
                        >
                          <item.icon className="h-6 w-6" />
                          {!collapsed && (
                              <div>
                                <span className="font-medium">{item.title}</span>
                              </div>

                          )}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer / Logout */}
        <SidebarFooter className="border-t border-border p-4">
          <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </SidebarFooter>
      </Sidebar>
  );
}
