import { Route, Routes } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import OrdersPage from "@/components/pages/Orders";
import PiecesPage from "@/components/pages/Pieces";
import ProductsPage from "@/components/pages/Products";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<OrdersPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/pieces" element={<PiecesPage />} />
        <Route path="/products" element={<ProductsPage />} />
      </Routes>
    </Layout>
  )
}
