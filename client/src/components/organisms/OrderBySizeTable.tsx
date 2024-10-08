import React from 'react';
import { type CalculateOrderResponse } from '@/api/orders';
import Image from "../ui/image";
import { cn } from '@/lib/utils';

interface OrderTableProps {
  data: CalculateOrderResponse;
}

export default function OrderBySizeTable({ data }: OrderTableProps) {
  const itemsDetails = data.order;

  let rowColorToggle = true

  const formatedDateTime = new Date().toLocaleString('pt-BR');

  return (
    <div className="overflow-x-auto">
      <div className='gap-4 print:flex hidden flex-wrap print-images-header'>
        {data.requested_products.map((product) => (
          <div key={product.product} className="flex gap-2 flex-col pb-2">
            <Image
              src={product.image || undefined}
              alt={product.product}
              className="h-32 w-32 max-w-full rounded-lg object-scale-down bg-secondary aspect-square"
            />
            <div className="flex flex-col gap-2 items-center max-w-[8rem]">
              <h2 className="text-center truncate w-full text-xs">{product.product}</h2>
              <p className="text-xs text-muted-foreground w-full text-center">{product.total_quantity}</p>
            </div>
          </div>
        ))}
      </div>
      {/* The date/time that will appear on every page */}
      <div className="print:block print-date hidden">{formatedDateTime}</div>
      <table className="min-w-full border-collapse table-border">
        <thead className="table-bg-accent">
          <tr>
            <th className="table-cell-padding table-border text-left align-bottom">Produto</th>
            <th className="table-cell-padding table-border text-left header-rotate">Qtd. Produto</th>
            <th className="table-cell-padding table-border text-left align-bottom">Nome Peça</th>
            <th className="table-cell-padding table-border text-left header-rotate">Comp.</th>
            <th className="table-cell-padding table-border text-left header-rotate">Larg.</th>
            <th className="table-cell-padding table-border text-left header-rotate">Esp.</th>
            <th className="table-cell-padding table-border text-left header-rotate">Qtd. P/Produto</th>
            <th className="table-cell-padding table-border text-left header-rotate">Qtd. Total</th>
            <th className="table-cell-padding table-border text-left header-rotate">Qtd. Cortar</th>
            <th className="table-cell-padding table-border text-left header-rotate">Qtd. Tabuas</th>
          </tr>
        </thead>
        <tbody>
          {itemsDetails.map((item_bitola, index_bitola) => {
            let firstRenderPlanksNeeded = true;

            return (
              <React.Fragment key={index_bitola}>
                {item_bitola.details.map((item_size, index_size) => {
                  let firstRenderForSize = true;
                  const classRow = cn(
                    rowColorToggle ? 'bg-white' : 'table-bg-accent',
                  )

                  rowColorToggle = !rowColorToggle;
                 
                  return (
                    <React.Fragment key={index_size}>
                      {item_size.details.map((detail, detailIndex) => (
                        <tr
                          key={detailIndex} 
                          className={classRow}
                        >
                          <React.Fragment key={detailIndex}>
                            <td className="table-cell-padding table-border table-text-sm">{detail.product}</td>
                            <td className="table-cell-padding table-border table-text-sm text-center">{detail.product_quantity}</td>
                            <td className="table-cell-padding table-border table-text-sm">{detail.piece}</td>

                            {firstRenderForSize && (
                              <>
                                <td rowSpan={item_size.details.length} className="table-cell-padding table-border table-text-lg font-bold text-center">{item_size.x}</td>
                                <td rowSpan={item_size.details.length} className="table-cell-padding table-border table-text-lg font-bold text-center">{item_size.y}</td>
                                <td rowSpan={item_size.details.length} className="table-cell-padding table-border table-text-lg font-bold text-center">{item_size.z}</td>
                              </>
                            )}
                            
                            <td className="table-cell-padding table-border table-text-sm text-center">{detail.quantity}</td>
                            <td className="table-cell-padding table-border table-text-sm text-center">{detail.total_quantity}</td>

                            {firstRenderForSize && (
                              <td rowSpan={item_size.details.length} className="avoid-break table-cell-padding table-border table-text-lg font-bold text-center">{item_size.total_quantity}</td>
                            )}

                            {firstRenderPlanksNeeded && (
                              <td rowSpan={item_bitola.item_count} className="table-cell-padding table-border table-text-lg font-bold text-center bg-white">
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
