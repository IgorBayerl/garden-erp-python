import { Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import OrdersPage from "@/components/pages/Orders";
import PiecesPage from "@/components/pages/Pieces";
import ProductsPage from "@/components/pages/Products";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/sonner";
import DataTable from "@/components/pages/TestTable";
import Dashboard from "@/components/pages/Dashboard";

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/pieces" element={<PiecesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/test" element={<DataTable />} />
        </Routes>
      </Layout>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  )
}
