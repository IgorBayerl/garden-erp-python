import React from 'react';
import { type CalculateOrderResponse } from '@/api/orders';

interface OrderTableProps {
  data: CalculateOrderResponse;
}

export default function OrderBySizeTable({ data }: OrderTableProps) {
  const itemsDetails = data.order;

  let rowColorToggle = true

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse table-border">
        <thead className="table-bg-accent">
          <tr>
            <th className="px-4 py-2 table-border text-left align-bottom">Produto</th>
            <th className="px-4 py-2 table-border text-left header-rotate">Qtd. Produto</th>
            <th className="px-4 py-2 table-border text-left align-bottom">Nome Peça</th>
            <th className="px-4 py-2 table-border text-left header-rotate">Comp.</th>
            <th className="px-4 py-2 table-border text-left header-rotate">Larg.</th>
            <th className="px-4 py-2 table-border text-left header-rotate">Esp.</th>
            <th className="px-4 py-2 table-border text-left header-rotate">Qtd. P/Produto</th>
            <th className="px-4 py-2 table-border text-left header-rotate">Qtd. Total</th>
            <th className="px-4 py-2 table-border text-left header-rotate">Qtd. Cortar</th>
            <th className="px-4 py-2 table-border text-left header-rotate">Qtd. Tabuas</th>
          </tr>
        </thead>
        <tbody>
          {itemsDetails.map((item_bitola, index_bitola) => {
            let firstRenderPlanksNeeded = true;

            return (
              <React.Fragment key={index_bitola}>
                {item_bitola.details.map((item_size, index_size) => {
                  let firstRenderForSize = true;
                  const rowColorClass = rowColorToggle  ? "bg-white" : "table-bg-accent";
                  rowColorToggle = !rowColorToggle;
                  
                  return (
                    <React.Fragment key={index_size}>
                      {item_size.details.map((detail, detailIndex) => (
                        <tr key={detailIndex} className={rowColorClass}>
                          <React.Fragment key={detailIndex}>
                            <td className="px-4 py-2 table-border text-xs">{detail.product}</td>
                            <td className="px-4 py-2 table-border text-xs text-center">{detail.product_quantity}</td>
                            <td className="px-4 py-2 table-border text-xs">{detail.piece}</td>

                            {firstRenderForSize && (
                              <>
                                <td rowSpan={item_size.details.length} className="px-4 py-2 table-border text-lg font-bold text-center">{item_size.x}</td>
                                <td rowSpan={item_size.details.length} className="px-4 py-2 table-border text-lg font-bold text-center">{item_size.y}</td>
                                <td rowSpan={item_size.details.length} className="px-4 py-2 table-border text-lg font-bold text-center">{item_size.z}</td>
                              </>
                            )}
                            
                            <td className="px-4 py-2 table-border text-xs text-center">{detail.quantity}</td>
                            <td className="px-4 py-2 table-border text-xs text-center">{detail.total_quantity}</td>

                            {firstRenderForSize && (
                              <td rowSpan={item_size.details.length} className="px-4 py-2 table-border text-lg font-bold text-center">{item_size.total_quantity}</td>
                            )}

                            {firstRenderPlanksNeeded && (
                              <td rowSpan={item_bitola.item_count} className="px-4 py-2 table-border text-lg font-bold text-center bg-white">
                                {item_bitola.planks_needed}
                              </td>
                            )}
                            {firstRenderPlanksNeeded = false}
                            {firstRenderForSize = false}
                          </React.Fragment>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
