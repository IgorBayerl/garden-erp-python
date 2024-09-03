import React from 'react';
import { OrderResponseItem } from '@/api/orders';

interface OrderTableProps {
  data: OrderResponseItem[];
}

export default function OrderBySizeTable({ data }: OrderTableProps) {
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border border-gray-200 text-left align-bottom">Produto</th>
            <th className="px-4 py-2 border border-gray-200 text-left header-rotate">Qtd. Produto</th>
            <th className="px-4 py-2 border border-gray-200 text-left align-bottom">Nome Peça</th>
            <th className="px-4 py-2 border border-gray-200 text-left header-rotate">Comp.</th>
            <th className="px-4 py-2 border border-gray-200 text-left header-rotate">Larg.</th>
            <th className="px-4 py-2 border border-gray-200 text-left header-rotate">Esp.</th>
            <th className="px-4 py-2 border border-gray-200 text-left header-rotate">Qtd. P/Produto</th>
            <th className="px-4 py-2 border border-gray-200 text-left header-rotate">Qtd. Total</th>
            <th className="px-4 py-2 border border-gray-200 text-left header-rotate">Qtd. Cortar</th>
            <th className="px-4 py-2 border border-gray-200 text-left header-rotate">Qtd. Tabuas</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              {item.details.map((detail, detailIndex) => (
                <tr key={index} className="bg-white">
                  <React.Fragment key={detailIndex}>
                    <td className="px-4 py-2 border border-gray-200 text-xs">{detail.product}</td>
                    <td className="px-4 py-2 border border-gray-200 text-xs text-center">{detail.product_quantity}</td>
                    <td className="px-4 py-2 border border-gray-200 text-xs">{detail.piece}</td>
                    {detailIndex === 0 && (
                      <>
                        <td rowSpan={item.details.length} className="px-4 py-2 border border-gray-200 text-lg font-bold text-center">{item.x}</td>
                        <td rowSpan={item.details.length} className="px-4 py-2 border border-gray-200 text-lg font-bold text-center">{item.y}</td>
                        <td rowSpan={item.details.length} className="px-4 py-2 border border-gray-200 text-lg font-bold text-center">{item.z}</td>
                      </>
                    )}  
                    <td className="px-4 py-2 border border-gray-200 text-xs text-center">{detail.quantity}</td>
                    <td className="px-4 py-2 border border-gray-200 text-xs text-center">{detail.total_quantity}</td>
                    {detailIndex === 0 && (
                      <>
                        <td rowSpan={item.details.length} className="px-4 py-2 border border-gray-200 text-lg font-bold text-center">{item.total_quantity}</td>
                        <td rowSpan={item.details.length} className="px-4 py-2 border border-gray-200 text-lg font-bold text-center">{item.planks_needed}</td>
                      </>
                    )}  
                  </React.Fragment>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};