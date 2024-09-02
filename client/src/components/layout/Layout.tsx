// import Header from "@/components/layout/Header"
import Sidebar from "@/components/layout/Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="grid min-h-screen w-full grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        {/* <Header /> */}
        <main className="flex flex-1">{children}</main>
      </div>
    </div>
  )
}
