import { useMutation } from '@tanstack/react-query';
import api from '@/api/api';

// Define the types for the request and response structures
export interface CalculateOrderRequest {
  order: 'asc' | 'desc';
  plank_size: number;
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

export interface OrderResponseDetailItem {
  x: number;
  y: number;
  z: number;
  total_quantity: number;
  details: OrderDetail[];
}

export interface OrderResponseGroup {
  y: number;
  z: number;
  planks_needed: number;
  item_count: number;
  details: OrderResponseDetailItem[]; // Grouped by `sizeY` and `sizeZ`, with details for each `sizeX`
}

export interface CalculateOrderResponse {
  requested_products: {
    product: string;
    image?: string | null;
    total_quantity: number;
    pieces: number;
  }[];
  order: OrderResponseGroup[];
}

// API call to calculate order by size
export const useCalculateOrderBySize = () => {
  return useMutation({
    mutationFn: async (data: CalculateOrderRequest) => {
      const response = await api.post<CalculateOrderResponse>('/orders/calculate_order_by_size/', data);
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
