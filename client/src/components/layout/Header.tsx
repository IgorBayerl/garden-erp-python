import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
    <header className="flex items-center gap-4 border-b bg-muted/40 h-[60px] px-6">
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="appearance-none bg-background pl-8 shadow-none w-1/3"
            />
          </div>
        </form>
      </div>
    </header>
  )
}