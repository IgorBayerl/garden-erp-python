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
            <th className="px-4 py-2 border border-gray-200 text-left text-xs">Produto</th>
            <th className="px-4 py-2 border border-gray-200 text-left text-xs">Qtd. Produto</th>
            <th className="px-4 py-2 border border-gray-200 text-left text-xs">Nome Peça</th>
            <th className="px-4 py-2 border border-gray-200 text-left">Comp.</th>
            <th className="px-4 py-2 border border-gray-200 text-left">Larg.</th>
            <th className="px-4 py-2 border border-gray-200 text-left">Esp.</th>
            <th className="px-4 py-2 border border-gray-200 text-left text-xs">Qtd. P/Produto</th>
            <th className="px-4 py-2 border border-gray-200 text-left text-xs">Qtd. Total</th>
            <th className="px-4 py-2 border border-gray-200 text-left">Quant. Cortar</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <React.Fragment key={index}>
              {item.details.map((detail, detailIndex) => (
                <tr key={index} className="bg-white">
                  <React.Fragment key={detailIndex}>
                    <td className="px-4 py-2 border border-gray-200 text-xs">{detail.product}</td>
                    <td className="px-4 py-2 border border-gray-200 text-xs">{detail.product_quantity}</td>
                    <td className="px-4 py-2 border border-gray-200 text-xs">{detail.piece}</td>
                    {detailIndex === 0 && (
                      <>
                        <td rowSpan={item.details.length} className="px-4 py-2 border border-gray-200 text-lg font-bold">{item.x}</td>
                        <td rowSpan={item.details.length} className="px-4 py-2 border border-gray-200 text-lg font-bold">{item.y}</td>
                        <td rowSpan={item.details.length} className="px-4 py-2 border border-gray-200 text-lg font-bold">{item.z}</td>
                      </>
                    )}  
                    <td className="px-4 py-2 border border-gray-200 text-xs">{detail.quantity}</td>
                    <td className="px-4 py-2 border border-gray-200 text-xs">{detail.total_quantity}</td>
                    {detailIndex === 0 && (
                      <td rowSpan={item.details.length} className="px-4 py-2 border border-gray-200 text-lg font-bold">{item.total_quantity}</td>
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

// export default function OrderBySizeTable() {
  
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full border-collapse border border-gray-200">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="px-4 py-2 border border-gray-200 text-left text-xs">Produto</th>
//             <th className="px-4 py-2 border border-gray-200 text-left text-xs">Quant. Produto</th>
//             <th className="px-4 py-2 border border-gray-200 text-left text-xs">Nome Peça</th>
//             <th className="px-4 py-2 border border-gray-200 text-left text-xs">Qtd. Prod</th>
//             <th className="px-4 py-2 border border-gray-200 text-left text-xs">Qtd Total</th>
//             <th className="px-4 py-2 border border-gray-200 text-left">Comp.</th>
//             <th className="px-4 py-2 border border-gray-200 text-left">Larg.</th>
//             <th className="px-4 py-2 border border-gray-200 text-left">Esp.</th>
//             <th className="px-4 py-2 border border-gray-200 text-left">Quant. Cortar</th>
//           </tr>
//         </thead>
//         <tbody>
//           {mockData.map((item, index) => (
//             <tr key={index} className="bg-white">
              
//               <td colSpan={5} className="border border-gray-200">
//                 <tbody>
//                   <tr>
//                     <td className="px-4 py-2 border border-gray-200 text-xs">{item.details[0].product}</td>
//                     <td className="px-4 py-2 border border-gray-200 text-xs">{item.details[0].quantity}</td>
//                     <td className="px-4 py-2 border border-gray-200 text-xs">{item.details[0].piece}</td>
//                     <td className="px-4 py-2 border border-gray-200 text-xs">{item.details[0].product_quantity}</td>
//                     <td className="px-4 py-2 border border-gray-200 text-xs">{item.details[0].total_quantity}</td>
//                   </tr>
//                 </tbody>
//               </td>

//               <td className="px-4 py-2 border border-gray-200 text-sm">{item.x}</td>
//               <td className="px-4 py-2 border border-gray-200 text-sm">{item.y}</td>
//               <td className="px-4 py-2 border border-gray-200 text-sm">{item.z}</td>
//               <td className="px-4 py-2 border border-gray-200 text-sm">{item.total_quantity}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );

// };