import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 min-h-screen max-h-screen">
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-semibold text-center">Bem vindo</h1>
          <div className="flex gap-4">
            <Link to="/products" className="w-80">
              <Card className="w-full cursor-pointer hover:bg-secondary transition-colors">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Produtos</h2>
                </CardHeader>
                <CardContent>
                  <p>Cadastre novos produtos e altere os detalhes dos produtos existentes.</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/orders" className="w-80">
              <Card className="w-full cursor-pointer hover:bg-secondary transition-colors">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Ordem de produção</h2>
                </CardHeader>
                <CardContent>
                  <p>Selecione produtos e gere ordens de produção.</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
