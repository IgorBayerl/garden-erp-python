import { Package, Factory, Home } from "lucide-react";
import GardenLogo from "@/components/ui/garden-logo";
import SidebarItem from "@/components/layout/SidebarItem";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
  return (
    <div className="border-r bg-muted/40 block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex items-center border-b px-4">
          <div className="my-2 px-4">
            <GardenLogo />
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <nav className="grid items-start text-sm font-medium px-4">
            <SidebarItem
              to="/"
              label="Início"
              icon={<Home className="h-4 w-4" />}
            />
            <SidebarItem
              to="/orders"
              label="Ordens de produção"
              icon={<Factory className="h-4 w-4" />}
              // badgeCount={6}
            />
            <Separator className="my-2" />
            <SidebarItem
              to="/products"
              label="Produtos"
              icon={<Package className="h-4 w-4" />}
            />
          </nav>
          <div className="px-4 py-4">
            <SidebarItem 
              to="/updates" 
              label="Atualizações"
              icon={<Package className="h-4 w-4" />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
