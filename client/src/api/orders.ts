import { useMutation } from '@tanstack/react-query';
import api from './api';

// Define the types for the request and response structures
export interface CalculateOrderRequest {
  order: 'asc' | 'desc';
  /**
   * The order of the sort_by array determines the order of the returned data.
   * For example, if the sort_by array is ['x', 'y', 'z'], the returned data will be sorted by x, y, z.
   */
  sort_by: ['x' | 'y' | 'z', 'x' | 'y' | 'z', 'x' | 'y' | 'z'];
  products: {
    product_id: number;
    quantity: number;
  }[];
}

interface OrderDetail {
  product: string;
  piece: string;
  quantity: number;
  product_quantity: number;
  total_quantity: number;
}

export interface OrderResponseItem {
  x: number;
  y: number;
  z: number;
  total_quantity: number;
  details: OrderDetail[];
}

// API call to calculate order by size
export const useCalculateOrderBySize = () => {
  return useMutation({
    mutationFn: async (data: CalculateOrderRequest) => {
      const response = await api.post<OrderResponseItem[]>('/orders/calculate_order_by_size/', data);
      return response.data;
    },
  });
};

// API call to calculate order by product (example provided in the Python code)
export const useCalculateOrderByProduct = () => {
  return useMutation({
    mutationFn: async (data: CalculateOrderRequest) => {
      const response = await api.post('/orders/calculate_order_by_product/', data);
      return response.data;
    },
  });
};
